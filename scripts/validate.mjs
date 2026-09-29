import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = path.join(root, "plugins", "icon-studio");
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));
const manifest = await readJson("plugins/icon-studio/atlas-plugin.json");
const repository = await readJson("repository.json");

if (repository.kind !== "atlas.plugin.repository") throw new Error("Invalid repository kind.");
if (!manifest.id || !manifest.name || !manifest.version) throw new Error("Manifest must define id, name and version.");
if (!/^atlas\.plugin\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(manifest.id)) throw new Error("Invalid plugin ID.");
if (repository.plugins.length !== 1 || repository.plugins[0].id !== manifest.id) throw new Error("Catalog must contain exactly the Icon Studio plugin.");

const entry = repository.plugins[0];
for (const field of ["id", "name", "version", "description"]) {
  if (entry[field] !== manifest[field]) throw new Error(`Repository ${field} does not match the manifest.`);
}
if (entry.package !== `./plugins/icon-studio/${entry.package.split("/").at(-1)}`) throw new Error("Package URL must point into plugins/icon-studio/.");
if (entry.entry !== manifest.entry) throw new Error("Repository entry URL does not match the manifest.");

const installPackage = await readJson(entry.package.slice(2));
if (installPackage.kind !== "atlas.runtime.plugin.install-package") throw new Error("Invalid install package kind.");
if (installPackage.plugin.id !== manifest.id || installPackage.plugin.version !== manifest.version) throw new Error("Install package does not match the manifest.");
if (installPackage.filename !== entry.package.split("/").at(-1)) throw new Error("Install package filename does not match its catalog URL.");

const packageFiles = new Map(installPackage.files.map((file) => [file.path, file.content]));
for (const [file, mediaType] of [
  ["atlas-plugin.json", "application/json"],
  ["README.md", "text/markdown"],
  ["index.html", "text/html"],
  ["styles.css", "text/css"],
  ["app.js", "text/javascript"],
  ["iconset-core.js", "text/javascript"],
  ["imagetracer_v1.2.6.js", "text/javascript"],
  ["IMAGETRACER-LICENSE.txt", "text/plain"],
  ["icon.svg", "image/svg+xml"],
  ["logo.svg", "image/svg+xml"],
  ["preview.svg", "image/svg+xml"],
]) {
  await access(path.join(pluginDir, file));
  if (!packageFiles.has(file)) throw new Error(`Package is missing ${file}.`);
  if (packageFiles.get(file) !== await readFile(path.join(pluginDir, file), "utf8")) throw new Error(`Package is stale for ${file}; run npm run build.`);
  if (!installPackage.files.find((item) => item.path === file && item.mediaType === mediaType)) throw new Error(`Incorrect media type for ${file}.`);
}

const app = await readFile(path.join(pluginDir, "app.js"), "utf8");
for (const required of ["createIconsetSource", "atlas-icon-studio-icons-v1", "DOMParser", "ImageTracer", "image/png", "image/jpeg", "image/webp", "convertImageToSvg"]) {
  if (!app.includes(required)) throw new Error(`Icon Studio is missing ${required}.`);
}
console.log(`Validated ${manifest.name} ${manifest.version}.`);
