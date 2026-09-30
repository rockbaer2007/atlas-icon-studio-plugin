import {
  createCollectionBackup,
  createIconsetSource,
  createSvgSource,
  isValidIconName,
  parseCollectionBackup,
  parseIconsetSource,
  suggestIconName,
  validateIconCollection,
  validateIconDefinition,
} from "./iconset-core.js";
import { clampDrawingZoom, DRAWING_HISTORY_LIMIT, serializeDrawingSvg } from "./drawing-core.js";

const translations = {
  de: {
    drawingTitle: "Grafik zeichnen",
    drawingIntro: "Farbige SVG-Grafiken separat vom monochromen atlas:-Iconset erstellen.",
    drawingTools: "Zeichenwerkzeuge",
    toolSelect: "Auswählen",
    toolRect: "Rechteck",
    toolEllipse: "Ellipse",
    toolLine: "Linie",
    toolPen: "Freihand",
    toolText: "Text",
    undo: "Rückgängig",
    redo: "Wiederholen",
    erase: "Auswahl löschen",
    duplicate: "Duplizieren",
    sendBackward: "Nach hinten",
    bringForward: "Nach vorne",
    clear: "Leeren",
    fillColor: "Füllung",
    transparentFill: "Ohne Füllung",
    strokeColor: "Kontur",
    strokeWidth: "Linienstärke",
    textContent: "Textinhalt",
    textSize: "Textgröße",
    zoom: "Zoom",
    fileName: "Dateiname",
    saveDrawing: "SVG speichern",
    saveDrawingAs: "Speichern unter …",
    drawingDestination: "Die SVG wird heruntergeladen. Farbige Grafiken gehören nicht zum monochromen atlas:-Iconset.",
    drawingSaved: "SVG-Grafik heruntergeladen.",
    drawingCleared: "Zeichenfläche geleert.",
    drawingNothingSelected: "Wähle zuerst eine Form aus.",
    drawingNameInvalid: "Bitte gib einen gültigen Dateinamen ein.",
    saveAsPrompt: "Name für die SVG-Datei (ohne Endung):",
    exportTitle: "Grafik exportieren",
    exportFormat: "Dateiformat",
    exportSize: "Rastergröße",
    transparentBackground: "Transparenter Hintergrund",
    backgroundColor: "Hintergrundfarbe",
    cancel: "Abbrechen",
    exportDownload: "Herunterladen",
    textPrompt: "Text eingeben:",
    drawingTextInvalid: "Der Text kann nicht als SVG gespeichert werden.",
    drawingExportFailed: "Dieses Rasterformat wird in diesem Browser nicht unterstützt.",
    eyebrow: "ATLAS PLUGIN",
    backToHub: "Plugin Hub",
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
    viewImage: "PNG/JPG/WebP ansehen",
    editIcon: "Icon bearbeiten",
    iconName: "Iconname",
    nameHint: "Kleinbuchstaben, Zahlen und Bindestriche verwenden.",
    viewBox: "SVG-Ansichtsbereich",
    pathData: "SVG-Pfaddaten",
    pathHint: "Monochrome SVG-Pfade. Füllfarben aus importierten SVGs werden vereinheitlicht.",
    downloadSvg: "Aktuelles Icon als SVG speichern",
    svgFolderHint: "Einzelne SVG-Datei nach dem Download nach /config/www/atlas-icons/svg/ kopieren.",
    preview: "Vorschau",
    saveImage: "Bilddatei herunterladen",
    haUsage: "Home-Assistant-Aufruf",
    copy: "Kopieren",
    downloadSet: "Iconset exportieren",
    haHint: "Iconset-JavaScript nach /config/www/atlas-iconset.js kopieren und als Ressource /local/atlas-iconset.js in Home Assistant eintragen.",
    rasterHint: "PNG, JPG und WebP bleiben farbige Bilddateien in den getrennten Unterordnern png/, jpg/ und webp/; sie gehören nicht zum atlas:-Iconset.",
    imageDestination: "Nach dem Download nach {folder} kopieren. Home-Assistant-Pfad: {url}",
    conversionHint: "Optional: Einfache Logos lassen sich oft gut nach SVG umwandeln; das Originalbild bleibt erhalten.",
    convertToSvg: "In SVG umwandeln",
    downloadTracedSvg: "Vektorisierte SVG herunterladen",
    traceDestination: "Vektorisierte Datei nach dem Download nach /config/www/atlas-icons/svg/ kopieren. URL: /local/atlas-icons/svg/{name}.svg",
    traceReady: "SVG-Vorschau erstellt. Das farbige Vektorbild kann separat gespeichert werden.",
    traceFailed: "Umwandlung fehlgeschlagen. Versuche es mit einem kleineren oder einfacheren Bild.",
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
    storageFailed: "Die Icon-Sammlung konnte nicht dauerhaft gespeichert werden. Exportiere zur Sicherheit ein Backup und prüfe den Browserspeicher.",
    svgTooLarge: "Die SVG-Datei ist zu groß (maximal 2 MiB).",
    imageLoaded: "Bild geladen. Es kann separat heruntergeladen werden.",
    transferFailed: "Datei aus File Studio konnte nicht geöffnet werden. Prüfe, ob sie noch freigegeben und Icon Studio installiert ist.",
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
    duplicateNameHint: "Dieser Name ist bereits vorhanden. Wähle einen freien Namen.",
    nameAvailableHint: "Kleinbuchstaben, Zahlen und Bindestriche verwenden.",
    importConflictTitle: "Namenskonflikte beim Import",
    importConflictPrompt: "{count} Namen sind bereits vorhanden. Wie sollen diese behandelt werden?",
    conflictMode: "Behandlung",
    conflictReplace: "Vorhandene Icons ersetzen",
    conflictSkip: "Vorhandene Icons überspringen",
    conflictRename: "Neue Icons automatisch umbenennen",
    importApply: "Importieren",
    importCancel: "Abbrechen",
    haRead: "Iconset aus Home Assistant einlesen",
    haSave: "In Home Assistant speichern",
    haSaveTitle: "Iconset speichern",
    haExisting: "{count} Icons in /config/www/atlas-iconset.js gefunden. Beim Ersetzen wird automatisch eine Sicherung erstellt. Datei ersetzen oder neue Datei schreiben?",
    haExistingUnknown: "Die Datei /config/www/atlas-iconset.js ist vorhanden, enthält aber kein unterstütztes Iconset. Beim Ersetzen wird automatisch eine Sicherung erstellt. Ersetzen oder neue Datei schreiben?",
    haReplace: "Datei ersetzen",
    haNewFile: "Neue Datei schreiben",
    haNewSaved: "Neue Datei gespeichert: {path}. Als Ressource in Home Assistant hinzufügen: {url}",
    haReplaced: "Iconset gespeichert. Sicherung erstellt: {backup}",
    haSaved: "Iconset in Home Assistant gespeichert.",
    haFileRead: "{count} Icons aus Home Assistant eingelesen.",
    haAccessError: "Home-Assistant-Dateizugriff fehlgeschlagen: {message}",
    haUnsupported: "Die Datei ist kein unterstütztes, von Icon Studio erzeugtes Iconset.",
    haUploadTooLarge: "Das Iconset überschreitet das File-Studio-Uploadlimit von 64 MiB.",
  },
  en: {
    drawingTitle: "Draw a graphic",
    drawingIntro: "Create colored SVG graphics separately from the monochrome atlas: icon set.",
    drawingTools: "Drawing tools",
    toolSelect: "Select",
    toolRect: "Rectangle",
    toolEllipse: "Ellipse",
    toolLine: "Line",
    toolPen: "Freehand",
    toolText: "Text",
    undo: "Undo",
    redo: "Redo",
    erase: "Delete selection",
    duplicate: "Duplicate",
    sendBackward: "Send backward",
    bringForward: "Bring forward",
    clear: "Clear",
    fillColor: "Fill",
    transparentFill: "No fill",
    strokeColor: "Stroke",
    strokeWidth: "Stroke width",
    textContent: "Text content",
    textSize: "Text size",
    zoom: "Zoom",
    fileName: "File name",
    saveDrawing: "Save SVG",
    saveDrawingAs: "Save as …",
    drawingDestination: "The SVG is downloaded. Colored graphics are separate from the monochrome atlas: icon set.",
    drawingSaved: "SVG graphic downloaded.",
    drawingCleared: "Canvas cleared.",
    drawingNothingSelected: "Select a shape first.",
    drawingNameInvalid: "Enter a valid file name.",
    saveAsPrompt: "SVG file name (without extension):",
    exportTitle: "Export graphic",
    exportFormat: "File format",
    exportSize: "Raster size",
    transparentBackground: "Transparent background",
    backgroundColor: "Background color",
    cancel: "Cancel",
    exportDownload: "Download",
    textPrompt: "Enter text:",
    drawingTextInvalid: "This text cannot be saved as SVG.",
    drawingExportFailed: "This raster format is not supported by this browser.",
    eyebrow: "ATLAS PLUGIN",
    backToHub: "Plugin Hub",
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
    viewImage: "View PNG/JPG/WebP",
    editIcon: "Edit icon",
    iconName: "Icon name",
    nameHint: "Use lowercase letters, numbers and hyphens.",
    viewBox: "SVG viewBox",
    pathData: "SVG path data",
    pathHint: "Monochrome SVG paths. Imported fill colors are normalized.",
    downloadSvg: "Save current icon as SVG",
    svgFolderHint: "After downloading, copy an individual SVG file to /config/www/atlas-icons/svg/.",
    preview: "Preview",
    saveImage: "Download image file",
    haUsage: "Home Assistant usage",
    copy: "Copy",
    downloadSet: "Export icon set",
    haHint: "Copy the icon-set JavaScript to /config/www/atlas-iconset.js and add /local/atlas-iconset.js as a Home Assistant resource.",
    rasterHint: "PNG, JPG and WebP remain colored image files in separate png/, jpg/ and webp/ folders; they are not part of the atlas: icon set.",
    imageDestination: "After downloading, copy the file to {folder}. Home Assistant path: {url}",
    conversionHint: "Optional: simple logos often trace well to SVG; the original image stays unchanged.",
    convertToSvg: "Convert to SVG",
    downloadTracedSvg: "Download vectorized SVG",
    traceDestination: "After downloading, copy the vector file to /config/www/atlas-icons/svg/. URL: /local/atlas-icons/svg/{name}.svg",
    traceReady: "SVG preview created. Save the colored vector image separately.",
    traceFailed: "Conversion failed. Try a smaller or simpler image.",
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
    storageFailed: "The icon collection could not be saved persistently. Export a backup and check browser storage.",
    svgTooLarge: "The SVG file is too large (maximum 2 MiB).",
    imageLoaded: "Image loaded. You can download it separately.",
    transferFailed: "Could not open the file from File Studio. Check that it is still accessible and Icon Studio is installed.",
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
    duplicateNameHint: "This name already exists. Choose a unique name.",
    nameAvailableHint: "Use lowercase letters, numbers and hyphens.",
    importConflictTitle: "Import name conflicts",
    importConflictPrompt: "{count} names already exist. How should they be handled?",
    conflictMode: "Conflict handling",
    conflictReplace: "Replace existing icons",
    conflictSkip: "Skip existing icons",
    conflictRename: "Rename imported icons automatically",
    importApply: "Import",
    importCancel: "Cancel",
    haRead: "Read icon set from Home Assistant",
    haSave: "Save to Home Assistant",
    haSaveTitle: "Save icon set",
    haExisting: "Found {count} icons in /config/www/atlas-iconset.js. Replacing automatically creates a backup. Replace the file or write a new file?",
    haExistingUnknown: "The file /config/www/atlas-iconset.js exists, but is not a supported icon set. Replacing automatically creates a backup. Replace it or write a new file?",
    haReplace: "Replace file",
    haNewFile: "Write a new file",
    haNewSaved: "New file saved: {path}. Add it as a Home Assistant resource: {url}",
    haReplaced: "Icon set saved. Backup created: {backup}",
    haSaved: "Icon set saved in Home Assistant.",
    haFileRead: "Read {count} icons from Home Assistant.",
    haAccessError: "Home Assistant file access failed: {message}",
    haUnsupported: "This is not a supported Icon Studio generated icon set.",
    haUploadTooLarge: "The icon set exceeds File Studio's 64 MiB upload limit.",
  },
  fr: {
    drawingTitle: "Dessiner un graphique",
    drawingIntro: "Créez des graphiques SVG en couleur, séparément du jeu d’icônes monochromes atlas:.",
    drawingTools: "Outils de dessin",
    toolSelect: "Sélectionner",
    toolRect: "Rectangle",
    toolEllipse: "Ellipse",
    toolLine: "Ligne",
    toolPen: "Dessin libre",
    toolText: "Texte",
    undo: "Annuler",
    redo: "Rétablir",
    erase: "Supprimer la sélection",
    duplicate: "Dupliquer",
    sendBackward: "Reculer",
    bringForward: "Avancer",
    clear: "Effacer",
    fillColor: "Remplissage",
    transparentFill: "Sans remplissage",
    strokeColor: "Contour",
    strokeWidth: "Épaisseur du trait",
    textContent: "Contenu du texte",
    textSize: "Taille du texte",
    zoom: "Zoom",
    fileName: "Nom du fichier",
    saveDrawing: "Enregistrer le SVG",
    saveDrawingAs: "Enregistrer sous…",
    drawingDestination: "Le SVG est téléchargé. Les graphiques en couleur sont séparés du jeu d’icônes monochromes atlas:.",
    drawingSaved: "Graphique SVG téléchargé.",
    drawingCleared: "Zone de dessin effacée.",
    drawingNothingSelected: "Sélectionnez d’abord une forme.",
    drawingNameInvalid: "Saisissez un nom de fichier valide.",
    saveAsPrompt: "Nom du fichier SVG (sans extension) :",
    exportTitle: "Exporter le graphique",
    exportFormat: "Format de fichier",
    exportSize: "Taille raster",
    transparentBackground: "Arrière-plan transparent",
    backgroundColor: "Couleur d’arrière-plan",
    cancel: "Annuler",
    exportDownload: "Télécharger",
    textPrompt: "Saisissez le texte :",
    drawingTextInvalid: "Ce texte ne peut pas être enregistré en SVG.",
    drawingExportFailed: "Ce format raster n’est pas pris en charge par ce navigateur.",
    eyebrow: "PLUGIN ATLAS",
    backToHub: "Plugin Hub",
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
    viewImage: "Afficher PNG/JPG/WebP",
    editIcon: "Modifier l’icône",
    iconName: "Nom de l’icône",
    nameHint: "Utilisez des minuscules, des chiffres et des tirets.",
    viewBox: "viewBox SVG",
    pathData: "Données du chemin SVG",
    pathHint: "Chemins SVG monochromes. Les couleurs de remplissage importées sont uniformisées.",
    downloadSvg: "Enregistrer l’icône actuelle en SVG",
    svgFolderHint: "Après le téléchargement, copiez le fichier SVG individuel dans /config/www/atlas-icons/svg/.",
    preview: "Aperçu",
    saveImage: "Télécharger le fichier image",
    haUsage: "Utilisation dans Home Assistant",
    copy: "Copier",
    downloadSet: "Exporter le jeu d’icônes",
    haHint: "Copiez le JavaScript du jeu d’icônes dans /config/www/atlas-iconset.js et ajoutez /local/atlas-iconset.js comme ressource Home Assistant.",
    rasterHint: "Les PNG, JPG et WebP restent des images en couleur dans les dossiers séparés png/, jpg/ et webp/ ; ils ne font pas partie du jeu d’icônes atlas:.",
    imageDestination: "Après le téléchargement, copiez le fichier dans {folder}. Chemin Home Assistant : {url}",
    conversionHint: "Facultatif : les logos simples se vectorisent souvent bien ; l’image originale reste intacte.",
    convertToSvg: "Convertir en SVG",
    downloadTracedSvg: "Télécharger le SVG vectorisé",
    traceDestination: "Après le téléchargement, copiez le fichier vectorisé dans /config/www/atlas-icons/svg/. URL : /local/atlas-icons/svg/{name}.svg",
    traceReady: "Aperçu SVG créé. Enregistrez séparément l’image vectorielle en couleur.",
    traceFailed: "Échec de la conversion. Essayez avec une image plus petite ou plus simple.",
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
    storageFailed: "La collection n’a pas pu être enregistrée durablement. Exportez une sauvegarde et vérifiez le stockage du navigateur.",
    svgTooLarge: "Le fichier SVG est trop volumineux (maximum 2 Mio).",
    imageLoaded: "Image chargée. Vous pouvez la télécharger séparément.",
    transferFailed: "Impossible d’ouvrir le fichier de File Studio. Vérifiez qu’il est toujours accessible et qu’Icon Studio est installé.",
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
    duplicateNameHint: "Ce nom existe déjà. Choisissez un nom unique.",
    nameAvailableHint: "Utilisez des minuscules, des chiffres et des tirets.",
    importConflictTitle: "Conflits de noms lors de l’importation",
    importConflictPrompt: "{count} noms existent déjà. Comment les traiter ?",
    conflictMode: "Gestion des conflits",
    conflictReplace: "Remplacer les icônes existantes",
    conflictSkip: "Ignorer les icônes existantes",
    conflictRename: "Renommer automatiquement les icônes importées",
    importApply: "Importer",
    importCancel: "Annuler",
    haRead: "Lire le jeu d’icônes depuis Home Assistant",
    haSave: "Enregistrer dans Home Assistant",
    haSaveTitle: "Enregistrer le jeu d’icônes",
    haExisting: "{count} icônes trouvées dans /config/www/atlas-iconset.js. Le remplacement crée automatiquement une sauvegarde. Remplacer le fichier ou en créer un nouveau ?",
    haExistingUnknown: "Le fichier /config/www/atlas-iconset.js existe, mais ne contient pas de jeu d’icônes pris en charge. Le remplacement crée automatiquement une sauvegarde. Le remplacer ou en créer un nouveau ?",
    haReplace: "Remplacer le fichier",
    haNewFile: "Créer un nouveau fichier",
    haNewSaved: "Nouveau fichier enregistré : {path}. Ajoutez-le comme ressource Home Assistant : {url}",
    haReplaced: "Jeu d’icônes enregistré. Sauvegarde créée : {backup}",
    haSaved: "Jeu d’icônes enregistré dans Home Assistant.",
    haFileRead: "{count} icônes lues depuis Home Assistant.",
    haAccessError: "Échec de l’accès aux fichiers Home Assistant : {message}",
    haUnsupported: "Ce fichier n’est pas un jeu d’icônes généré par Icon Studio pris en charge.",
    haUploadTooLarge: "Le jeu d’icônes dépasse la limite d’envoi de 64 Mio de File Studio.",
  },
};

