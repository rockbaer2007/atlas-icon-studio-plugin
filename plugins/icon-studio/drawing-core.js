export const DRAWING_HISTORY_LIMIT = 10;

const COLOR = /^#[\da-f]{6}$/i;
const ID = /^shape-\d+$/;
const finite = (value) => Number.isFinite(Number(value));

export function validateDrawingShape(shape) {
  if (!shape || !ID.test(shape.id) || !["line", "rect", "ellipse", "path", "text"].includes(shape.type)) return false;
  if (shape.type === "text") return finite(shape.x) && finite(shape.y) && finite(shape.fontSize) && Number(shape.fontSize) >= 6 && Number(shape.fontSize) <= 128 && typeof shape.text === "string" && shape.text.length > 0 && shape.text.length <= 160 && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(shape.text) && COLOR.test(shape.fill) && (shape.stroke === "none" || COLOR.test(shape.stroke)) && finite(shape.strokeWidth) && shape.strokeWidth >= 0 && shape.strokeWidth <= 32;
  const fields = shape.type === "line" ? ["x1", "y1", "x2", "y2"] : ["x", "y", ...(shape.type === "path" ? [] : ["width", "height"] )];
  if (!fields.every((key) => finite(shape[key]))) return false;
  if (!(shape.stroke === "none" || COLOR.test(shape.stroke)) || !finite(shape.strokeWidth) || shape.strokeWidth < 0 || shape.strokeWidth > 32) return false;
  if (shape.type === "path") return typeof shape.d === "string" && shape.d.length > 0 && shape.d.length <= 12000 && /^[MLml0-9eE+.,\-\s]+$/.test(shape.d);
  if (shape.type !== "line" && !(shape.fill === "none" || COLOR.test(shape.fill))) return false;
  if (shape.type !== "line" && (Number(shape.width) < 0 || Number(shape.height) < 0)) return false;
  return true;
}

const escapeXml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export function serializeDrawingSvg(shapes, { width = 512, height = 512 } = {}) {
  if (!Array.isArray(shapes) || !shapes.every(validateDrawingShape)) throw new TypeError("Invalid drawing");
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4096 || height > 4096) throw new TypeError("Invalid dimensions");
  const body = shapes.map((shape) => {
    const common = `id="${shape.id}" stroke="${shape.stroke}" stroke-width="${Number(shape.strokeWidth)}" stroke-linecap="round" stroke-linejoin="round"`;
    if (shape.type === "line") return `<line ${common} x1="${Number(shape.x1)}" y1="${Number(shape.y1)}" x2="${Number(shape.x2)}" y2="${Number(shape.y2)}"/>`;
    if (shape.type === "path") return `<path ${common} fill="none" transform="translate(${Number(shape.x)} ${Number(shape.y)})" d="${shape.d}"/>`;
    if (shape.type === "text") return `<text ${common} fill="${shape.fill}" x="${Number(shape.x)}" y="${Number(shape.y)}" font-family="sans-serif" font-size="${Number(shape.fontSize)}">${escapeXml(shape.text)}</text>`;
    if (shape.type === "rect") return `<rect ${common} fill="${shape.fill}" x="${Number(shape.x)}" y="${Number(shape.y)}" width="${Number(shape.width)}" height="${Number(shape.height)}"/>`;
    return `<ellipse ${common} fill="${shape.fill}" cx="${Number(shape.x) + Number(shape.width) / 2}" cy="${Number(shape.y) + Number(shape.height) / 2}" rx="${Number(shape.width) / 2}" ry="${Number(shape.height) / 2}"/>`;
  }).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n${body ? `  ${body}\n` : ""}</svg>\n`;
}

export function clampDrawingZoom(value) {
  return Math.min(2, Math.max(0.5, Number(value) || 1));
}
