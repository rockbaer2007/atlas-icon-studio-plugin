import {
  createCollectionBackup,
  createIconsetSource,
  createSvgSource,
  isValidIconName,
  parseCollectionBackup,
  suggestIconName,
  validateIconCollection,
  validateIconDefinition,
} from "./iconset-core.js";

const translations = {
  de: {
    eyebrow: "ATLAS PLUGIN",
    title: "ATLAS Icon Studio",
    intro: "Icons erstellen, als Set verwalten und mit dem Präfix atlas: in Home Assistant nutzen.",
    language: "Sprache",
    library: "Icon-Sammlung",
    search: "Icons suchen",
    newIcon: "Neues Icon",
    deleteIcon: "Icon löschen",
    exportCollection: "Sammlung sichern",
    importCollection: "Sammlung importieren",
    importSvg: "SVG importieren",
    viewImage: "Bild ansehen",
    editIcon: "Icon bearbeiten",
    iconName: "Iconname",
    nameHint: "Kleinbuchstaben, Zahlen und Bindestriche verwenden.",
    viewBox: "SVG-Ansichtsbereich",
    pathData: "SVG-Pfaddaten",
    pathHint: "Monochrome SVG-Pfade. Füllfarben aus importierten SVGs werden vereinheitlicht.",
    downloadSvg: "Aktuelles Icon als SVG speichern",
    preview: "Vorschau",
    saveImage: "Bilddatei herunterladen",
    haUsage: "Home-Assistant-Aufruf",
    copy: "Kopieren",
    downloadSet: "Iconset exportieren",
    haHint: "Exportiertes JavaScript als Frontend-Ressource in Home Assistant laden, dann funktionieren atlas:-Icons.",
    rasterHint: "PNG/JPG und weitere Bildformate werden angezeigt, aber nicht als atlas:-Vektor-Icons exportiert.",
    created: "Neues Icon angelegt.",
    deleted: "Icon gelöscht.",
    homeProtected: "Das Beispiel atlas:home kann nicht gelöscht werden.",
    homeRenameProtected: "Das Beispiel atlas:home behält seinen Namen.",
    lastIcon: "Mindestens ein Icon muss in der Sammlung bleiben.",
    invalidName: "Nur Kleinbuchstaben, Zahlen und einzelne Bindestriche sind erlaubt.",
    duplicateName: "Dieser Iconname wird bereits verwendet.",
    invalidPath: "SVG-Pfaddaten oder Ansichtsbereich sind ungültig.",
    invalidSvg: "SVG nicht importiert. Unterstützt werden einfache Gruppen und Pfade; CSS, Farben und Verläufe werden entfernt. Externe Verweise und Transformationen werden abgelehnt.",
    svgLoaded: "SVG importiert und der Sammlung hinzugefügt.",
    batchImported: "{count} SVG-Dateien zur Sammlung hinzugefügt.",
    batchTooMany: "Maximal 50 SVG-Dateien und 20 MiB pro Import auswählen.",
    svgTooLarge: "Die SVG-Datei ist zu groß (maximal 2 MiB).",
    imageLoaded: "Bild geladen. Es kann separat heruntergeladen werden.",
    imageTooLarge: "Das Bild ist zu groß (maximal 20 MiB).",
    imageType: "Dieses Bildformat wird nicht unterstützt.",
    setExported: "Iconset mit {count} Icons exportiert.",
    svgExported: "SVG-Datei exportiert.",
    collectionExported: "Sammlung gesichert.",
    collectionImported: "Sammlung mit {count} Icons importiert.",
    invalidCollection: "Die Datei enthält keine gültige Icon-Sammlung.",
    copied: "Iconname kopiert.",
    copyFailed: "Kopieren nicht möglich; den Text bitte manuell markieren.",
    emptySearch: "Keine passenden Icons.",
    selectIcon: "Icon auswählen",
    count: "{count} Icons",
  },
  en: {
    eyebrow: "ATLAS PLUGIN",
    title: "ATLAS Icon Studio",
    intro: "Create icons, manage them as a set and use the atlas: prefix in Home Assistant.",
    language: "Language",
    library: "Icon collection",
    search: "Search icons",
    newIcon: "New icon",
    deleteIcon: "Delete icon",
    exportCollection: "Back up collection",
    importCollection: "Import collection",
    importSvg: "Import SVG",
    viewImage: "View image",
    editIcon: "Edit icon",
    iconName: "Icon name",
    nameHint: "Use lowercase letters, numbers and hyphens.",
    viewBox: "SVG viewBox",
    pathData: "SVG path data",
    pathHint: "Monochrome SVG paths. Imported fill colors are normalized.",
    downloadSvg: "Save current icon as SVG",
    preview: "Preview",
    saveImage: "Download image file",
    haUsage: "Home Assistant usage",
    copy: "Copy",
    downloadSet: "Export icon set",
    haHint: "Load the exported JavaScript as a Home Assistant frontend resource to use atlas: icons.",
    rasterHint: "PNG/JPG and other image formats can be viewed, but are not exported as atlas: vector icons.",
    created: "New icon created.",
    deleted: "Icon deleted.",
    homeProtected: "The atlas:home sample cannot be deleted.",
    homeRenameProtected: "Keep the atlas:home sample name unchanged.",
    lastIcon: "Keep at least one icon in the collection.",
    invalidName: "Use lowercase letters, numbers and single hyphens only.",
    duplicateName: "That icon name is already in use.",
    invalidPath: "The SVG path data or viewBox is invalid.",
    invalidSvg: "SVG was not imported. Simple groups and paths are supported; CSS, colors and gradients are stripped. External references and transforms are rejected.",
    svgLoaded: "SVG imported and added to the collection.",
    batchImported: "Added {count} SVG files to the collection.",
    batchTooMany: "Select at most 50 SVG files and 20 MiB per import.",
    svgTooLarge: "The SVG file is too large (maximum 2 MiB).",
    imageLoaded: "Image loaded. You can download it separately.",
    imageTooLarge: "The image is too large (maximum 20 MiB).",
    imageType: "This image format is not supported.",
    setExported: "Exported an icon set with {count} icons.",
    svgExported: "SVG file exported.",
    collectionExported: "Collection backed up.",
    collectionImported: "Imported a collection with {count} icons.",
    invalidCollection: "The file does not contain a valid icon collection.",
    copied: "Icon name copied.",
    copyFailed: "Could not copy; select the text manually.",
    emptySearch: "No matching icons.",
    selectIcon: "Select icon",
    count: "{count} icons",
  },
  fr: {
    eyebrow: "PLUGIN ATLAS",
    title: "ATLAS Icon Studio",
    intro: "Créez des icônes, gérez-les dans un jeu et utilisez le préfixe atlas: dans Home Assistant.",
    language: "Langue",
    library: "Collection d’icônes",
    search: "Rechercher des icônes",
    newIcon: "Nouvelle icône",
    deleteIcon: "Supprimer l’icône",
    exportCollection: "Sauvegarder la collection",
    importCollection: "Importer une collection",
    importSvg: "Importer un SVG",
    viewImage: "Afficher une image",
    editIcon: "Modifier l’icône",
    iconName: "Nom de l’icône",
    nameHint: "Utilisez des minuscules, des chiffres et des tirets.",
    viewBox: "viewBox SVG",
    pathData: "Données du chemin SVG",
    pathHint: "Chemins SVG monochromes. Les couleurs de remplissage importées sont uniformisées.",
    downloadSvg: "Enregistrer l’icône actuelle en SVG",
    preview: "Aperçu",
    saveImage: "Télécharger le fichier image",
    haUsage: "Utilisation dans Home Assistant",
    copy: "Copier",
    downloadSet: "Exporter le jeu d’icônes",
    haHint: "Chargez le JavaScript exporté comme ressource frontend Home Assistant pour utiliser les icônes atlas:.",
    rasterHint: "Les PNG/JPG et autres formats image peuvent être affichés, mais pas exportés comme icônes vectorielles atlas:.",
    created: "Nouvelle icône créée.",
    deleted: "Icône supprimée.",
    homeProtected: "L’exemple atlas:home ne peut pas être supprimé.",
    homeRenameProtected: "Conservez le nom de l’exemple atlas:home.",
    lastIcon: "La collection doit contenir au moins une icône.",
    invalidName: "Utilisez uniquement des minuscules, des chiffres et des tirets simples.",
    duplicateName: "Ce nom d’icône est déjà utilisé.",
    invalidPath: "Les données du chemin SVG ou le viewBox ne sont pas valides.",
    invalidSvg: "SVG non importé. Les groupes simples et les chemins sont acceptés ; le CSS, les couleurs et les dégradés sont supprimés. Les références externes et les transformations sont refusées.",
    svgLoaded: "SVG importé et ajouté à la collection.",
    batchImported: "{count} fichiers SVG ajoutés à la collection.",
    batchTooMany: "Sélectionnez au maximum 50 fichiers SVG et 20 Mio par importation.",
    svgTooLarge: "Le fichier SVG est trop volumineux (maximum 2 Mio).",
    imageLoaded: "Image chargée. Vous pouvez la télécharger séparément.",
    imageTooLarge: "L’image est trop volumineuse (maximum 20 Mio).",
    imageType: "Ce format d’image n’est pas pris en charge.",
    setExported: "Jeu d’icônes exporté avec {count} icônes.",
    svgExported: "Fichier SVG exporté.",
    collectionExported: "Collection sauvegardée.",
    collectionImported: "Collection de {count} icônes importée.",
    invalidCollection: "Le fichier ne contient pas de collection d’icônes valide.",
    copied: "Nom de l’icône copié.",
    copyFailed: "Copie impossible ; sélectionnez le texte manuellement.",
    emptySearch: "Aucune icône correspondante.",
    selectIcon: "Sélectionner une icône",
    count: "{count} icônes",
  },
};