const DEFAULT_ICONS = {
  home: { path: "M2 12 12 3l10 9h-3v9h-5v-6h-4v6H5v-9z", viewBox: "0 0 24 24" },
  lightbulb: { path: "M9 21h6v-1H9zm3-19a7 7 0 0 0-4 12.744c.6.45 1 .955 1 1.756V18h6v-1.5c0-.8.4-1.306 1-1.756A7 7 0 0 0 12 2zm2 12.8v.2h-4v-.2c0-1.54-.75-2.39-1.48-2.94A5 5 0 1 1 17 12a5.5 5.5 0 0 1-1.52 1.86c-.73.55-1.48 1.4-1.48 2.94z", viewBox: "0 0 24 24" },
  thermometer: { path: "M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0zM12 20a2 2 0 0 1-1-3.73V5a1 1 0 1 1 2 0v11.27A2 2 0 0 1 12 20z", viewBox: "0 0 24 24" },
};
const STORAGE_KEY = "atlas-icon-studio-icons-v1";
const ICON_DATABASE_NAME = "atlas-icon-studio";
const ICON_DATABASE_VERSION = 1;
const ICON_STORE_NAME = "collections";
const ICON_STORE_KEY = "icons";
const ICON_LIST_ITEM_HEIGHT = 54;
const ICON_LIST_WINDOW_SIZE = 24;
const LANGUAGE_KEY = "atlas-icon-studio-language";
const FILE_STUDIO_TRANSFER_PREFIX = "atlas.file-studio.icon-studio-transfer.v1.";
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_SVG_SIZE = 2 * 1024 * 1024;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const DRAWING_STORAGE_KEY = "atlas-icon-studio-drawing-v1";
const SVG_NS = "http://www.w3.org/2000/svg";
const $ = (selector) => document.querySelector(selector);
const iconNameInput = $("#icon-name");
const iconPathInput = $("#icon-path");
const iconViewBoxInput = $("#icon-viewbox");
const iconPreview = $("#icon-preview");
const statusNode = $("#status");
const drawingStatusNode = $("#drawing-status");
const languageButtons = [...document.querySelectorAll("[data-language]")];

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Storage may be disabled by browser policy. */ }
}

