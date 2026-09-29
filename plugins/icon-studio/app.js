const translations = {
  de: {
    eyebrow: "ATLAS PLUGIN",
    title: "ATLAS Icon Studio",
    intro: "Icons ansehen, SVG-Pfade vorbereiten und ein Home-Assistant-Iconset mit dem Präfix atlas: exportieren.",
    sample: "Beispiel",
    home: "Home-Icon",
    iconName: "Iconname",
    svgFile: "SVG importieren",
    imageFile: "PNG/JPG anzeigen",
    saveImage: "Bilddatei herunterladen",
    download: "Iconset-JavaScript herunterladen",
    copy: "Verwendung kopieren",
    usageLabel: "Home Assistant-Aufruf",
    preview: "Vorschau",
    hint: "atlas:home funktioniert, sobald das exportierte Iconset als Frontend-Ressource in Home Assistant geladen ist.",
    svgOnly: "Für atlas:-Icons werden SVG-Dateien mit einfachen <path>-Elementen unterstützt. PNG/JPG kann hier angesehen und separat gespeichert werden, aber nicht als Vektor-Icon in das Iconset.",
    invalidName: "Bitte einen Iconnamen aus Kleinbuchstaben, Zahlen und Bindestrichen verwenden.",
    invalidSvg: "Dieses SVG enthält nicht unterstützte Elemente. Unterstützt werden einfache SVG-Pfade ohne Skripte, externe Verweise oder Transformationen.",
    loaded: "SVG-Pfade geladen.",
    imageLoaded: "Bild geladen. Rasterbilder können nicht als atlas:-Vektor-Icon exportiert werden.",
    exportReady: "Iconset exportiert.",
    copied: "Aufruf kopiert.",
    copyFailed: "Kopieren nicht möglich; bitte den Aufruf manuell markieren.",
    select: "Datei auswählen",
  },
  en: {
    eyebrow: "ATLAS PLUGIN",
    title: "ATLAS Icon Studio",
    intro: "Browse icons, prepare SVG paths and export a Home Assistant icon set using the atlas: prefix.",
    sample: "Example",
    home: "Home icon",
    iconName: "Icon name",
    svgFile: "Import SVG",
    imageFile: "View PNG/JPG",
    saveImage: "Download image file",
    download: "Download icon set JavaScript",
    copy: "Copy usage",
    usageLabel: "Home Assistant usage",
    preview: "Preview",
    hint: "atlas:home works after you load the exported icon set as a frontend resource in Home Assistant.",
    svgOnly: "For atlas: icons, SVG files with simple <path> elements are supported. PNG/JPG can be previewed and saved separately, but cannot be exported as vector icons.",
    invalidName: "Use a lowercase icon name containing only letters, numbers and hyphens.",
    invalidSvg: "This SVG contains unsupported elements. Only simple SVG paths without scripts, external references or transforms are supported.",
    loaded: "SVG paths loaded.",
    imageLoaded: "Image loaded. Raster images cannot be exported as atlas: vector icons.",
    exportReady: "Icon set exported.",
    copied: "Usage copied.",
    copyFailed: "Could not copy; select the usage text manually.",
    select: "Choose file",
  },
  fr: {
    eyebrow: "PLUGIN ATLAS",
    title: "ATLAS Icon Studio",
    intro: "Parcourez des icônes, préparez des chemins SVG et exportez un jeu d’icônes Home Assistant avec le préfixe atlas:.",
    sample: "Exemple",
    home: "Icône d’accueil",
    iconName: "Nom de l’icône",
    svgFile: "Importer un SVG",
    imageFile: "Afficher PNG/JPG",
    saveImage: "Télécharger le fichier image",
    download: "Télécharger le JavaScript du jeu d’icônes",
    copy: "Copier l’utilisation",
    usageLabel: "Utilisation dans Home Assistant",
    preview: "Aperçu",
    hint: "atlas:home fonctionne après le chargement du jeu d’icônes exporté comme ressource frontend dans Home Assistant.",
    svgOnly: "Les icônes atlas: acceptent les fichiers SVG avec des éléments <path> simples. Les PNG/JPG peuvent être affichés et enregistrés séparément, mais pas exportés comme icônes vectorielles.",
    invalidName: "Utilisez un nom en minuscules avec uniquement des lettres, chiffres et tirets.",
    invalidSvg: "Ce SVG contient des éléments non pris en charge. Seuls les chemins SVG simples sans scripts, références externes ou transformations sont acceptés.",
    loaded: "Chemins SVG chargés.",
    imageLoaded: "Image chargée. Les images matricielles ne peuvent pas être exportées comme icônes vectorielles atlas:.",
    exportReady: "Jeu d’icônes exporté.",
    copied: "Utilisation copiée.",
    copyFailed: "Copie impossible ; sélectionnez le texte manuellement.",
    select: "Choisir un fichier",
  },
};

