// Isolated browser regression: never use an existing browser or HA installation.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.ATLAS_PLAYWRIGHT_MODULE || "playwright");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../plugins/icon-studio");
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/seed") { response.end("Isolated test seed"); return; }
  const target = resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
  if (!target.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  try {
    response.setHeader("Content-Type", ({ ".js": "text/javascript", ".html": "text/html", ".css": "text/css" })[extname(target)] || "application/octet-stream");
    response.end(await readFile(target));
  } catch { response.writeHead(404).end(); }
});
let browser;
try {
  await new Promise(done => server.listen(0, "127.0.0.1", done));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${origin}/seed`);
  const sentinel = { path: "M2 2H22V22H2z", viewBox: "0 0 24 24" };
  await page.evaluate(async icon => {
    localStorage.setItem("atlas-icon-studio-icons-v1", JSON.stringify({ "saved-sentinel": icon }));
  }, sentinel);
  await page.goto(origin);
  await page.locator(".workspace").waitFor({ state: "visible" });
  await page.waitForFunction(() => !document.querySelector(".workspace").inert);
  assert.deepEqual(errors, [], "Startup must not abort before loading saved icons.");
  await page.getByRole("option", { name: "saved-sentinel", exact: true }).click();
  assert.equal(await page.locator("#icon-path").inputValue(), sentinel.path);
  for (const language of ["de", "en", "fr"]) {
    await page.locator(`[data-language="${language}"]`).click();
    const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#export-collection").click()]);
    const collection = JSON.parse(await readFile(await download.path(), "utf8"));
    assert.ok(JSON.stringify(collection).includes("saved-sentinel"));
    await page.reload();
    await page.waitForFunction(() => !document.querySelector(".workspace").inert);
    await page.getByRole("option", { name: "saved-sentinel", exact: true }).click();
    assert.equal(await page.locator("#icon-path").inputValue(), sentinel.path);
  }
  await page.locator('#drawing-text').fill('Preserved text < & >');
  await page.locator('[data-tool="text"]').click();
  await page.locator('#drawing-canvas').click();
  assert.equal(await page.locator('#drawing-shapes > text').count(), 1, 'Text creation must not fail on a missing validator binding.');
  await page.locator('#drawing-undo').click();
  assert.equal(await page.locator('#drawing-shapes > *').count(), 0);
  await page.locator('[data-tool="rect"]').click();
  await page.locator("#drawing-canvas").scrollIntoViewIfNeeded();
  const canvasBox = await page.locator("#drawing-canvas").boundingBox();
  await page.mouse.move(canvasBox.x + 30, canvasBox.y + 30);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + 140, canvasBox.y + 120);
  await page.mouse.up();
  assert.equal(await page.locator("#drawing-shapes > *").count(), 1);
  await page.locator("#drawing-save-as").click();
  await page.locator("#drawing-export-dialog").waitFor({ state: "visible" });
  await page.locator("#export-format").selectOption("png");
  await page.locator("#export-transparent").uncheck();
  assert.equal(await page.locator("#export-background-color").isEnabled(), true);
  await page.locator("#export-format").selectOption("svg");
  assert.equal(await page.locator("#export-background-color").isEnabled(), false);
  await page.locator("#export-cancel").click();
  await page.locator("#drawing-undo").click();
  assert.equal(await page.locator("#drawing-shapes > *").count(), 0);
  await page.locator("#drawing-redo").click();
  assert.equal(await page.locator("#drawing-shapes > *").count(), 1);
  await page.locator("#drawing-undo").click();
  assert.deepEqual(errors, []);
  console.log("PASS: saved icons survive startup, DE/EN/FR export/reload; drawing export controls initialize.");
} finally {
  await browser?.close();
  await new Promise(done => server.close(done));
}
