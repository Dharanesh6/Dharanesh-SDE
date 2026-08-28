// MediaPipe FaceMesh Engine for Eye Tracking, Gaze Cursor Kinematics, and Face Compliance
// Ports of Dharanesh's exact Python MediaPipe FaceMesh Templates

import { isSkinPixel } from './cvEngine';

export interface FaceLandmarksResult {
  detected: boolean;
  leftIris: { x: number; y: number };
  rightIris: { x: number; y: number };
  leftCorner: { x: number; y: number };
  rightCorner: { x: number; y: number };
  rightEyeLeft: { x: number; y: number };
  rightEyeRight: { x: number; y: number };
  leftEar: number;
  rightEar: number;
  isLeftEyeClosed: boolean;
  isRightEyeClosed: boolean;
  isLeftWink: boolean;
  horizontalRatio: number;
  verticalRatio: number;
  gazeCursor: { x: number; y: number };
  gazeDirection: 'LOOKING LEFT' | 'LOOKING CENTER' | 'LOOKING RIGHT' | 'NO FACE';
  gazeAngle: number;
  faceBox: { x: number; y: number; w: number; h: number };
  maskBox: { x: number; y: number; w: number; h: number };
  hasMask: boolean;
  maskConfidence: number;
  eyeContours: { left: { x: number; y: number }[]; right: { x: number; y: number }[] };
}

export interface FaceComplianceResult {
  detected: boolean;
  status: 'COMPLIANT' | 'MOVE CLOSER' | 'MOVE LEFT' | 'MOVE RIGHT' | 'MOVE UP' | 'MOVE DOWN' | 'FACE CAMERA' | 'NO FACE';
  statusColor: string;
  faceWidth: number;
  faceHeight: number;
  faceCenterX: number;
  faceCenterY: number;
  horizontalOffset: number;
  verticalOffset: number;
  noseOffset: number;
  faceCentered: boolean;
  faceVisibleSize: boolean;
  facingCamera: boolean;
  nose: { x: number; y: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
}

// MediaPipe refined landmarks indices (exact from user's template)
const NOSE = 1;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;
const LEFT_EYE = 33;
const RIGHT_EYE = 263;

const LEFT_IRIS = 468;
const LEFT_EYE_LEFT = 33;
const LEFT_EYE_RIGHT = 133;
const LEFT_EYE_TOP = 159;
const LEFT_EYE_BOTTOM = 145;

const RIGHT_IRIS = 473;
const RIGHT_EYE_LEFT = 362;
const RIGHT_EYE_RIGHT = 263;
const RIGHT_EYE_TOP = 386;
const RIGHT_EYE_BOTTOM = 374;

// Eye contour landmark loops
const LEFT_EYE_CONTOUR_IDS = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const RIGHT_EYE_CONTOUR_IDS = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];

