export const DRAWING_HISTORY_LIMIT = 10;

const COLOR = /^#[\da-f]{6}$/i;
const ID = /^shape-\d+$/;
const finite = (value) => Number.isFinite(Number(value));

export function validateDrawingShape(shape) {
  if (!shape || !ID.test(shape.id) || !["line", "rect", "ellipse"].includes(shape.type)) return false;
  const fields = shape.type === "line" ? ["x1", "y1", "x2", "y2"] : ["x", "y", "width", "height"];
  if (!fields.every((key) => finite(shape[key]))) return false;
  if (!COLOR.test(shape.stroke) || !finite(shape.strokeWidth) || shape.strokeWidth < 0 || shape.strokeWidth > 32) return false;
  if (shape.type !== "line" && (!COLOR.test(shape.fill) || Number(shape.width) < 0 || Number(shape.height) < 0)) return false;
  return true;
}

export function serializeDrawingSvg(shapes, { width = 512, height = 512 } = {}) {
  if (!Array.isArray(shapes) || !shapes.every(validateDrawingShape)) throw new TypeError("Invalid drawing");
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4096 || height > 4096) throw new TypeError("Invalid dimensions");
  const body = shapes.map((shape) => {
    const common = `id="${shape.id}" stroke="${shape.stroke}" stroke-width="${Number(shape.strokeWidth)}" stroke-linecap="round" stroke-linejoin="round"`;
    if (shape.type === "line") return `<line ${common} x1="${Number(shape.x1)}" y1="${Number(shape.y1)}" x2="${Number(shape.x2)}" y2="${Number(shape.y2)}"/>`;
    if (shape.type === "rect") return `<rect ${common} fill="${shape.fill}" x="${Number(shape.x)}" y="${Number(shape.y)}" width="${Number(shape.width)}" height="${Number(shape.height)}"/>`;
    return `<ellipse ${common} fill="${shape.fill}" cx="${Number(shape.x) + Number(shape.width) / 2}" cy="${Number(shape.y) + Number(shape.height) / 2}" rx="${Number(shape.width) / 2}" ry="${Number(shape.height) / 2}"/>`;
  }).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n${body ? `  ${body}\n` : ""}</svg>\n`;
}

export function clampDrawingZoom(value) {
  return Math.min(2, Math.max(0.5, Number(value) || 1));
}
