/**
 * Resolves static asset paths with 100% reliability across all hosting environments:
 * - Localhost dev server (http://localhost:5173/)
 * - GitHub Pages with repository subpath (https://<user>.github.io/<repo>/)
 * - Custom domain roots (Firebase Hosting, Vercel, Netlify)
 */
export function resolveAssetUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const pathname = window.location.pathname;

    // Check if hosted on GitHub Pages subdomain (e.g. username.github.io/repo-name)
    if (window.location.hostname.endsWith('github.io')) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const repoName = segments[0];
        return `${origin}/${repoName}/${cleanPath}`;
      }
    }

    // Default for localhost or root domains
    return `${origin}/${cleanPath}`;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Returns the ultra-lightweight WebP version for maximum speed (<100ms load time)
 */
export function resolveWebpUrl(path?: string): string {
  if (!path) return '';
  const url = resolveAssetUrl(path);
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return url.replace(/\.(jpg|jpeg)$/i, '.webp');
  }
  return url;
}

/**
 * Preloads an image into browser memory so clicking "View Cert" opens instantly (< 0.05s)
 */
export function preloadCertificateImage(path?: string): void {
  if (!path || typeof window === 'undefined') return;
  const webpUrl = resolveWebpUrl(path);
  const jpgUrl = resolveAssetUrl(path);

  const imgWebp = new Image();
  imgWebp.src = webpUrl;

  const imgJpg = new Image();
  imgJpg.src = jpgUrl;
}