function loadLegacyIcons() {
  try {
    const saved = JSON.parse(safeStorageGet(STORAGE_KEY) ?? "null");
    const valid = validateIconCollection(saved);
    return valid;
  } catch {
    return null;
  }
}

function openIconDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) { reject(new Error("IndexedDB is unavailable")); return; }
    const request = indexedDB.open(ICON_DATABASE_NAME, ICON_DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(ICON_STORE_NAME)) {
        request.result.createObjectStore(ICON_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open icon database"));
  });
}

function readStoredIcons(database) {
  return new Promise((resolve, reject) => {
    const request = database.transaction(ICON_STORE_NAME, "readonly").objectStore(ICON_STORE_NAME).get(ICON_STORE_KEY);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error ?? new Error("Could not read icon database"));
  });
}

function writeStoredIcons(database, collection) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ICON_STORE_NAME, "readwrite");
    transaction.objectStore(ICON_STORE_NAME).put(collection, ICON_STORE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Could not write icon database"));
    transaction.onabort = () => reject(transaction.error ?? new Error("Icon database write was aborted"));
  });
}

let iconDatabasePromise;
function getIconDatabase() {
  iconDatabasePromise ??= openIconDatabase();
  return iconDatabasePromise;
}

async function loadIcons() {
  try {
    const database = await getIconDatabase();
    const stored = await readStoredIcons(database);
    const legacy = stored ? null : loadLegacyIcons();
    const loaded = stored ?? legacy;
    if (loaded) {
      const valid = validateIconCollection(loaded);
      if (legacy) await writeStoredIcons(database, valid);
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* The IndexedDB copy is authoritative. */ }
      return { ...DEFAULT_ICONS, ...valid };
    }
  } catch {
    const legacy = loadLegacyIcons();
    if (legacy) return { ...DEFAULT_ICONS, ...legacy };
  }
  return structuredClone(DEFAULT_ICONS);
}