const homePath = "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z";
const icons = { home: { path: homePath, viewBox: "0 0 24 24" } };
const $ = (selector) => document.querySelector(selector);
const languageSelect = $("#language");
const preview = $("#icon-preview");
const iconName = $("#icon-name");
const status = $("#status");
let currentImageUrl;
let currentImageFile;

const requestedLanguage = new URLSearchParams(location.search).get("language");
const savedLanguage = localStorage.getItem("atlas-icon-studio-language");
languageSelect.value = translations[requestedLanguage]
  ? requestedLanguage
  : translations[savedLanguage]
    ? savedLanguage
    : "de";

function setLanguage(language) {
  const dict = translations[language] ?? translations.en;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = dict[element.dataset.i18n];
  });
  $("#svg-file").setAttribute("aria-label", dict.svgFile);
  $("#image-file").setAttribute("aria-label", dict.imageFile);
  renderPreview();
}

function renderPreview() {
  const name = iconName.value.trim();
  const icon = icons[name];
  if (!icon) return;
  preview.replaceChildren();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", icon.viewBox);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", name);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", icon.path);
  svg.append(path);
  preview.append(svg);
  $("#usage").value = `atlas:${name}`;
}

function validName(name) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
}

function parseSvg(text) {
  const documentNode = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = documentNode.documentElement;
  if (root.localName !== "svg" || documentNode.querySelector("parsererror")) throw new Error("svg");
  if (documentNode.querySelector("script,foreignObject,image,use,style,filter,mask,clipPath")) throw new Error("svg");
  if ([...documentNode.querySelectorAll("*")].some((node) => node.hasAttribute("transform") || [...node.attributes].some(({ name, value }) => /^on/i.test(name) || /url\s*\(|https?:|data:/i.test(value)))) throw new Error("svg");
  const paths = [...root.querySelectorAll("path")].map((path) => path.getAttribute("d")).filter(Boolean);
  if (!paths.length || root.querySelector("rect,circle,ellipse,line,polyline,polygon,text")) throw new Error("svg");
  const viewBox = root.getAttribute("viewBox") ?? "0 0 24 24";
  if (!/^[\d.+-]+(?:\s+[\d.+-]+){3}$/.test(viewBox)) throw new Error("svg");
  return { path: paths.join(" "), viewBox };
}

async function importSvg(file) {
  const name = iconName.value.trim();
  const dict = translations[languageSelect.value] ?? translations.en;
  if (!validName(name)) { status.textContent = dict.invalidName; return; }
  try {
    icons[name] = parseSvg(await file.text());
    renderPreview();
    status.textContent = dict.loaded;
  } catch {
    status.textContent = dict.invalidSvg;
  }
}

function downloadIconSet() {
  const name = iconName.value.trim();
  const dict = translations[languageSelect.value] ?? translations.en;
  if (!validName(name)) { status.textContent = dict.invalidName; return; }
  const selected = Object.fromEntries(Object.entries(icons).filter(([key]) => key === "home" || key === name));
  const script = `// Generated by ATLAS Icon Studio. Add as a Home Assistant frontend resource.\nwindow.customIconsets = window.customIconsets || {};\nwindow.customIconsets["atlas"] = async (iconName) => {\n  const icons = ${JSON.stringify(selected, null, 2)};\n  return icons[iconName];\n};\n`;
  const blob = new Blob([script], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "atlas-iconset.js";
  link.click();
  URL.revokeObjectURL(url);
  status.textContent = dict.exportReady;
}

languageSelect.addEventListener("change", () => {
  localStorage.setItem("atlas-icon-studio-language", languageSelect.value);
  setLanguage(languageSelect.value);
});
iconName.addEventListener("input", () => {
  const name = iconName.value.trim();
  if (validName(name) && icons.home) icons[name] ??= icons.home;
  renderPreview();
});
$("#svg-file").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) void importSvg(file);
  event.target.value = "";
});
$("#image-file").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
  currentImageFile = file;
  currentImageUrl = URL.createObjectURL(file);
  $("#download-image").hidden = false;
  preview.replaceChildren();
  const image = document.createElement("img");
  image.src = currentImageUrl;
  image.alt = file.name;
  preview.append(image);
  const dict = translations[languageSelect.value] ?? translations.en;
  status.textContent = dict.imageLoaded;
  event.target.value = "";
});
$("#download").addEventListener("click", downloadIconSet);
$("#download-image").addEventListener("click", () => {
  if (!currentImageFile) return;
  const url = URL.createObjectURL(currentImageFile);
  const link = document.createElement("a");
  link.href = url;
  link.download = currentImageFile.name;
  link.click();
  URL.revokeObjectURL(url);
});
$("#copy-usage").addEventListener("click", async () => {
  const dict = translations[languageSelect.value] ?? translations.en;
  try {
    await navigator.clipboard.writeText($("#usage").value);
    status.textContent = dict.copied;
  } catch {
    $("#usage").select();
    status.textContent = dict.copyFailed;
  }
});

setLanguage(languageSelect.value);
renderPreview();
