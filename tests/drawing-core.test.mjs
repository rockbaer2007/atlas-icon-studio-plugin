import test from "node:test";
import assert from "node:assert/strict";
import { clampDrawingZoom, DRAWING_HISTORY_LIMIT, serializeDrawingSvg, validateDrawingShape } from "../plugins/icon-studio/drawing-core.js";

test("drawing shapes serialize as colored SVG primitives", () => {
  const shapes = [
    { id: "shape-1", type: "rect", x: 4, y: 8, width: 100, height: 60, fill: "#29cdbb", stroke: "#123b3a", strokeWidth: 4 },
    { id: "shape-2", type: "ellipse", x: 20, y: 30, width: 40, height: 24, fill: "#ffffff", stroke: "#000000", strokeWidth: 1 },
    { id: "shape-3", type: "line", x1: 0, y1: 2, x2: 16, y2: 24, fill: "#ffffff", stroke: "#ff0000", strokeWidth: 2 },
  ];
  const svg = serializeDrawingSvg(shapes);
  assert.match(svg, /<rect .*fill="#29cdbb"/);
  assert.match(svg, /<ellipse .*cx="40" cy="42" rx="20" ry="12"/);
  assert.match(svg, /<line .*x1="0" y1="2" x2="16" y2="24"/);
  assert.match(svg, /viewBox="0 0 512 512"/);
  assert.ok(shapes.every(validateDrawingShape));
});

test("invalid shape data cannot be exported", () => {
  assert.throws(() => serializeDrawingSvg([{ id: "shape-1", type: "rect", x: 0, y: 0, width: 2, height: 3, fill: "url(javascript:bad)", stroke: "#000000", strokeWidth: 1 }]));
  assert.throws(() => serializeDrawingSvg([{ id: "shape-1", type: "path", d: "M0 0" }]));
});

test("transparent shapes, freehand paths and escaped text remain safe SVG", () => {
  const svg = serializeDrawingSvg([
    { id: "shape-1", type: "rect", x: 0, y: 0, width: 40, height: 20, fill: "none", stroke: "#123456", strokeWidth: 2 },
    { id: "shape-2", type: "path", x: 2, y: 3, d: "M 0 0 L 8 9", fill: "none", stroke: "#ffffff", strokeWidth: 3 },
    { id: "shape-3", type: "text", x: 10, y: 20, text: "A < B & \"C\"", fontSize: 18, fill: "#ffffff", stroke: "none", strokeWidth: 0 },
  ]);
  assert.match(svg, /fill="none"/);
  assert.match(svg, /<path .*d="M 0 0 L 8 9"/);
  assert.match(svg, /A &lt; B &amp; &quot;C&quot;/);
  assert.throws(() => serializeDrawingSvg([{ id: "shape-1", type: "text", x: 0, y: 10, text: "bad\u0001text", fontSize: 14, fill: "#ffffff", stroke: "none", strokeWidth: 0 }]));
});

test("drawing zoom is bounded and undo capacity is ten snapshots", () => {
  assert.equal(clampDrawingZoom(99), 2);
  assert.equal(clampDrawingZoom(0.1), 0.5);
  assert.equal(clampDrawingZoom(1.4), 1.4);
  assert.equal(DRAWING_HISTORY_LIMIT, 10);
});