let icons = structuredClone(DEFAULT_ICONS);
let persistenceQueue = Promise.resolve();
let listNames = [];
let activeName = "home";
let currentImageUrl = null;
let currentImageFile = null;
let currentTraceUrl = null;
let currentTraceSvg = null;
let currentLanguage = "de";

function dictionary() { return translations[currentLanguage] ?? translations.en; }

function format(message, values = {}) {
  return message.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function announce(key, values) {
  statusNode.textContent = format(dictionary()[key], values);
}

let drawing = (() => {
  try {
    const saved = JSON.parse(safeStorageGet(DRAWING_STORAGE_KEY) ?? "null");
    if (saved && Array.isArray(saved.shapes) && saved.shapes.every((shape) => serializeDrawingSvg([shape]))) {
      const filename = typeof saved.filename === "string" && !/[\u0000-\u001f\\/:*?"<>|]/.test(saved.filename) ? saved.filename : "atlas-grafik.svg";
      return { shapes: saved.shapes, filename: filename.toLowerCase().endsWith(".svg") ? filename : `${filename}.svg` };
    }
  } catch { /* Start with a blank canvas if the stored drawing is invalid. */ }
  return { shapes: [], filename: "atlas-grafik.svg" };
})();
let selectedShapeId = null;
let drawingTool = "select";
let drawingUndo = [];
let drawingRedo = [];
let drawingGesture = null;

function persistDrawing() {
  safeStorageSet(DRAWING_STORAGE_KEY, JSON.stringify(drawing));
}

function setDrawingStatus(key) {
  drawingStatusNode.textContent = dictionary()[key] ?? "";
}

function renderDrawing() {
  const group = $("#drawing-shapes");
  const nodes = drawing.shapes.map((shape) => {
    let node;
    if (shape.type === "line") {
      node = document.createElementNS(SVG_NS, "line");
      for (const key of ["x1", "y1", "x2", "y2"]) node.setAttribute(key, String(shape[key]));
      node.setAttribute("fill", "none");
    } else if (shape.type === "rect") {
      node = document.createElementNS(SVG_NS, "rect");
      for (const key of ["x", "y", "width", "height"]) node.setAttribute(key, String(shape[key]));
    } else if (shape.type === "ellipse") {
      node = document.createElementNS(SVG_NS, "ellipse");
      node.setAttribute("cx", String(shape.x + shape.width / 2));
      node.setAttribute("cy", String(shape.y + shape.height / 2));
      node.setAttribute("rx", String(shape.width / 2));
      node.setAttribute("ry", String(shape.height / 2));
    } else if (shape.type === "path") {
      node = document.createElementNS(SVG_NS, "path");
      node.setAttribute("d", shape.d);
      node.setAttribute("transform", `translate(${shape.x} ${shape.y})`);
    } else {
      node = document.createElementNS(SVG_NS, "text");
      node.setAttribute("x", String(shape.x));
      node.setAttribute("y", String(shape.y));
      node.setAttribute("font-family", "sans-serif");
      node.setAttribute("font-size", String(shape.fontSize));
      node.textContent = shape.text;
    }
    node.dataset.shapeId = shape.id;
    node.setAttribute("fill", shape.type === "line" || shape.type === "path" ? "none" : shape.fill);
    node.setAttribute("stroke", shape.stroke);
    node.setAttribute("stroke-width", String(shape.strokeWidth));
    node.setAttribute("stroke-linecap", "round");
    node.setAttribute("stroke-linejoin", "round");
    node.classList.toggle("is-selected", selectedShapeId === shape.id);
    return node;
  });
  group.replaceChildren(...nodes);
  $("#drawing-undo").disabled = drawingUndo.length === 0;
  $("#drawing-redo").disabled = drawingRedo.length === 0;
  $("#drawing-delete").disabled = !drawing.shapes.some((shape) => shape.id === selectedShapeId);
  const selectedIndex = drawing.shapes.findIndex((shape) => shape.id === selectedShapeId);
  $("#drawing-duplicate").disabled = selectedIndex < 0;
  $("#drawing-backward").disabled = selectedIndex <= 0;
  $("#drawing-forward").disabled = selectedIndex < 0 || selectedIndex === drawing.shapes.length - 1;
  const canvas = $("#drawing-canvas");
  canvas.dataset.tool = drawingTool;
}

function rememberDrawing(snapshot) {
  drawingUndo.push(snapshot);
  if (drawingUndo.length > DRAWING_HISTORY_LIMIT) drawingUndo.shift();
  drawingRedo = [];
}

function updateDrawing(mutator) {
  const selected = drawing.shapes.find((shape) => shape.id === selectedShapeId);
  if (!selected) return false;
  const before = structuredClone(drawing.shapes);
  mutator(selected);
  rememberDrawing(before);
  persistDrawing();
  renderDrawing();
  return true;
}

function drawingPoint(event) {
  const canvas = $("#drawing-canvas");
  const point = canvas.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const local = point.matrixTransform(canvas.getScreenCTM().inverse());
  return { x: Math.max(0, Math.min(512, local.x)), y: Math.max(0, Math.min(512, local.y)) };
}

function setDrawingTool(tool) {
  drawingTool = tool;
  document.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("is-selected", button.dataset.tool === tool));
  renderDrawing();
}

function moveDrawingShape(shape, dx, dy) {
  for (const key of shape.type === "line" ? ["x1", "x2"] : ["x"]) shape[key] = Math.max(0, Math.min(512, shape[key] + dx));
  for (const key of shape.type === "line" ? ["y1", "y2"] : ["y"]) shape[key] = Math.max(0, Math.min(512, shape[key] + dy));
}

function finishDrawingGesture() {
  if (!drawingGesture) return;
  const { before, changed, created } = drawingGesture;
  if (created) {
    const shape = drawing.shapes.find((item) => item.id === created);
    const tooSmall = shape?.type === "line"
      ? Math.hypot(shape.x2 - shape.x1, shape.y2 - shape.y1) < 2
      : shape?.type === "path" ? shape.d === "M 0 0" : shape?.type !== "text" && (shape.width < 2 || shape.height < 2);
    if (!shape || tooSmall) {
      drawing.shapes = before;
      selectedShapeId = null;
    } else rememberDrawing(before);
  } else if (changed) rememberDrawing(before);
  drawingGesture = null;
  persistDrawing();
  renderDrawing();
}

function saveDrawing(asNew = false) {
  if (asNew) {
    $("#export-filename").value = drawing.filename.replace(/\.svg$/i, "");
    $("#export-format").value = "svg";
    $("#export-transparent").checked = true;
    $("#export-background-color").disabled = true;
    $("#drawing-export-dialog").showModal();
    return;
  }
  try {
    downloadFile(drawing.filename, serializeDrawingSvg(drawing.shapes), "image/svg+xml");
    persistDrawing();
    setDrawingStatus("drawingSaved");
    renderDrawing();
  } catch {
    setDrawingStatus("drawingNameInvalid");
  }
}

async function exportDrawingFile() {
  const base = $("#export-filename").value.trim().replace(/\.(svg|png|webp)$/i, "");
  if (!base || /[\u0000-\u001f\\/:*?"<>|]/.test(base)) { setDrawingStatus("drawingNameInvalid"); return; }
  const formatName = $("#export-format").value;
  const filename = `${base}.${formatName}`;
  let svg;
  try { svg = serializeDrawingSvg(drawing.shapes); } catch { setDrawingStatus("drawingExportFailed"); return; }
  if (formatName === "svg") {
    downloadFile(filename, svg, "image/svg+xml");
  } else {
    const size = Math.max(256, Math.min(2048, Number($("#export-size").value) || 512));
    const source = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try {
      const image = new Image();
      const loaded = new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
      image.src = source;
      await loaded;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      if (!$("#export-transparent").checked) {
        context.fillStyle = $("#export-background-color").value;
        context.fillRect(0, 0, size, size);
      }
      context.drawImage(image, 0, 0, size, size);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, formatName === "png" ? "image/png" : "image/webp"));
      if (!blob || blob.type !== (formatName === "png" ? "image/png" : "image/webp")) throw new Error("Image export is unavailable");
      downloadFile(filename, blob, blob.type);
    } catch {
      setDrawingStatus("drawingExportFailed");
      URL.revokeObjectURL(source);
      return;
    }
    URL.revokeObjectURL(source);
  }
  drawing.filename = `${base}.svg`;
  persistDrawing();
  renderDrawing();
  $("#drawing-export-dialog").close();
  setDrawingStatus("drawingSaved");
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
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    const value = dictionary()[element.dataset.i18nTitle] ?? "";
    element.title = value;
    element.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", dictionary()[element.dataset.i18nAria] ?? "");
  });
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
  });
  renderIconList();
}