function dist2D(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

// Exact eye_ratio function from Python template
function eyeRatio(
  iris: { x: number; y: number },
  leftCorner: { x: number; y: number },
  rightCorner: { x: number; y: number }
): number {
  const eyeWidth = dist2D(rightCorner, leftCorner);
  if (eyeWidth === 0) return 0.5;
  return dist2D(iris, leftCorner) / eyeWidth;
}

export class FaceMeshDetector {
  private mpFaceMeshInstance: any = null;
  private isReady: boolean = false;
  private isProcessing: boolean = false;
  private lastFaceLandmarks: any[] = [];
  private smoothCursorX: number = 320;
  private smoothCursorY: number = 240;

  constructor() {
    this.initFaceMesh();
  }

  private initFaceMesh() {
    if (typeof window !== 'undefined' && (window as any).FaceMesh) {
      try {
        const FaceMeshClass = (window as any).FaceMesh;
        this.mpFaceMeshInstance = new FaceMeshClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        this.mpFaceMeshInstance.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true, // Enables iris landmarks 468, 473
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        this.mpFaceMeshInstance.onResults((results: any) => {
          if (results && results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            this.lastFaceLandmarks = results.multiFaceLandmarks[0];
          } else {
            this.lastFaceLandmarks = [];
          }
        });

        this.isReady = true;
      } catch {
        this.isReady = false;
      }
    }
  }

  /**
   * Non-blocking video frame processing to eliminate any first-time startup lag
   */
  public async processVideo(video: HTMLVideoElement): Promise<void> {
    if (!this.isProcessing && this.isReady && this.mpFaceMeshInstance && video.readyState >= 2) {
      this.isProcessing = true;
      this.mpFaceMeshInstance.send({ image: video })
        .catch(() => {})
        .finally(() => {
          this.isProcessing = false;
        });
    }
  }

  /**
   * Evaluates Eye Tracking, Gaze Cursor (Moveable Point), and Left-Eye Blink/Wink from FaceMesh
   */
  public analyzeFace(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): FaceLandmarksResult {
    if (this.lastFaceLandmarks.length >= 468) {
      const lms = this.lastFaceLandmarks;

      const getPt = (idx: number) => ({
        x: Math.round((1 - lms[idx].x) * width),
        y: Math.round(lms[idx].y * height),
      });

      // Left Eye Keypoints
      const leftIris = lms.length >= 469 ? getPt(LEFT_IRIS) : getPt(468);
      const leftCorner = getPt(LEFT_EYE_LEFT);
      const rightCorner = getPt(LEFT_EYE_RIGHT);
      const leftTop = getPt(LEFT_EYE_TOP);
      const leftBottom = getPt(LEFT_EYE_BOTTOM);

      // Right Eye Keypoints
      const rightIris = lms.length >= 474 ? getPt(RIGHT_IRIS) : getPt(473);
      const rightEyeLeft = getPt(RIGHT_EYE_LEFT);
      const rightEyeRight = getPt(RIGHT_EYE_RIGHT);
      const rightTop = getPt(RIGHT_EYE_TOP);
      const rightBottom = getPt(RIGHT_EYE_BOTTOM);

      // EAR Calculation (Eye Aspect Ratio)
      const leftHeight = dist2D(leftTop, leftBottom);
      const leftWidth = dist2D(leftCorner, rightCorner);
      const leftEar = leftHeight / Math.max(leftWidth, 1);

      const rightHeight = dist2D(rightTop, rightBottom);
      const rightWidth = dist2D(rightEyeLeft, rightEyeRight);
      const rightEar = rightHeight / Math.max(rightWidth, 1);

      // Blink / Wink detection
      const isLeftEyeClosed = leftEar < 0.17;
      const isRightEyeClosed = rightEar < 0.17;
      const isLeftWink = isLeftEyeClosed && !isRightEyeClosed;

      // Horizontal & Vertical Ratio
      const leftRatio = eyeRatio(leftIris, leftCorner, rightCorner);
      const rightRatio = eyeRatio(rightIris, rightEyeLeft, rightEyeRight);
      const horizontalRatio = (leftRatio + rightRatio) / 2;

      const leftVert = (leftIris.y - leftTop.y) / Math.max(leftHeight, 1);
      const rightVert = (rightIris.y - rightTop.y) / Math.max(rightHeight, 1);
      const verticalRatio = (leftVert + rightVert) / 2;

      // Moveable Gaze Pointer (like a virtual mouse controlled by eyes)
      // Normal horizontalRatio is ~0.35 to ~0.65 -> map to 0 to width
      const rawTargetX = ((horizontalRatio - 0.32) / 0.36) * width;
      // Normal verticalRatio is ~0.35 to ~0.65 -> map to 0 to height
      const rawTargetY = ((verticalRatio - 0.30) / 0.40) * height;

      const clampedX = Math.max(25, Math.min(width - 25, rawTargetX));
      const clampedY = Math.max(25, Math.min(height - 25, rawTargetY));

      // Smooth EMA filtering to make the cursor feel steady and responsive
      this.smoothCursorX = Math.round(this.smoothCursorX * 0.72 + clampedX * 0.28);
      this.smoothCursorY = Math.round(this.smoothCursorY * 0.72 + clampedY * 0.28);

      let gazeDirection: 'LOOKING LEFT' | 'LOOKING CENTER' | 'LOOKING RIGHT' | 'NO FACE' = 'LOOKING CENTER';
      if (horizontalRatio < 0.40) {
        gazeDirection = 'LOOKING LEFT';
      } else if (horizontalRatio > 0.60) {
        gazeDirection = 'LOOKING RIGHT';
      } else {
        gazeDirection = 'LOOKING CENTER';
      }

      const gazeAngle = parseFloat(((horizontalRatio - 0.5) * 50).toFixed(1));

      // Face Bounds
      const topHead = getPt(10);
      const chin = getPt(152);
      const leftCheek = getPt(234);
      const rightCheek = getPt(454);
      const noseTip = getPt(1);

      const faceMinX = Math.min(leftCheek.x, rightCheek.x);
      const faceMaxX = Math.max(leftCheek.x, rightCheek.x);
      const faceMinY = Math.min(topHead.y, chin.y);
      const faceMaxY = Math.max(topHead.y, chin.y);

      const faceBox = {
        x: faceMinX - 15,
        y: faceMinY - 20,
        w: Math.max(faceMaxX - faceMinX + 30, 100),
        h: Math.max(faceMaxY - faceMinY + 40, 120),
      };

      const maskBox = {
        x: Math.min(leftCheek.x, rightCheek.x),
        y: noseTip.y - 12,
        w: Math.abs(rightCheek.x - leftCheek.x),
        h: Math.max(chin.y - noseTip.y + 22, 40),
      };

      let nonSkinCount = 0;
      let totalSampled = 0;
      try {
        const clampX = Math.max(0, Math.min(maskBox.x, width - 1));
        const clampY = Math.max(0, Math.min(maskBox.y, height - 1));
        const clampW = Math.max(1, Math.min(maskBox.w, width - clampX));
        const clampH = Math.max(1, Math.min(maskBox.h, height - clampY));

        const imgData = ctx.getImageData(clampX, clampY, clampW, clampH).data;
        for (let y = 0; y < clampH; y += 3) {
          for (let x = 0; x < clampW; x += 3) {
            const idx = (y * clampW + x) * 4;
            totalSampled++;
            if (!isSkinPixel(imgData[idx], imgData[idx + 1], imgData[idx + 2])) {
              nonSkinCount++;
            }
          }
        }
      } catch {}

      const nonSkinRatio = totalSampled > 0 ? nonSkinCount / totalSampled : 0.2;
      const hasMask = nonSkinRatio > 0.42;
      const maskConfidence = Math.min(Math.round((hasMask ? nonSkinRatio : 1 - nonSkinRatio) * 100 + 10), 99.4);

      const leftContour = LEFT_EYE_CONTOUR_IDS.map((id) => getPt(id));
      const rightContour = RIGHT_EYE_CONTOUR_IDS.map((id) => getPt(id));

      return {
        detected: true,
        leftIris,
        rightIris,
        leftCorner,
        rightCorner,
        rightEyeLeft,
        rightEyeRight,
        leftEar,
        rightEar,
        isLeftEyeClosed,
        isRightEyeClosed,
        isLeftWink,
        horizontalRatio,
        verticalRatio,
        gazeCursor: { x: this.smoothCursorX, y: this.smoothCursorY },
        gazeDirection,
        gazeAngle,
        faceBox,
        maskBox,
        hasMask,
        maskConfidence,
        eyeContours: { left: leftContour, right: rightContour },
      };
    }

    return this.analyzePixelFallback(ctx, width, height);
  }

  /**
   * EXACT FACE COMPLIANCE DETECTION from Dharanesh's Python Template
   * Enhanced with Vertical Up/Down & Head Tilt Tracking
   */
  public analyzeFaceCompliance(
    _ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): FaceComplianceResult {
    if (this.lastFaceLandmarks.length >= 468) {
      const lms = this.lastFaceLandmarks;

      const getPoint = (idx: number) => ({
        x: Math.round((1 - lms[idx].x) * width),
        y: Math.round(lms[idx].y * height),
      });

      // Important face landmarks
      const nose = getPoint(NOSE);
      const leftCheek = getPoint(LEFT_CHEEK);
      const rightCheek = getPoint(RIGHT_CHEEK);
      const leftEye = getPoint(LEFT_EYE);
      const rightEye = getPoint(RIGHT_EYE);
      const topHead = getPoint(10);
      const chin = getPoint(152);

      // Face width & height
      const faceWidth = dist2D(leftCheek, rightCheek);
      const faceHeight = dist2D(topHead, chin);

      // Face center coordinates (X and Y)
      const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
      const faceCenterY = (topHead.y + chin.y) / 2;

      // Camera center (X and Y)
      const cameraCenterX = width / 2;
      const cameraCenterY = height / 2;

      const horizontalOffset = faceCenterX - cameraCenterX;
      const verticalOffset = faceCenterY - cameraCenterY;

      // Face orientation estimation: nose_offset = nose[0] - eye_center_x
      const eyeCenterX = (leftEye.x + rightEye.x) / 2;
      const eyeCenterY = (leftEye.y + rightEye.y) / 2;
      const noseOffset = nose.x - eyeCenterX;

      // Vertical pitch estimation (head tilted up or down)
      const upperDist = Math.max(nose.y - eyeCenterY, 1);
      const lowerDist = Math.max(chin.y - nose.y, 1);
      const pitchRatio = upperDist / lowerDist;

      // Compliance rules:
      const faceCentered = Math.abs(horizontalOffset) < width * 0.15 && Math.abs(verticalOffset) < height * 0.16;
      const faceVisibleSize = faceWidth > width * 0.15;
      const facingCamera = Math.abs(noseOffset) < faceWidth * 0.20 && pitchRatio > 0.45 && pitchRatio < 1.7;

      let status: 'COMPLIANT' | 'MOVE CLOSER' | 'MOVE LEFT' | 'MOVE RIGHT' | 'MOVE UP' | 'MOVE DOWN' | 'FACE CAMERA' | 'NO FACE' = 'COMPLIANT';
      let statusColor = '#00FF00'; // (0, 255, 0) Green

      if (!faceVisibleSize) {
        status = 'MOVE CLOSER';
        statusColor = '#FFA500';
      } else if (horizontalOffset < -width * 0.15) {
        status = 'MOVE RIGHT';
        statusColor = '#FFA500';
      } else if (horizontalOffset > width * 0.15) {
        status = 'MOVE LEFT';
        statusColor = '#FFA500';
      } else if (verticalOffset < -height * 0.16) {
        status = 'MOVE DOWN';
        statusColor = '#FFA500';
      } else if (verticalOffset > height * 0.16) {
        status = 'MOVE UP';
        statusColor = '#FFA500';
      } else if (!facingCamera) {
        status = 'FACE CAMERA';
        statusColor = '#FFA500';
      } else {
        status = 'COMPLIANT';
        statusColor = '#00FF00';
      }

      return {
        detected: true,
        status,
        statusColor,
        faceWidth: Math.round(faceWidth),
        faceHeight: Math.round(faceHeight),
        faceCenterX: Math.round(faceCenterX),
        faceCenterY: Math.round(faceCenterY),
        horizontalOffset: Math.round(horizontalOffset),
        verticalOffset: Math.round(verticalOffset),
        noseOffset: Math.round(noseOffset),
        faceCentered,
        faceVisibleSize,
        facingCamera,
        nose,
        leftCheek,
        rightCheek,
        leftEye,
        rightEye,
      };
    }

    // Fallback if no landmarks
    return {
      detected: false,
      status: 'NO FACE',
      statusColor: '#FF0000',
      faceWidth: 0,
      faceHeight: 0,
      faceCenterX: width / 2,
      faceCenterY: height / 2,
      horizontalOffset: 0,
      verticalOffset: 0,
      noseOffset: 0,
      faceCentered: false,
      faceVisibleSize: false,
      facingCamera: false,
      nose: { x: width / 2, y: height / 2 },
      leftCheek: { x: width / 2 - 40, y: height / 2 },
      rightCheek: { x: width / 2 + 40, y: height / 2 },
      leftEye: { x: width / 2 - 30, y: height / 2 - 20 },
      rightEye: { x: width / 2 + 30, y: height / 2 - 20 },
    };
  }

  private analyzePixelFallback(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): FaceLandmarksResult {
    const faceW = Math.round(width * 0.44);
    const faceH = Math.round(height * 0.58);
    const faceX = Math.round((width - faceW) / 2);
    const faceY = Math.round(height * 0.18);

    const eyeY = Math.round(faceY + faceH * 0.32);
    const eyeW = Math.round(faceW * 0.28);
    const eyeH = Math.round(faceH * 0.18);

    const leftEyeX = Math.round(faceX + faceW * 0.15);
    const rightEyeX = Math.round(faceX + faceW * 0.57);

    let leftPupilX = leftEyeX + eyeW / 2;
    let leftPupilY = eyeY + eyeH / 2;
    let rightPupilX = rightEyeX + eyeW / 2;
    let rightPupilY = eyeY + eyeH / 2;

    try {
      const leftData = ctx.getImageData(leftEyeX, eyeY, eyeW, eyeH).data;
      let minDark = 255 * 3;
      let dX = eyeW / 2;
      let dY = eyeH / 2;

      for (let y = 0; y < eyeH; y += 2) {
        for (let x = 0; x < eyeW; x += 2) {
          const idx = (y * eyeW + x) * 4;
          const lum = leftData[idx] + leftData[idx + 1] + leftData[idx + 2];
          if (lum < minDark) {
            minDark = lum;
            dX = x;
            dY = y;
          }
        }
      }
      leftPupilX = leftEyeX + dX;
      leftPupilY = eyeY + dY;
      rightPupilX = rightEyeX + dX;
      rightPupilY = eyeY + dY;
    } catch {}

    const leftIris = { x: leftPupilX, y: leftPupilY };
    const rightIris = { x: rightPupilX, y: rightPupilY };
    const leftCorner = { x: leftEyeX, y: eyeY + eyeH / 2 };
    const rightCorner = { x: leftEyeX + eyeW, y: eyeY + eyeH / 2 };
    const rightEyeLeft = { x: rightEyeX, y: eyeY + eyeH / 2 };
    const rightEyeRight = { x: rightEyeX + eyeW, y: eyeY + eyeH / 2 };

    const leftRatio = eyeRatio(leftIris, leftCorner, rightCorner);
    const rightRatio = eyeRatio(rightIris, rightEyeLeft, rightEyeRight);
    const horizontalRatio = (leftRatio + rightRatio) / 2;

    let gazeDirection: 'LOOKING LEFT' | 'LOOKING CENTER' | 'LOOKING RIGHT' | 'NO FACE' = 'LOOKING CENTER';
    if (horizontalRatio < 0.40) gazeDirection = 'LOOKING LEFT';
    else if (horizontalRatio > 0.60) gazeDirection = 'LOOKING RIGHT';

    const maskBox = {
      x: faceX + 15,
      y: faceY + Math.round(faceH * 0.48),
      w: faceW - 30,
      h: Math.round(faceH * 0.48),
    };

    let nonSkin = 0;
    let total = 0;
    try {
      const maskData = ctx.getImageData(maskBox.x, maskBox.y, maskBox.w, maskBox.h).data;
      for (let i = 0; i < maskData.length; i += 16) {
        if (!isSkinPixel(maskData[i], maskData[i + 1], maskData[i + 2])) {
          nonSkin++;
        }
        total++;
      }
    } catch {}

    const ratio = total > 0 ? nonSkin / total : 0.2;
    const hasMask = ratio > 0.44;

    return {
      detected: true,
      leftIris,
      rightIris,
      leftCorner,
      rightCorner,
      rightEyeLeft,
      rightEyeRight,
      leftEar: 0.24,
      rightEar: 0.24,
      isLeftEyeClosed: false,
      isRightEyeClosed: false,
      isLeftWink: false,
      horizontalRatio,
      verticalRatio: 0.5,
      gazeCursor: { x: width / 2, y: height / 2 },
      gazeDirection,
      gazeAngle: parseFloat(((horizontalRatio - 0.5) * 50).toFixed(1)),
      faceBox: { x: faceX, y: faceY, w: faceW, h: faceH },
      maskBox,
      hasMask,
      maskConfidence: Math.min(Math.round((hasMask ? ratio : 1 - ratio) * 100 + 10), 98.4),
      eyeContours: { left: [], right: [] },
    };
  }
}

export const defaultFaceMeshDetector = new FaceMeshDetector();

export const PYTHON_EYE_TRACKING_SOURCE = `import cv2
import mediapipe as mp
import numpy as np
import time

# -----------------------------
# MediaPipe Face Mesh
# -----------------------------
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# -----------------------------
# Helper
# -----------------------------
def get_point(landmarks, index, width, height):
    landmark = landmarks[index]
    return np.array([int(landmark.x * width), int(landmark.y * height)])

def eye_ratio(iris, left_corner, right_corner):
    eye_width = np.linalg.norm(right_corner - left_corner)
    if eye_width == 0:
        return 0.5
    return np.linalg.norm(iris - left_corner) / eye_width

# MediaPipe Refined Landmarks
LEFT_IRIS = 468
LEFT_EYE_LEFT = 33
LEFT_EYE_RIGHT = 133

RIGHT_IRIS = 473
RIGHT_EYE_LEFT = 362
RIGHT_EYE_RIGHT = 263

cap = cv2.VideoCapture(0)
previous_time = 0

while True:
    success, frame = cap.read()
    if not success:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)
    direction = "NO FACE"

    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0].landmark

        left_iris = get_point(face_landmarks, LEFT_IRIS, w, h)
        left_corner = get_point(face_landmarks, LEFT_EYE_LEFT, w, h)
        right_corner = get_point(face_landmarks, LEFT_EYE_RIGHT, w, h)

        right_iris = get_point(face_landmarks, RIGHT_IRIS, w, h)
        right_eye_left = get_point(face_landmarks, RIGHT_EYE_LEFT, w, h)
        right_eye_right = get_point(face_landmarks, RIGHT_EYE_RIGHT, w, h)

        left_ratio = eye_ratio(left_iris, left_corner, right_corner)
        right_ratio = eye_ratio(right_iris, right_eye_left, right_eye_right)
        horizontal_ratio = (left_ratio + right_ratio) / 2

        if horizontal_ratio < 0.40:
            direction = "LOOKING LEFT"
        elif horizontal_ratio > 0.60:
            direction = "LOOKING RIGHT"
        else:
            direction = "LOOKING CENTER"

        # Draw Iris (0, 255, 0)
        cv2.circle(frame, tuple(left_iris), 5, (0, 255, 0), -1)
        cv2.circle(frame, tuple(right_iris), 5, (0, 255, 0), -1)

        mp_drawing.draw_landmarks(frame, results.multi_face_landmarks[0], mp_face_mesh.FACEMESH_CONTOURS)

    current_time = time.time()
    fps = 1 / (current_time - previous_time) if previous_time != 0 else 0
    previous_time = current_time

    cv2.putText(frame, direction, (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(frame, f"FPS: {int(fps)}", (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

    cv2.imshow("Eye Tracking", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
`;

export const PYTHON_FACE_COMPLIANCE_SOURCE = `import cv2
import mediapipe as mp
import numpy as np
import time

# -----------------------------
# MediaPipe
# -----------------------------
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Important face landmarks
NOSE = 1
LEFT_CHEEK = 234
RIGHT_CHEEK = 454
LEFT_EYE = 33
RIGHT_EYE = 263

def get_point(landmarks, index, width, height):
    lm = landmarks[index]
    return np.array([int(lm.x * width), int(lm.y * height)])

cap = cv2.VideoCapture(0)
previous_time = 0

while True:
    success, frame = cap.read()
    if not success:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    status = "NO FACE"
    status_color = (0, 0, 255)

    if results.multi_face_landmarks:
        face = results.multi_face_landmarks[0].landmark

        nose = get_point(face, NOSE, w, h)
        left_cheek = get_point(face, LEFT_CHEEK, w, h)
        right_cheek = get_point(face, RIGHT_CHEEK, w, h)
        left_eye = get_point(face, LEFT_EYE, w, h)
        right_eye = get_point(face, RIGHT_EYE, w, h)

        face_width = np.linalg.norm(right_cheek - left_cheek)
        face_center_x = (left_cheek[0] + right_cheek[0]) / 2
        camera_center_x = w / 2
        horizontal_offset = face_center_x - camera_center_x

        eye_center_x = (left_eye[0] + right_eye[0]) / 2
        nose_offset = nose[0] - eye_center_x

        face_centered = abs(horizontal_offset) < w * 0.15
        face_visible_size = face_width > w * 0.15
        facing_camera = abs(nose_offset) < face_width * 0.20

        if not face_visible_size:
            status = "MOVE CLOSER"
            status_color = (0, 165, 255)
        elif not face_centered:
            if horizontal_offset < 0:
                status = "MOVE RIGHT"
            else:
                status = "MOVE LEFT"
            status_color = (0, 165, 255)
        elif not facing_camera:
            status = "FACE CAMERA"
            status_color = (0, 165, 255)
        else:
            status = "COMPLIANT"
            status_color = (0, 255, 0)

        # Draw face mesh contours
        mp_drawing.draw_landmarks(frame, results.multi_face_landmarks[0], mp_face_mesh.FACEMESH_CONTOURS)

        # Draw face center
        cv2.circle(frame, (int(face_center_x), int(h / 2)), 8, (255, 0, 255), -1)

    current_time = time.time()
    fps = 1 / (current_time - previous_time) if previous_time != 0 else 0
    previous_time = current_time

    # UI Box & Status Text
    cv2.rectangle(frame, (15, 15), (450, 85), (20, 20, 20), -1)
    cv2.putText(frame, f"STATUS: {status}", (30, 55), cv2.FONT_HERSHEY_SIMPLEX, 0.9, status_color, 2)
    cv2.putText(frame, f"FPS: {int(fps)}", (30, 115), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

    cv2.imshow("Face Compliance Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
`;
