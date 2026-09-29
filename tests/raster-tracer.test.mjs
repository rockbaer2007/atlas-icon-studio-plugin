import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const tracerSource = await readFile(new URL("../plugins/icon-studio/imagetracer_v1.2.6.js", import.meta.url), "utf8");

test("vectorizes a colored raster sample into a multicolor SVG", () => {
  const sandbox = { self: {} };
  vm.runInNewContext(tracerSource, sandbox);
  const pixels = new Uint8ClampedArray([
    255, 0, 0, 255, 0, 255, 0, 255,
    0, 0, 255, 255, 255, 255, 255, 255,
  ]);
  const svg = sandbox.self.ImageTracer.imagedataToSVG({ width: 2, height: 2, data: pixels }, {
    numberofcolors: 4,
    pathomit: 0,
  });

  assert.match(svg, /^<svg\b/);
  assert.match(svg, /<path\b/);
  assert.ok(new Set([...svg.matchAll(/fill="([^"]+)"/g)].map((match) => match[1])).size >= 2);
});