function persistIcons() {
  const snapshot = validateIconCollection(icons);
  persistenceQueue = persistenceQueue.then(async () => {
    try {
      await writeStoredIcons(await getIconDatabase(), snapshot);
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* IndexedDB is authoritative. */ }
      return true;
    } catch {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        return true;
      } catch {
        announce("storageFailed");
        return false;
      }
    }
  });
  return persistenceQueue;
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
  if (list.dataset.query !== query) list.scrollTop = 0;
  list.dataset.query = query;
  listNames = names;
  const start = Math.max(0, Math.min(
    Math.max(0, names.length - ICON_LIST_WINDOW_SIZE),
    Math.floor(list.scrollTop / ICON_LIST_ITEM_HEIGHT) - 4,
  ));
  const end = Math.min(names.length, start + ICON_LIST_WINDOW_SIZE);
  if (list.dataset.windowStart === String(start) && list.dataset.windowEnd === String(end) && list.dataset.renderedCount === String(names.length)) return;
  list.dataset.windowStart = String(start);
  list.dataset.windowEnd = String(end);
  list.dataset.renderedCount = String(names.length);
  list.replaceChildren();
  if (start) {
    const spacer = document.createElement("div");
    spacer.className = "icon-list-spacer";
    spacer.setAttribute("aria-hidden", "true");
    spacer.style.height = `${Math.max(0, start * ICON_LIST_ITEM_HEIGHT - 6)}px`;
    list.append(spacer);
  }
  for (const [index, name] of names.slice(start, end).entries()) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-entry${name === activeName ? " is-active" : ""}`;
    button.dataset.iconName = name;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(name === activeName));
    button.setAttribute("aria-posinset", String(start + index + 1));
    button.setAttribute("aria-setsize", String(names.length));
    button.append(makeIconNode(icons[name], name));
    const label = document.createElement("span");
    label.textContent = name;
    button.append(label);
    button.addEventListener("click", () => selectIcon(name));
    list.append(button);
  }
  if (end < names.length) {
    const spacer = document.createElement("div");
    spacer.className = "icon-list-spacer";
    spacer.setAttribute("aria-hidden", "true");
    spacer.style.height = `${Math.max(0, (names.length - end) * ICON_LIST_ITEM_HEIGHT - 6)}px`;
    list.append(spacer);
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
  renderIconList();
  iconNameInput.value = name;
  iconPathInput.value = icons[name].path;
  iconViewBoxInput.value = icons[name].viewBox;
  $("#usage").value = `atlas:${name}`;
  iconPreview.replaceChildren(makeIconNode(icons[name], name, 120));
  $("#image-preview").hidden = true;
  $("#icon-preview").hidden = false;
  const index = listNames.indexOf(name);
  if (index >= 0 && (index < Number($("#icon-list").dataset.windowStart ?? 0) || index >= Number($("#icon-list").dataset.windowEnd ?? ICON_LIST_WINDOW_SIZE))) {
    $("#icon-list").scrollTop = index * ICON_LIST_ITEM_HEIGHT;
  }
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
    announce("invalidName");
    iconNameInput.setAttribute("aria-invalid", "true");
    $("#icon-name-hint").textContent = dictionary().invalidName;
    return;
  }
  if (nextName !== activeName && icons[nextName]) {
    iconNameInput.setAttribute("aria-invalid", "true");
    $("#icon-name-hint").textContent = dictionary().duplicateNameHint;
    announce("duplicateName");
    return;
  }
  iconNameInput.removeAttribute("aria-invalid");
  $("#icon-name-hint").textContent = dictionary().nameHint;
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
  const deletedIndex = names.indexOf(activeName);
  const deletedIcon = icons[activeName];
  const deletedName = activeName;
  delete icons[activeName];
  const remainingNames = Object.keys(icons);
  const nextName = remainingNames[Math.min(Math.max(0, deletedIndex), remainingNames.length - 1)];
  selectIcon(nextName);
  void persistIcons().then((saved) => {
    if (!saved) {
      icons[deletedName] = deletedIcon;
      selectIcon(deletedName);
    } else announce("deleted");
  });
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

async function importSvg(file, requestedName = iconNameInput.value.trim(), { persist = true, select = true } = {}) {
  if (file.size > MAX_SVG_SIZE) { announce("svgTooLarge"); return; }
  const name = requestedName;
  if (!isValidIconName(name)) { announce("invalidName"); return; }
  if (name !== activeName && icons[name]) { announce("duplicateName"); return; }
  try {
    const definition = parseSvg(await file.text());
    const previous = icons[name];
    icons[name] = definition;
    if (persist && !(await persistIcons())) {
      if (previous) icons[name] = previous;
      else delete icons[name];
      renderIconList();
      return false;
    }
    if (select) selectIcon(name);
    return true;
  } catch {
    announce("invalidSvg");
    return false;
  }
}

async function openFileStudioTransfer() {
  const token = new URLSearchParams(location.search).get("transfer");
  if (!/^[a-f0-9]{32}$/i.test(token ?? "")) return;
  const key = `${FILE_STUDIO_TRANSFER_PREFIX}${token}`;
  const serialized = safeStorageGet(key);
  try { localStorage.removeItem(key); } catch { /* The transfer is bounded by its expiry. */ }
  if (!serialized) { announce("transferFailed"); return; }

  try {
    const transfer = JSON.parse(serialized);
    const extension = String(transfer.extension ?? "").toLowerCase();
    const allowedExtensions = new Set(["svg", "png", "jpg", "jpeg", "webp"]);
    if (
      !allowedExtensions.has(extension)
      || typeof transfer.path !== "string"
      || !transfer.path.startsWith("/")
      || typeof transfer.name !== "string"
      || transfer.name !== transfer.name.split(/[\\/]/).pop()
      || !Number.isFinite(transfer.expiresAt)
      || transfer.expiresAt < Date.now()
    ) throw new Error("Invalid or expired transfer");

    const assetUrl = new URL(createAppUrl("api/file-studio/asset"), location.href);
    if (assetUrl.origin !== location.origin) throw new Error("Unexpected asset origin");
    assetUrl.searchParams.set("path", transfer.path);
    const response = await fetch(assetUrl, { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw new Error(`Asset request failed: ${response.status}`);
    const blob = await response.blob();
    const isSvg = extension === "svg";
    if (blob.size > (isSvg ? MAX_SVG_SIZE : MAX_IMAGE_SIZE)) throw new Error("Transferred file exceeds the import limit");
    const mimeType = isSvg ? "image/svg+xml" : extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";
    const file = new File([blob], transfer.name, { type: mimeType });
    if (isSvg) {
      const imported = await importSvg(file, suggestIconName(file.name, icons));
      if (imported) announce("svgLoaded");
    } else {
      showImage(file);
    }
  } catch {
    announce("transferFailed");
  }
}

function createAppUrl(path) {
  const baseUrl = new URL(location.href);
  baseUrl.search = "";
  baseUrl.hash = "";
  baseUrl.pathname = baseUrl.pathname.replace(/\/plugin-assets\/icon-studio\/.*$/, "/");
  if (!baseUrl.pathname.endsWith("/")) baseUrl.pathname = `${baseUrl.pathname}/`;
  return new URL(String(path ?? "").replace(/^\/+/, ""), baseUrl).toString();
}

function showImage(file) {
  const extension = file.name.toLowerCase().split(".").pop();
  const allowedWithoutMime = new Set(["png", "jpg", "jpeg", "webp"]);
  if (!IMAGE_TYPES.has(file.type) && !(file.type === "" && allowedWithoutMime.has(extension))) { announce("imageType"); return; }
  if (file.size > MAX_IMAGE_SIZE) { announce("imageTooLarge"); return; }
  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
  if (currentTraceUrl) URL.revokeObjectURL(currentTraceUrl);
  currentTraceUrl = null;
  currentTraceSvg = null;
  currentImageFile = file;
  currentImageUrl = URL.createObjectURL(file);
  $("#preview-image").src = currentImageUrl;
  $("#preview-image").alt = file.name;
  $("#trace-preview").hidden = true;
  $("#image-destination").hidden = false;
  const formatName = extension === "jpeg" ? "jpg" : extension;
  const rasterFormat = IMAGE_TYPES.has(file.type) ? ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" })[file.type] : formatName;
  const folder = `/config/www/atlas-icons/${rasterFormat}/`;
  const url = `/local/atlas-icons/${rasterFormat}/${encodeURIComponent(file.name)}`;
  $("#image-destination").textContent = format(dictionary().imageDestination, { folder, url });
  $("#image-preview").hidden = false;
  $("#icon-preview").hidden = true;
  announce("imageLoaded");
}

async function convertImageToSvg() {
  if (!currentImageFile) return;
  try {
    const image = $("#preview-image");
    if (!image.complete || !image.naturalWidth) {
      await new Promise((resolve, reject) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", reject, { once: true });
      });
    }
    const maxSide = 512;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const tracer = window.ImageTracer;
    if (!tracer?.imagedataToSVG) throw new Error("Vectorizer is unavailable");
    currentTraceSvg = tracer.imagedataToSVG(context.getImageData(0, 0, canvas.width, canvas.height), {
      numberofcolors: 8,
      pathomit: 8,
      ltres: 1,
      qtres: 1,
      roundcoords: 1,
      linefilter: true,
      viewbox: true,
      desc: false,
    });
    if (currentTraceUrl) URL.revokeObjectURL(currentTraceUrl);
    currentTraceUrl = URL.createObjectURL(new Blob([currentTraceSvg], { type: "image/svg+xml" }));
    const tracePreview = $("#trace-preview-image");
    tracePreview.src = currentTraceUrl;
    tracePreview.alt = `${currentImageFile.name} — SVG`;
    const name = suggestIconName(currentImageFile.name, {});
    $("#trace-destination").textContent = format(dictionary().traceDestination, { name });
    $("#trace-preview").hidden = false;
    announce("traceReady");
  } catch {
    announce("traceFailed");
  }
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
  if (file.size > 64 * 1024 * 1024) { announce("invalidCollection"); return; }
  try {
    const text = await file.text();
    const imported = file.name.toLowerCase().endsWith(".js") ? parseIconsetSource(text) : parseCollectionBackup(text);
    await applyImportedCollection(imported);
  } catch {
    announce("invalidCollection");
  }
}

function chooseImportConflictMode(count) {
  const dialog = $("#import-conflict-dialog");
  $("#import-conflict-prompt").textContent = format(dictionary().importConflictPrompt, { count });
  $("#import-conflict-mode").value = "rename";
  return new Promise((resolve) => {
    const finish = (mode) => {
      dialog.removeEventListener("close", onClose);
      resolve(mode);
    };
    const onClose = () => finish(dialog.returnValue === "apply" ? $("#import-conflict-mode").value : null);
    dialog.addEventListener("close", onClose, { once: true });
    dialog.showModal();
  });
}

async function applyImportedCollection(imported, { quiet = false } = {}) {
  const conflicts = Object.keys(imported).filter((name) => Object.hasOwn(icons, name));
  const mode = conflicts.length ? await chooseImportConflictMode(conflicts.length) : "rename";
  if (!mode) return 0;
  const previous = icons;
  const next = { ...icons };
  let added = 0;
  let firstImportedName = "";
  for (const [name, definition] of Object.entries(imported)) {
    let destination = name;
    if (Object.hasOwn(next, name)) {
      if (mode === "skip") continue;
      if (mode === "rename") destination = suggestIconName(`${name}.svg`, next);
      next[destination] = definition;
    } else {
      next[name] = definition;
    }
    firstImportedName ||= destination;
    added += 1;
  }
  icons = next;
  if (!(await persistIcons())) { icons = previous; renderIconList(); return 0; }
  selectIcon(firstImportedName || activeName);
  if (!quiet) announce("collectionImported", { count: added });
  return added;
}

async function fileStudioRequest(endpoint, options = {}) {
  const response = await fetch(createAppUrl(`api/file-studio/${endpoint}`), {
    cache: "no-store",
    credentials: "same-origin",
    headers: { "content-type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error ?? body.message ?? `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return body;
}

