import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import {
  createCollectionBackup,
  createIconsetSource,
  createSvgSource,
  isValidIconName,
  parseCollectionBackup,
  SAMPLE_ICONS,
  validateIconCollection,
  validateIconDefinition,
} from "../plugins/icon-studio/iconset-core.js";

const home = { path: "M2 12 12 3l10 9h-3v9h-5v-6h-4v6H5v-9z", viewBox: "0 0 24 24" };

test("ships valid sample icons including the atlas:home reference", () => {
  const samples = validateIconCollection(SAMPLE_ICONS);
  assert.deepEqual(Object.keys(samples), ["home", "lightbulb", "thermometer"]);
  assert.deepEqual(samples.home, home);
});

test("accepts stable names and rejects unsafe or malformed names", () => {
  assert.equal(isValidIconName("home"), true);
  assert.equal(isValidIconName("living-room-2"), true);
  for (const name of ["", "Home", "a:b", "../home", "two--words", "a_b"]) {
    assert.equal(isValidIconName(name), false, name);
  }
});

test("validates SVG path syntax and a finite positive viewBox", () => {
  assert.deepEqual(validateIconDefinition(home), home);
  assert.throws(() => validateIconDefinition({ path: "<script>", viewBox: "0 0 24 24" }), /path/);
  assert.throws(() => validateIconDefinition({ path: "M0 0z", viewBox: "0 0 24 0" }), /viewBox/);
  assert.throws(() => validateIconDefinition({ path: "M0 0z", viewBox: "0 0 NaN 24" }), /viewBox/);
});

test("validates each name and definition in an icon collection", () => {
  assert.deepEqual(validateIconCollection({ home }), { home });
  assert.throws(() => validateIconCollection({ "bad name": home }), /Invalid icon name/);
  assert.throws(() => validateIconCollection({}), /At least one icon/);
  assert.throws(() => validateIconCollection(null), /object/);
});

test("exports a loadable Home Assistant atlas icon set with every icon", async () => {
  const source = createIconsetSource({ home, lamp: { path: "M4 4h16v16H4z", viewBox: "0,0,24,24" } });
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox);
  assert.equal(JSON.stringify(await sandbox.window.customIconsets.atlas("home")), JSON.stringify(home));
  assert.equal(JSON.stringify(await sandbox.window.customIconsets.atlas("lamp")), JSON.stringify({ path: "M4 4h16v16H4z", viewBox: "0 0 24 24" }));
  assert.equal(await sandbox.window.customIconsets.atlas("missing"), undefined);
});

test("exports a standalone SVG document with escaped label text", () => {
  const svg = createSvgSource(home, "<Home & Away>");
  assert.match(svg, /^<\?xml/);
  assert.match(svg, /aria-label="Home  Away"/);
  assert.match(svg, /<path d="M2 12/);
});
test("backs up and restores a schema-versioned icon collection safely", () => {
  const backup = createCollectionBackup({ home, lamp: { path: "M4 4h16v16H4z", viewBox: "0 0 24 24" } });
  const restored = parseCollectionBackup(JSON.stringify(backup));
  assert.equal(JSON.stringify(restored), JSON.stringify(backup.icons));
  assert.throws(() => parseCollectionBackup(JSON.stringify({ kind: "other", schemaVersion: 1, icons: { home } })), /Unsupported/);
  assert.throws(() => parseCollectionBackup(JSON.stringify({ kind: "atlas.icon-studio.collection", schemaVersion: 1, icons: { "bad name": home } })), /Invalid icon name/);
});