const DEFAULT_ICONS = {
  home: { path: "M2 12 12 3l10 9h-3v9h-5v-6h-4v6H5v-9z", viewBox: "0 0 24 24" },
  lightbulb: { path: "M9 21h6v-1H9zm3-19a7 7 0 0 0-4 12.744c.6.45 1 .955 1 1.756V18h6v-1.5c0-.8.4-1.306 1-1.756A7 7 0 0 0 12 2zm2 12.8v.2h-4v-.2c0-1.54-.75-2.39-1.48-2.94A5 5 0 1 1 17 12a5.5 5.5 0 0 1-1.52 1.86c-.73.55-1.48 1.4-1.48 2.94z", viewBox: "0 0 24 24" },
  thermometer: { path: "M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0zM12 20a2 2 0 0 1-1-3.73V5a1 1 0 1 1 2 0v11.27A2 2 0 0 1 12 20z", viewBox: "0 0 24 24" },
};
const STORAGE_KEY = "atlas-icon-studio-icons-v1";
const LANGUAGE_KEY = "atlas-icon-studio-language";
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", "image/bmp", "image/x-icon", "image/vnd.microsoft.icon"]);
const MAX_SVG_SIZE = 2 * 1024 * 1024;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const $ = (selector) => document.querySelector(selector);
const iconNameInput = $("#icon-name");
const iconPathInput = $("#icon-path");
const iconViewBoxInput = $("#icon-viewbox");
const iconPreview = $("#icon-preview");
const statusNode = $("#status");

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Storage may be disabled by browser policy. */ }
}

