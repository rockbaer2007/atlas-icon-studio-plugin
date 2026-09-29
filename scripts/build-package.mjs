import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginDir = path.join(root, "plugins", "icon-studio");
const manifest = JSON.parse(await readFile(path.join(pluginDir, "atlas-plugin.json"), "utf8"));
const repository = JSON.parse(await readFile(path.join(root, "repository.json"), "utf8"));
const packageName = "icon-studio.atlas-plugin.json";
const files = [
  ["atlas-plugin.json", "application/json"],
  ["README.md", "text/markdown"],
  ["index.html", "text/html"],
  ["styles.css", "text/css"],
  ["app.js", "text/javascript"],
  ["icon.svg", "image/svg+xml"],
  ["logo.svg", "image/svg+xml"],
  ["preview.svg", "image/svg+xml"],
];

const installPackage = {
  kind: "atlas.runtime.plugin.install-package",
  filename: packageName,
  plugin: {
    id: manifest.id,
    name: manifest.name,
    nameI18n: manifest.nameI18n,
    version: manifest.version,
    description: manifest.description,
    descriptionI18n: manifest.descriptionI18n,
    icon: manifest.icon,
    logo: manifest.logo,
    preview: manifest.preview,
    dependencies: [],
    extensionPoints: [],
    provides: manifest.capabilities ?? [],
  },
  files: await Promise.all(files.map(async ([file, mediaType]) => ({
    path: file,
    mediaType,
    content: await readFile(path.join(pluginDir, file), "utf8"),
  }))),
};

if (repository.plugins.length !== 1) throw new Error("The repository must contain exactly one plugin.");
Object.assign(repository.plugins[0], {
  id: manifest.id,
  name: manifest.name,
  nameI18n: manifest.nameI18n,
  version: manifest.version,
  description: manifest.description,
  descriptionI18n: manifest.descriptionI18n,
  icon: "./plugins/icon-studio/icon.svg",
  logo: "./plugins/icon-studio/logo.svg",
  preview: "./plugins/icon-studio/preview.svg",
  entry: manifest.entry,
  package: `./plugins/icon-studio/${packageName}`,
  manifest: "./plugins/icon-studio/atlas-plugin.json",
  capabilities: manifest.capabilities ?? [],
});

await writeFile(path.join(pluginDir, packageName), `${JSON.stringify(installPackage, null, 2)}\n`);
await writeFile(path.join(root, "repository.json"), `${JSON.stringify(repository, null, 2)}\n`);
console.log(`Built plugins/icon-studio/${packageName}`);