async function readHomeAssistantIconset(path = "/config/www/atlas-iconset.js") {
  const file = await fileStudioRequest(`file?path=${encodeURIComponent(path)}`);
  const iconsFromFile = parseIconsetSource(file.content ?? "");
  const added = await applyImportedCollection(iconsFromFile, { quiet: true });
  if (added) announce("haFileRead", { count: added });
}

async function nextAvailableIconsetPath() {
  for (let suffix = 2; suffix <= 1000; suffix += 1) {
    const path = `/config/www/atlas-iconset${suffix}.js`;
    try {
      await fileStudioRequest(`file?path=${encodeURIComponent(path)}`);
    } catch (error) {
      if (error.status === 404) return path;
      throw error;
    }
  }
  throw new Error("No available numbered icon-set filename was found.");
}

async function writeHomeAssistantIconset(path, source, overwrite) {
  const filename = path.split("/").pop();
  const parentPath = path.slice(0, path.lastIndexOf("/"));
  const response = await fetch(createAppUrl("api/file-studio/upload"), {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      "content-type": "application/octet-stream",
      "x-atlas-upload-parent": encodeURIComponent(parentPath),
      "x-atlas-upload-name": encodeURIComponent(filename),
      "x-atlas-upload-overwrite": String(overwrite),
    },
    body: new Blob([source], { type: "text/javascript;charset=utf-8" }),
  });
  const saved = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(saved.error ?? `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return saved;
}

async function saveIconsetToHomeAssistant() {
  try {
    saveActiveIcon();
    const source = createIconsetSource(icons);
    let existing;
    try {
      existing = await fileStudioRequest(`file?path=${encodeURIComponent("/config/www/atlas-iconset.js")}`);
    } catch (error) {
      if (error.status !== 404) throw error;
    }
    if (!existing) {
      await writeHomeAssistantIconset("/config/www/atlas-iconset.js", source, false);
      announce("haNewSaved", { path: "/config/www/atlas-iconset.js", url: "/local/atlas-iconset.js" });
      return;
    }

    let currentCount;
    try { currentCount = Object.keys(parseIconsetSource(existing.content ?? "")).length; } catch { /* Preserve unknown files unless replacement is explicitly chosen. */ }
    $("#ha-save-prompt").textContent = currentCount === undefined
      ? dictionary().haExistingUnknown
      : format(dictionary().haExisting, { count: currentCount });
    const dialog = $("#ha-save-dialog");
    const choice = await new Promise((resolve) => {
      const finish = (value) => {
        dialog.removeEventListener("close", onClose);
        resolve(value);
      };
      const onClose = () => finish(dialog.returnValue || null);
      dialog.addEventListener("close", onClose, { once: true });
      $("#ha-save-replace").onclick = () => { dialog.close("replace"); };
      $("#ha-save-new").onclick = () => { dialog.close("new"); };
      $("#ha-save-cancel").onclick = () => { dialog.close("cancel"); };
      dialog.showModal();
    });
    if (!choice || choice === "cancel") return;

    if (choice === "replace") {
      const saved = await writeHomeAssistantIconset(existing.path ?? "/config/www/atlas-iconset.js", source, true);
      announce("haReplaced", { backup: saved.backup?.name ?? "—" });
      return;
    }

    const path = await nextAvailableIconsetPath();
    const filename = path.split("/").pop();
    await writeHomeAssistantIconset(path, source, false);
    announce("haNewSaved", { path, url: `/local/${filename}` });
  } catch (error) {
    if (/Unsupported icon set source/.test(error.message)) announce("haUnsupported");
    else if (error.status === 413) announce("haUploadTooLarge");
    else announce("haAccessError", { message: error.message });
  }
}

languageButtons.forEach((button) => button.addEventListener("click", () => {
  safeStorageSet(LANGUAGE_KEY, button.dataset.language);
  setLanguage(button.dataset.language);
}));
$("#search-icons").addEventListener("input", renderIconList);
$("#icon-list").addEventListener("scroll", renderIconList, { passive: true });
$("#icon-list").addEventListener("keydown", (event) => {
  const current = listNames.indexOf(event.target.closest("[data-icon-name]")?.dataset.iconName ?? activeName);
  let next = current;
  if (event.key === "ArrowDown") next = Math.min(listNames.length - 1, current + 1);
  else if (event.key === "ArrowUp") next = Math.max(0, current - 1);
  else if (event.key === "PageDown") next = Math.min(listNames.length - 1, current + ICON_LIST_WINDOW_SIZE - 4);
  else if (event.key === "PageUp") next = Math.max(0, current - ICON_LIST_WINDOW_SIZE + 4);
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = listNames.length - 1;
  else return;
  event.preventDefault();
  if (listNames[next]) {
    selectIcon(listNames[next]);
    requestAnimationFrame(() => $("#icon-list").querySelector(`[data-icon-name="${CSS.escape(listNames[next])}"]`)?.focus());
  }
});
$("#new-icon").addEventListener("click", createNewIcon);
$("#delete-icon").addEventListener("click", deleteActiveIcon);
$("#icon-name").addEventListener("input", () => {
  const nextName = iconNameInput.value.trim();
  const duplicate = isValidIconName(nextName) && nextName !== activeName && Object.hasOwn(icons, nextName);
  const invalid = !isValidIconName(nextName);
  if (duplicate || invalid) {
    iconNameInput.setAttribute("aria-invalid", "true");
    $("#icon-name-hint").textContent = duplicate ? dictionary().duplicateNameHint : dictionary().invalidName;
  } else {
    iconNameInput.removeAttribute("aria-invalid");
    $("#icon-name-hint").textContent = dictionary().nameHint;
  }
});
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
    const previous = { ...icons };
    let loaded = 0;
    let lastImported = "";
    for (const file of files) {
      const name = suggestIconName(file.name, icons);
      if (await importSvg(file, name, { persist: false, select: false })) { loaded += 1; lastImported = name; }
    }
    if (loaded && !(await persistIcons())) { icons = previous; renderIconList(); loaded = 0; }
    if (lastImported && loaded) selectIcon(lastImported);
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
$("#convert-image").addEventListener("click", () => { void convertImageToSvg(); });
$("#download-traced-svg").addEventListener("click", () => {
  if (!currentTraceSvg || !currentImageFile) return;
  const name = suggestIconName(currentImageFile.name, {});
  downloadFile(`${name}.svg`, currentTraceSvg, "image/svg+xml");
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
$("#ha-read-iconset").addEventListener("click", () => {
  void readHomeAssistantIconset().catch((error) => {
    announce(/Unsupported icon set source/.test(error.message) ? "haUnsupported" : "haAccessError", { message: error.message });
  });
});
$("#ha-save-iconset").addEventListener("click", () => { void saveIconsetToHomeAssistant(); });
$("#copy-usage").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#usage").value);
    announce("copied");
  } catch {
    $("#usage").select();
    announce("copyFailed");
  }
});

document.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => setDrawingTool(button.dataset.tool)));
$("#drawing-canvas").addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const point = drawingPoint(event);
  const before = structuredClone(drawing.shapes);
  if (drawingTool === "select") {
    const shapeId = event.target.closest("[data-shape-id]")?.dataset.shapeId ?? null;
    selectedShapeId = shapeId;
    const selected = drawing.shapes.find((shape) => shape.id === shapeId);
    if (selected) {
      if (selected.type !== "line" && selected.type !== "path") {
        $("#drawing-fill-transparent").checked = selected.fill === "none";
        if (selected.fill !== "none") $("#drawing-fill").value = selected.fill;
      }
      $("#drawing-stroke").value = selected.stroke;
      $("#drawing-stroke-width").value = String(selected.strokeWidth);
      if (selected.type === "text") {
        $("#drawing-text").value = selected.text;
        $("#drawing-text-size").value = String(selected.fontSize);
      }
    }
    drawingGesture = shapeId ? { before, start: point, last: point, changed: false, shapeId } : null;
    renderDrawing();
    if (shapeId) $("#drawing-canvas").setPointerCapture(event.pointerId);
    return;
  }
  if (drawingTool === "text") {
    const text = $("#drawing-text").value.trim() || window.prompt(dictionary().textPrompt, "");
    if (!text) return;
    const textId = drawing.shapes.reduce((max, shape) => Math.max(max, Number(shape.id.slice(6)) || 0), 0) + 1;
    const shape = { id: `shape-${textId}`, type: "text", x: point.x, y: point.y, text: text.slice(0, 160), fontSize: Math.max(6, Math.min(128, Number($("#drawing-text-size").value) || 32)), fill: $("#drawing-fill").value, stroke: "none", strokeWidth: 0 };
    if (!validateDrawingShape(shape)) { setDrawingStatus("drawingTextInvalid"); return; }
    rememberDrawing(before);
    drawing.shapes.push(shape);
    selectedShapeId = shape.id;
    $("#drawing-text").value = shape.text;
    persistDrawing();
    renderDrawing();
    return;
  }
  const nextId = drawing.shapes.reduce((max, shape) => Math.max(max, Number(shape.id.slice(6)) || 0), 0) + 1;
  const id = `shape-${nextId}`;
  const pen = drawingTool === "pen";
  const fill = $("#drawing-fill-transparent").checked ? "none" : $("#drawing-fill").value;
  const common = { id, type: pen ? "path" : drawingTool, stroke: $("#drawing-stroke").value, strokeWidth: Math.max(0, Math.min(32, Number($("#drawing-stroke-width").value) || 0)), fill };
  const shape = drawingTool === "line" ? { ...common, x1: point.x, y1: point.y, x2: point.x, y2: point.y } : pen ? { ...common, x: point.x, y: point.y, d: "M 0 0" } : { ...common, x: point.x, y: point.y, width: 0, height: 0 };
  drawing.shapes.push(shape);
  selectedShapeId = id;
  drawingGesture = { before, start: point, last: point, changed: true, created: id };
  $("#drawing-canvas").setPointerCapture(event.pointerId);
  renderDrawing();
});
$("#drawing-canvas").addEventListener("pointermove", (event) => {
  if (!drawingGesture) return;
  const point = drawingPoint(event);
  if (drawingGesture.created) {
    const shape = drawing.shapes.find((item) => item.id === drawingGesture.created);
    if (shape.type === "line") { shape.x2 = point.x; shape.y2 = point.y; }
    else if (shape.type === "path") shape.d += ` L ${Math.round(point.x - drawingGesture.start.x)} ${Math.round(point.y - drawingGesture.start.y)}`;
    else { shape.x = Math.min(drawingGesture.start.x, point.x); shape.y = Math.min(drawingGesture.start.y, point.y); shape.width = Math.abs(point.x - drawingGesture.start.x); shape.height = Math.abs(point.y - drawingGesture.start.y); }
  } else {
    const shape = drawing.shapes.find((item) => item.id === drawingGesture.shapeId);
    const dx = point.x - drawingGesture.last.x;
    const dy = point.y - drawingGesture.last.y;
    if (Math.abs(dx) + Math.abs(dy) > 0.1) drawingGesture.changed = true;
    moveDrawingShape(shape, dx, dy);
  }
  drawingGesture.last = point;
  renderDrawing();
});
$("#drawing-canvas").addEventListener("pointerup", finishDrawingGesture);
$("#drawing-canvas").addEventListener("pointercancel", finishDrawingGesture);
$("#drawing-undo").addEventListener("click", () => {
  if (!drawingUndo.length) return;
  drawingRedo.push(structuredClone(drawing.shapes));
  drawing.shapes = drawingUndo.pop();
  selectedShapeId = null;
  persistDrawing();
  renderDrawing();
});
$("#drawing-redo").addEventListener("click", () => {
  if (!drawingRedo.length) return;
  drawingUndo.push(structuredClone(drawing.shapes));
  if (drawingUndo.length > DRAWING_HISTORY_LIMIT) drawingUndo.shift();
  drawing.shapes = drawingRedo.pop();
  selectedShapeId = null;
  persistDrawing();
  renderDrawing();
});
$("#drawing-delete").addEventListener("click", () => {
  if (!drawing.shapes.some((shape) => shape.id === selectedShapeId)) { setDrawingStatus("drawingNothingSelected"); return; }
  rememberDrawing(structuredClone(drawing.shapes));
  drawing.shapes = drawing.shapes.filter((shape) => shape.id !== selectedShapeId);
  selectedShapeId = null;
  persistDrawing();
  renderDrawing();
});
$("#drawing-duplicate").addEventListener("click", () => {
  const index = drawing.shapes.findIndex((shape) => shape.id === selectedShapeId);
  if (index < 0) return;
  const before = structuredClone(drawing.shapes);
  const copy = structuredClone(drawing.shapes[index]);
  const nextId = drawing.shapes.reduce((max, shape) => Math.max(max, Number(shape.id.slice(6)) || 0), 0) + 1;
  copy.id = `shape-${nextId}`;
  if (copy.type === "line") { copy.x1 += 12; copy.x2 += 12; copy.y1 += 12; copy.y2 += 12; }
  else { copy.x = Math.min(500, copy.x + 12); copy.y = Math.min(500, copy.y + 12); }
  drawing.shapes.splice(index + 1, 0, copy);
  rememberDrawing(before);
  selectedShapeId = copy.id;
  persistDrawing();
  renderDrawing();
});
function reorderSelectedShape(direction) {
  const index = drawing.shapes.findIndex((shape) => shape.id === selectedShapeId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= drawing.shapes.length) return;
  rememberDrawing(structuredClone(drawing.shapes));
  [drawing.shapes[index], drawing.shapes[target]] = [drawing.shapes[target], drawing.shapes[index]];
  persistDrawing();
  renderDrawing();
}
$("#drawing-backward").addEventListener("click", () => reorderSelectedShape(-1));
$("#drawing-forward").addEventListener("click", () => reorderSelectedShape(1));
$("#drawing-clear").addEventListener("click", () => {
  if (!drawing.shapes.length) return;
  rememberDrawing(structuredClone(drawing.shapes));
  drawing.shapes = [];
  selectedShapeId = null;
  persistDrawing();
  renderDrawing();
  setDrawingStatus("drawingCleared");
});
$("#drawing-fill").addEventListener("input", (event) => updateDrawing((shape) => { if (!["line", "path"].includes(shape.type)) shape.fill = event.target.value; }));
$("#drawing-fill-transparent").addEventListener("change", (event) => updateDrawing((shape) => { if (!["line", "path", "text"].includes(shape.type)) shape.fill = event.target.checked ? "none" : $("#drawing-fill").value; }));
$("#drawing-stroke").addEventListener("input", (event) => updateDrawing((shape) => { shape.stroke = event.target.value; }));
$("#drawing-stroke-width").addEventListener("change", (event) => {
  const width = Math.max(0, Math.min(32, Number(event.target.value) || 0));
  event.target.value = String(width);
  updateDrawing((shape) => { shape.strokeWidth = width; });
});
$("#drawing-text").addEventListener("change", (event) => updateDrawing((shape) => { if (shape.type === "text" && event.target.value.trim()) shape.text = event.target.value.trim().slice(0, 160); }));
$("#drawing-text-size").addEventListener("change", (event) => {
  const size = Math.max(6, Math.min(128, Number(event.target.value) || 32));
  event.target.value = String(size);
  updateDrawing((shape) => { if (shape.type === "text") shape.fontSize = size; });
});
$("#drawing-zoom").addEventListener("input", (event) => {
  const zoom = clampDrawingZoom(event.target.value);
  $("#drawing-canvas").style.width = `${512 * zoom}px`;
  $("#drawing-canvas").style.height = `${512 * zoom}px`;
  $("#drawing-zoom-value").value = `${Math.round(zoom * 100)}%`;
});
$("#drawing-save").addEventListener("click", () => saveDrawing());
$("#drawing-save-as").addEventListener("click", () => saveDrawing(true));
$("#drawing-export-format").addEventListener("change", (event) => {
  $("#export-background-color").disabled = event.target.value === "svg" || $("#export-transparent").checked;
});
$("#export-transparent").addEventListener("change", (event) => {
  $("#export-background-color").disabled = event.target.checked || $("#export-format").value === "svg";
});
$("#export-cancel").addEventListener("click", () => $("#drawing-export-dialog").close());
$("#drawing-export-form").addEventListener("submit", (event) => {
  event.preventDefault();
  void exportDrawingFile();
});
document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select")) return;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    $(event.shiftKey ? "#drawing-redo" : "#drawing-undo").click();
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
    event.preventDefault();
    $("#drawing-redo").click();
  } else if ((event.key === "Delete" || event.key === "Backspace") && selectedShapeId) {
    event.preventDefault();
    $("#drawing-delete").click();
  }
});

const requestedLanguage = new URLSearchParams(location.search).get("language");
const savedLanguage = safeStorageGet(LANGUAGE_KEY);
setLanguage(translations[requestedLanguage] ? requestedLanguage : translations[savedLanguage] ? savedLanguage : "de");
renderDrawing();
const iconWorkspace = $(".workspace");
iconWorkspace.inert = true;
void (async () => {
  icons = await loadIcons();
  iconWorkspace.inert = false;
  selectIcon(activeName);
  await openFileStudioTransfer();
})();