function loadIcons() {
  try {
    const saved = JSON.parse(safeStorageGet(STORAGE_KEY) ?? "null");
    const valid = validateIconCollection(saved);
    return { ...DEFAULT_ICONS, ...valid };
  } catch {
    return structuredClone(DEFAULT_ICONS);
  }
}

let icons = loadIcons();
let activeName = "home";
let currentImageUrl = null;
let currentImageFile = null;
let currentLanguage = "de";

function dictionary() { return translations[currentLanguage] ?? translations.en; }

function format(message, values = {}) {
  return message.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function announce(key, values) {
  statusNode.textContent = format(dictionary()[key], values);
}

function setLanguage(language) {
  currentLanguage = translations[language] ? language : "de";
  statusNode.textContent = "";
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = dictionary()[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = dictionary()[element.dataset.i18nPlaceholder] ?? "";
  });
  $("#language").value = currentLanguage;
  renderIconList();
}

function persistIcons() {
  safeStorageSet(STORAGE_KEY, JSON.stringify(icons));
}

function makeIconNode(icon, name, size = 28) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", icon.viewBox);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", icon.path);
  svg.append(path);
  return svg;
}

function renderIconList() {
  const list = $("#icon-list");
  const query = $("#search-icons").value.trim().toLowerCase();
  const names = Object.keys(icons).filter((name) => name.includes(query)).sort((a, b) => a.localeCompare(b));
  list.replaceChildren();
  for (const name of names) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-entry${name === activeName ? " is-active" : ""}`;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(name === activeName));
    button.append(makeIconNode(icons[name], name));
    const label = document.createElement("span");
    label.textContent = name;
    button.append(label);
    button.addEventListener("click", () => selectIcon(name));
    list.append(button);
  }
  if (!names.length) {
    const empty = document.createElement("p");
    empty.className = "empty-list";
    empty.textContent = dictionary().emptySearch;
    list.append(empty);
  }
  $("#icon-count").textContent = format(dictionary().count, { count: Object.keys(icons).length });
  $("#delete-icon").disabled = activeName === "home" || Object.keys(icons).length < 2;
}

function selectIcon(name) {
  if (!icons[name]) return;
  activeName = name;
  iconNameInput.value = name;
  iconPathInput.value = icons[name].path;
  iconViewBoxInput.value = icons[name].viewBox;
  $("#usage").value = `atlas:${name}`;
  iconPreview.replaceChildren(makeIconNode(icons[name], name, 120));
  $("#image-preview").hidden = true;
  $("#icon-preview").hidden = false;
  renderIconList();
}

function saveActiveIcon() {
  const name = activeName;
  if (!isValidIconName(name)) throw new TypeError("name");
  const definition = validateIconDefinition({ path: iconPathInput.value, viewBox: iconViewBoxInput.value });
  icons[name] = definition;
  persistIcons();
  $("#usage").value = `atlas:${name}`;
  iconPreview.replaceChildren(makeIconNode(definition, name, 120));
  renderIconList();
  return definition;
}

function handleEditorChange() {
  try {
    saveActiveIcon();
    statusNode.textContent = "";
  } catch {
    announce("invalidPath");
  }
}

function renameActiveIcon() {
  const nextName = iconNameInput.value.trim();
  if (activeName === "home" && nextName !== "home") {
    iconNameInput.value = activeName;
    announce("homeRenameProtected");
    return;
  }
  if (!isValidIconName(nextName)) {
    iconNameInput.value = activeName;
    announce("invalidName");
    return;
  }
  if (nextName !== activeName && icons[nextName]) {
    iconNameInput.value = activeName;
    announce("duplicateName");
    return;
  }
  if (nextName !== activeName) {
    icons[nextName] = icons[activeName];
    delete icons[activeName];
    activeName = nextName;
    persistIcons();
  }
  selectIcon(activeName);
}

function createNewIcon() {
  let index = 1;
  let name = "new-icon";
  while (icons[name]) name = `new-icon-${++index}`;
  icons[name] = { path: "M12 3 22 21H2z", viewBox: "0 0 24 24" };
  persistIcons();
  selectIcon(name);
  iconNameInput.focus();
  iconNameInput.select();
  announce("created");
}

function deleteActiveIcon() {
  if (activeName === "home") { announce("homeProtected"); return; }
  const names = Object.keys(icons);
  if (names.length < 2) { announce("lastIcon"); return; }
  delete icons[activeName];
  activeName = "home";
  persistIcons();
  selectIcon("home");
  announce("deleted");
}

function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function parseSvg(text) {
  const documentNode = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = documentNode.documentElement;
  if (root.localName !== "svg" || documentNode.querySelector("parsererror")) throw new Error("Invalid XML");
  const allowed = new Set(["svg", "g", "path", "defs", "style", "linearGradient", "radialGradient", "stop", "title", "desc", "metadata"]);
  const nodes = [root, ...root.querySelectorAll("*")];
  if (documentNode.doctype || nodes.some((node) => !allowed.has(node.localName))) throw new Error("Unsupported SVG element");
  if (nodes.some((node) => node.hasAttribute("transform") || [...node.attributes].some(({ name }) =>
    /^on/i.test(name) || ["href", "src"].includes(name.toLowerCase())))) {
    throw new Error("Unsafe or transformed SVG");
  }
  const paths = [...root.querySelectorAll("path")]
    .filter((path) => !path.closest("defs"))
    .map((path) => path.getAttribute("d"))
    .filter(Boolean);
  if (!paths.length) throw new Error("No path elements");
  const viewBox = root.getAttribute("viewBox") ?? "0 0 24 24";
  return validateIconDefinition({ path: paths.join(" "), viewBox });
}

async function importSvg(file, requestedName = iconNameInput.value.trim()) {
  if (file.size > MAX_SVG_SIZE) { announce("svgTooLarge"); return; }
  const name = requestedName;
  if (!isValidIconName(name)) { announce("invalidName"); return; }
  if (name !== activeName && icons[name]) { announce("duplicateName"); return; }
  try {
    const definition = parseSvg(await file.text());
    icons[name] = definition;
    activeName = name;
    iconNameInput.value = name;
    persistIcons();
    selectIcon(name);
    return true;
  } catch {
    announce("invalidSvg");
    return false;
  }
}

function showImage(file) {
  const extension = file.name.toLowerCase().split(".").pop();
  const allowedWithoutMime = new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico"]);
  if (!IMAGE_TYPES.has(file.type) && !(file.type === "" && allowedWithoutMime.has(extension))) { announce("imageType"); return; }
  if (file.size > MAX_IMAGE_SIZE) { announce("imageTooLarge"); return; }
  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
  currentImageFile = file;
  currentImageUrl = URL.createObjectURL(file);
  $("#preview-image").src = currentImageUrl;
  $("#preview-image").alt = file.name;
  $("#image-preview").hidden = false;
  $("#icon-preview").hidden = true;
  announce("imageLoaded");
}

function exportIconSet() {
  try {
    saveActiveIcon();
    const source = createIconsetSource(icons);
    downloadFile("atlas-iconset.js", source, "text/javascript");
    announce("setExported", { count: Object.keys(icons).length });
  } catch {
    announce("invalidPath");
  }
}

function exportCollection() {
  try {
    saveActiveIcon();
    const document = createCollectionBackup(icons);
    downloadFile("atlas-icon-collection.json", `${JSON.stringify(document, null, 2)}\n`, "application/json");
    announce("collectionExported");
  } catch {
    announce("invalidPath");
  }
}

async function importCollection(file) {
  if (file.size > 1024 * 1024) { announce("invalidCollection"); return; }
  try {
    const imported = parseCollectionBackup(await file.text());
    icons = { ...DEFAULT_ICONS, ...imported };
    activeName = "home";
    persistIcons();
    selectIcon(activeName);
    announce("collectionImported", { count: Object.keys(imported).length });
  } catch {
    announce("invalidCollection");
  }
}

$("#language").addEventListener("change", (event) => {
  safeStorageSet(LANGUAGE_KEY, event.target.value);
  setLanguage(event.target.value);
});
$("#search-icons").addEventListener("input", renderIconList);
$("#new-icon").addEventListener("click", createNewIcon);
$("#delete-icon").addEventListener("click", deleteActiveIcon);
$("#icon-name").addEventListener("change", renameActiveIcon);
$("#icon-path").addEventListener("input", handleEditorChange);
$("#icon-viewbox").addEventListener("input", handleEditorChange);
$("#svg-file").addEventListener("change", (event) => {
  const files = [...(event.target.files ?? [])];
  if (files.length > 50 || files.reduce((sum, file) => sum + file.size, 0) > 20 * 1024 * 1024) {
    announce("batchTooMany");
    event.target.value = "";
    return;
  }
  if (files.length === 1) void importSvg(files[0], suggestIconName(files[0].name, icons)).then((loaded) => { if (loaded) announce("svgLoaded"); });
  else if (files.length > 1) void (async () => {
    let loaded = 0;
    for (const file of files) if (await importSvg(file, suggestIconName(file.name, icons))) loaded += 1;
    announce("batchImported", { count: loaded });
  })();
  event.target.value = "";
});
$("#image-file").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) showImage(file);
  event.target.value = "";
});
$("#download-image").addEventListener("click", () => {
  if (currentImageFile) downloadFile(currentImageFile.name, currentImageFile, currentImageFile.type);
});
$("#download-svg").addEventListener("click", () => {
  try {
    const definition = saveActiveIcon();
    downloadFile(`${activeName}.svg`, createSvgSource(definition, activeName), "image/svg+xml");
    announce("svgExported");
  } catch {
    announce("invalidPath");
  }
});
$("#download-set").addEventListener("click", exportIconSet);
$("#export-collection").addEventListener("click", exportCollection);
$("#collection-file").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) void importCollection(file);
  event.target.value = "";
});
$("#copy-usage").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#usage").value);
    announce("copied");
  } catch {
    $("#usage").select();
    announce("copyFailed");
  }
});

const requestedLanguage = new URLSearchParams(location.search).get("language");
const savedLanguage = safeStorageGet(LANGUAGE_KEY);
setLanguage(translations[requestedLanguage] ? requestedLanguage : translations[savedLanguage] ? savedLanguage : "de");
selectIcon(activeName);
