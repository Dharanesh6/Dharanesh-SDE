// TypeScript Port of Dharanesh's Python handDetector Class (OpenCV + MediaPipe)

export interface HandLandmark {
  id: number;
  x: number;
  y: number;
  z?: number;
}

export const HAND_CONNECTIONS: [number, number][] = [
  // Palm
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [5, 9], [9, 10], [10, 11], [11, 12], // Middle
  [9, 13], [13, 14], [14, 15], [15, 16], // Ring
  [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [0, 17], // Wrist to Pinky base
];

export class HandDetector {
  public mode: boolean;
  public maxHands: number;
  public detectionCon: number;
  public trackCon: number;

  private mpHandsInstance: any = null;
  private isMpReady: boolean = false;
  private lastLandmarks: any[] = [];

  constructor(mode = false, maxHands = 2, detectionCon = 0.5, trackCon = 0.5) {
    this.mode = mode;
    this.maxHands = maxHands;
    this.detectionCon = detectionCon;
    this.trackCon = trackCon;

    this.initMediaPipe();
  }

  private initMediaPipe() {
    if (typeof window !== 'undefined' && (window as any).Hands) {
      try {
        const HandsClass = (window as any).Hands;
        this.mpHandsInstance = new HandsClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        this.mpHandsInstance.setOptions({
          maxNumHands: this.maxHands,
          modelComplexity: 1,
          minDetectionConfidence: this.detectionCon,
          minTrackingConfidence: this.trackCon,
        });

        this.mpHandsInstance.onResults((results: any) => {
          if (results && results.multiHandLandmarks) {
            this.lastLandmarks = results.multiHandLandmarks;
          } else {
            this.lastLandmarks = [];
          }
        });

        this.isMpReady = true;
      } catch {
        this.isMpReady = false;
      }
    }
  }

  private isProcessing = false;

  /**
   * findHands(img, draw=True)
   * Processes the video element or canvas image and draws 21-landmark skeleton.
   */
  public async findHands(
    ctx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    width: number,
    height: number,
    draw = true
  ): Promise<void> {
    if (!this.isProcessing && this.isMpReady && this.mpHandsInstance && video.readyState >= 2) {
      this.isProcessing = true;
      this.mpHandsInstance.send({ image: video })
        .catch(() => {})
        .finally(() => {
          this.isProcessing = false;
        });
    }

    if (draw && this.lastLandmarks.length > 0) {
      for (const handLms of this.lastLandmarks) {
        // Draw MediaPipe Skeletal Connections
        ctx.strokeStyle = '#22D3EE';
        ctx.lineWidth = 2.5;

        for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
          const p1 = handLms[startIdx];
          const p2 = handLms[endIdx];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo((1 - p1.x) * width, p1.y * height);
            ctx.lineTo((1 - p2.x) * width, p2.y * height);
            ctx.stroke();
          }
        }

        // Draw 21 Landmark Nodes (Magenta / Violet / Cyan)
        for (let i = 0; i < handLms.length; i++) {
          const lm = handLms[i];
          const cx = (1 - lm.x) * width;
          const cy = lm.y * height;

          ctx.fillStyle = i === 4 || i === 8 ? '#FF00FF' : '#3B82F6';
          ctx.beginPath();
          ctx.arc(cx, cy, i === 4 || i === 8 ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  /**
   * findPosition(img, handNo=0, draw=True, color = (255, 0, 255), z_axis=False)
   * Extracts exact 21 landmark coordinate positions [id, cx, cy, cz].
   */
  public findPosition(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    handNo = 0,
    draw = true,
    color = '#FF00FF',
    z_axis = false
  ): number[][] {
    const lmList: number[][] = [];

    if (this.lastLandmarks.length > handNo) {
      const myHand = this.lastLandmarks[handNo];

      for (let id = 0; id < myHand.length; id++) {
        const lm = myHand[id];
        const cx = Math.round((1 - lm.x) * width);
        const cy = Math.round(lm.y * height);

        if (!z_axis) {
          lmList.push([id, cx, cy]);
        } else {
          const cz = Math.round((lm.z || 0) * 1000) / 1000;
          lmList.push([id, cx, cy, cz]);
        }

        if (draw) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(cx, cy, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    return lmList;
  }

  public hasHands(): boolean {
    return this.lastLandmarks.length > 0;
  }
}

export const defaultHandDetector = new HandDetector(false, 2, 0.5, 0.5);

// The exact python template reference preserved for architectural review
export const PYTHON_HAND_DETECTOR_SOURCE = `import cv2
import mediapipe as mp
import time

class handDetector():
    def __init__(self, mode=False, maxHands=2, detectionCon=0.5, trackCon=0.5):
        self.mode = mode
        self.maxHands = maxHands
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands,
                                        self.detectionCon, self.trackCon)
        self.mpDraw = mp.solutions.drawing_utils

    def findHands(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)

        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks:
                if draw:
                    self.mpDraw.draw_landmarks(img, handLms,
                                               self.mpHands.HAND_CONNECTIONS)
        return img

    def findPosition(self, img, handNo=0, draw=True, color = (255, 0, 255), z_axis=False):
        lmList = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
            for id, lm in enumerate(myHand.landmark):
                h, w, c = img.shape
                if z_axis == False:
                    cx, cy = int(lm.x * w), int(lm.y * h)
                    lmList.append([id, cx, cy])
                elif z_axis:
                    cx, cy, cz = int(lm.x * w), int(lm.y * h), round(lm.z, 3)
                    lmList.append([id, cx, cy, cz])

                if draw:
                    cv2.circle(img, (cx, cy), 5, color, cv2.FILLED)

        return lmList

def main():
    pTime = 0
    cTime = 0
    cap = cv2.VideoCapture(0)
    detector = handDetector(maxHands=1)
    while True:
        success, img = cap.read()
        img = detector.findHands(img)
        lmList = detector.findPosition(img, z_axis=True, draw=False)
        if len(lmList) != 0:
            print("Thumb Tip (ID:4):", lmList[4])
            print("Index Tip (ID:8):", lmList[8])

        cTime = time.time()
        fps = 1 / (cTime - pTime)
        pTime = cTime

        cv2.putText(img, str(int(fps)), (10, 70), cv2.FONT_HERSHEY_PLAIN, 3,
                    (255, 0, 255), 3)

        cv2.imshow("Image", img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

if __name__ == "__main__":
    main()
`;
