# ATLAS Icon Studio

Plugin ID: `atlas.plugin.icon-studio`

## Deutsch

ATLAS Icon Studio verwaltet eine lokale Icon-Sammlung im Browser, zeigt SVG- und gängige Rasterbilder an und exportiert ein Home-Assistant-Custom-Iconset mit dem Präfix `atlas:`. Beispiele sind `atlas:home`, `atlas:lightbulb` und `atlas:thermometer`.

### Iconset erstellen und laden

1. Wähle ein Beispiel-Icon oder erstelle ein neues. Suche und benenne Icons um, bearbeite SVG-Pfaddaten und `viewBox` oder importiere einfache SVG-Dateien mit `<path>`-Elementen.
2. Sichere oder importiere die Sammlung als JSON. Lade ein einzelnes Icon als SVG oder das ganze Iconset als `atlas-iconset.js` herunter.
3. Kopiere die JavaScript-Datei mit Samba oder File Studio nach `/config/www/atlas-iconset.js`.
4. Füge `/local/atlas-iconset.js` in Home Assistant unter **Einstellungen → Dashboards → Ressourcen** als JavaScript-Modul hinzu.
5. Lade die Home-Assistant-Oberfläche neu und verwende `atlas:home` oder einen anderen exportierten Iconnamen in Ansichten, Entitäten und Karten, die Home-Assistant-Icons unterstützen.

Die Sammlung bleibt im lokalen Browserspeicher. Das Custom Iconset liefert monochrome SVG-Pfade und eine `viewBox`; es ist kein allgemeiner SVG-Renderer. Beim Import werden Pfade übernommen, Dateiname als Iconnamen vorgeschlagen und Farben, CSS-Klassen sowie Verläufe verworfen. Skripte, externe Verweise und Transformationen werden abgelehnt. PNG, JPEG, GIF, WebP, BMP und ICO können angezeigt und heruntergeladen werden, aber nicht als vektorbasierte `atlas:`-Icons exportiert werden. Verwende Rasterbilder in Karten als normale Bilddateien.

Das Plugin lädt die erzeugte Ressource herunter. Es ändert keine Home-Assistant-Konfiguration und registriert Ressourcen nicht automatisch.

## English

ATLAS Icon Studio manages a browser-local icon collection, previews SVG and common raster images, and exports a Home Assistant custom icon set using the `atlas:` prefix. Samples include `atlas:home`, `atlas:lightbulb` and `atlas:thermometer`.

### Create and load an icon set

1. Select a sample or create an icon. Search and rename icons, edit SVG path data and `viewBox`, or import simple SVG files containing `<path>` elements.
2. Back up or import the collection as JSON. Download an individual icon as SVG or export the full set as `atlas-iconset.js`.
3. Copy the JavaScript file to `/config/www/atlas-iconset.js` using Samba or File Studio.
4. Add `/local/atlas-iconset.js` as a JavaScript module in Home Assistant under **Settings → Dashboards → Resources**.
5. Reload the Home Assistant frontend and use `atlas:home` or another exported icon name in views, entities and cards that support Home Assistant icons.

The collection stays in browser-local storage. The custom icon set returns monochrome SVG paths and a `viewBox`; it is not a general SVG renderer. SVG imports keep their paths, suggest an icon name from the filename, and discard colors, CSS classes and gradients. Scripts, external references and transforms are rejected. PNG, JPEG, GIF, WebP, BMP and ICO files can be previewed and downloaded, but cannot be exported as vector `atlas:` icons. Use raster images in cards as ordinary image files.

The plugin downloads the generated resource. It does not edit Home Assistant configuration or register resources automatically.

## Français

ATLAS Icon Studio gère une collection d’icônes dans le stockage local du navigateur, affiche les SVG et les formats image courants, et exporte un jeu d’icônes personnalisé Home Assistant avec le préfixe `atlas:`. Exemples : `atlas:home`, `atlas:lightbulb` et `atlas:thermometer`.

### Créer et charger un jeu d’icônes

1. Choisissez un exemple ou créez une icône. Recherchez et renommez les icônes, modifiez les données du chemin SVG et le `viewBox`, ou importez des fichiers SVG simples contenant des éléments `<path>`.
2. Sauvegardez ou importez la collection au format JSON. Téléchargez une icône individuelle en SVG ou exportez le jeu complet sous `atlas-iconset.js`.
3. Copiez le fichier JavaScript vers `/config/www/atlas-iconset.js` avec Samba ou File Studio.
4. Ajoutez `/local/atlas-iconset.js` comme module JavaScript dans Home Assistant, sous **Paramètres → Tableaux de bord → Ressources**.
5. Rechargez l’interface Home Assistant et utilisez `atlas:home` ou un autre nom d’icône exporté dans les vues, entités et cartes compatibles avec les icônes Home Assistant.

La collection reste dans le stockage local du navigateur. Le jeu personnalisé renvoie des chemins SVG monochromes et un `viewBox` ; ce n’est pas un moteur SVG généraliste. L’import conserve les chemins, propose le nom du fichier comme nom d’icône et supprime les couleurs, les classes CSS et les dégradés. Les scripts, les références externes et les transformations sont refusés. Les fichiers PNG, JPEG, GIF, WebP, BMP et ICO peuvent être affichés et téléchargés, mais ne peuvent pas être exportés comme icônes vectorielles `atlas:`. Utilisez les images matricielles dans les cartes comme des fichiers image ordinaires.

Le plugin télécharge la ressource générée. Il ne modifie pas la configuration Home Assistant et n’enregistre pas automatiquement les ressources.
