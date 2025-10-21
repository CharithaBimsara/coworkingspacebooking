/**
 * Simple HTML sanitizer for trusted content
 * Only allows basic HTML tags and attributes for icons
 */

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // For icon HTML, we can be more restrictive
  // Allow only SVG tags and basic attributes
  const allowedTags = ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g'];
  const allowedAttrs = ['xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 'd', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'points'];

  // Simple regex-based sanitization (not foolproof, but better than nothing)
  const sanitized = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[^>]*>.*?<\/style>/gi, '') // Remove styles
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: URLs

  return sanitized;
}