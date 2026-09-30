# ATLAS Icon Studio

Plugin ID: `atlas.plugin.icon-studio`

## Farbiger SVG-Zeicheneditor / Colored SVG drawing editor / Éditeur SVG couleur

Der separate Zeichenbereich erstellt farbige SVG-Grafiken mit Rechtecken, Ellipsen, Linien, Freihandstift und Text. Formen lassen sich auswählen, verschieben, duplizieren und in der Ebenenreihenfolge anordnen. Füllung und Hintergrund können transparent sein; Kontur, Linienstärke, Textgröße und Zoom sind einstellbar. Löschen, Leeren und bis zu zehn Rückgängig-/Wiederholen-Schritte sind verfügbar. **Speichern unter** exportiert SVG, PNG oder WebP; bei PNG/WebP kann ein transparenter oder farbiger Hintergrund gewählt werden. Der Entwurf bleibt im lokalen Browserspeicher. Downloads werden nicht automatisch nach Home Assistant kopiert.

The separate drawing area creates colored SVG graphics with rectangles, ellipses, lines, a freehand pen and text. Shapes can be selected, moved, duplicated and reordered. Fill and background can be transparent; stroke, stroke width, text size and zoom are configurable. It includes delete, clear and up to ten undo/redo steps. **Save as** exports SVG, PNG or WebP; PNG/WebP can use a transparent or colored background. The draft stays in browser-local storage. Downloads are not copied to Home Assistant automatically.

La zone de dessin séparée crée des graphiques SVG en couleur avec des rectangles, des ellipses, des lignes, un crayon à main levée et du texte. Les formes peuvent être sélectionnées, déplacées, dupliquées et réordonnées. Le remplissage et l’arrière-plan peuvent être transparents ; le contour, son épaisseur, la taille du texte et le zoom sont réglables. Elle propose la suppression, l’effacement et jusqu’à dix étapes d’annulation/rétablissement. **Enregistrer sous** exporte en SVG, PNG ou WebP ; les exports PNG/WebP peuvent avoir un arrière-plan transparent ou coloré. Le brouillon reste dans le stockage local du navigateur. Les téléchargements ne sont pas copiés automatiquement dans Home Assistant.

## Deutsch

ATLAS Icon Studio verwaltet eine lokale Icon-Sammlung im Browser, zeigt SVG- und gängige Rasterbilder an und exportiert ein Home-Assistant-Custom-Iconset mit dem Präfix `atlas:`. Beispiele sind `atlas:home`, `atlas:lightbulb` und `atlas:thermometer`.

### Iconset erstellen und laden

1. Wähle ein Beispiel-Icon oder erstelle ein neues. Suche und benenne Icons um, bearbeite SVG-Pfaddaten und `viewBox` oder importiere einfache SVG-Dateien mit `<path>`-Elementen.
2. Sichere oder importiere die Sammlung als JSON. Lade ein einzelnes Icon als SVG oder das ganze Iconset als `atlas-iconset.js` herunter.
3. Kopiere die JavaScript-Datei mit Samba oder File Studio nach `/config/www/atlas-iconset.js`.
4. Füge `/local/atlas-iconset.js` in Home Assistant unter **Einstellungen → Dashboards → Ressourcen** als JavaScript-Modul hinzu.
5. Lade die Home-Assistant-Oberfläche neu und verwende `atlas:home` oder einen anderen exportierten Iconnamen in Ansichten, Entitäten und Karten, die Home-Assistant-Icons unterstützen.

Die Sammlung bleibt in IndexedDB im lokalen Browserspeicher; vorhandene Daten aus dem älteren lokalen Speicher werden automatisch übernommen. So lassen sich umfangreichere SVG-Sammlungen speichern. Ein Import kann bis zu 50 SVG-Dateien mit insgesamt 20 MiB enthalten. Das Custom Iconset liefert monochrome SVG-Pfade und eine `viewBox`; es ist kein allgemeiner SVG-Renderer. Beim Import werden Pfade übernommen, der Dateiname als Iconname vorgeschlagen und Farben, CSS-Klassen sowie Verläufe verworfen. Skripte, externe Verweise und Transformationen werden abgelehnt. PNG, JPG und WebP bleiben farbige Bilddateien. Nach dem Download kopierst du sie nach `/config/www/atlas-icons/png/`, `/config/www/atlas-icons/jpg/` oder `/config/www/atlas-icons/webp/`; Home Assistant erreicht sie über `/local/atlas-icons/<format>/<dateiname>`.

Rasterbilder können optional im Browser in ein farbiges SVG nachgezeichnet werden. Die Vorschau zeigt das Ergebnis vor dem Download. Die Umwandlung verkleinert Bilder dafür auf höchstens 512 Pixel an der längsten Seite und verwendet bis zu acht Farben. Einfache Logos funktionieren meist besser als Fotos oder detailreiche Motive. Die Originaldatei bleibt unverändert; das erzeugte SVG ist eine separate Grafik in `/config/www/atlas-icons/svg/` und gehört nicht zum monochromen `atlas:`-Iconset.

Das Plugin lädt die erzeugte Ressource herunter. Es ändert keine Home-Assistant-Konfiguration und registriert Ressourcen nicht automatisch.

SVG-, PNG-, JPG/JPEG- und WebP-Dateien können auch direkt aus der Bildvorschau von File Studio an Icon Studio übergeben werden. Rasterbilder öffnen sich in der Vorschau; einfache SVG-Pfaddateien werden in das monochrome Iconset importiert. Beide Plugins müssen auf demselben ATLAS-Server installiert sein und die Datei muss weiterhin zugänglich sein. Die Übergabe verwendet einen kurzlebigen Schlüssel im lokalen Browserspeicher und den bereits freigegebenen File-Studio-Dateizugriff.

Die Iconliste rendert nur 24 sichtbare Einträge gleichzeitig und unterstützt Pfeiltasten, Bild-Auf/Ab sowie Pos1/Ende. Es gibt keine feste Anzahlgrenze für Icons. JSON-Sammlungen und von Icon Studio erzeugte `atlas-iconset.js`-Dateien können vom PC eingelesen werden. Namenskonflikte lassen sich ersetzen, überspringen oder automatisch umbenennen. Für direkten Home-Assistant-Zugriff muss `/config/www` in der File-Studio-Freigabe enthalten sein. Icon Studio zeigt beim Einlesen die Zahl erkannter Icons; beim Speichern kann die vorhandene Datei ersetzt (mit automatischer Sicherung) oder eine neue nummerierte Datei erstellt werden. Für eine neue Datei zeigt das Plugin den Ressourcenpfad zum Eintragen in Home Assistant an. Home-Assistant-Uploads sind auf 64 MiB pro Datei begrenzt.

## English

ATLAS Icon Studio manages a browser-local icon collection, previews SVG and common raster images, and exports a Home Assistant custom icon set using the `atlas:` prefix. Samples include `atlas:home`, `atlas:lightbulb` and `atlas:thermometer`.

### Create and load an icon set

1. Select a sample or create an icon. Search and rename icons, edit SVG path data and `viewBox`, or import simple SVG files containing `<path>` elements.
2. Back up or import the collection as JSON. Download an individual icon as SVG or export the full set as `atlas-iconset.js`.
3. Copy the JavaScript file to `/config/www/atlas-iconset.js` using Samba or File Studio.
4. Add `/local/atlas-iconset.js` as a JavaScript module in Home Assistant under **Settings → Dashboards → Resources**.
5. Reload the Home Assistant frontend and use `atlas:home` or another exported icon name in views, entities and cards that support Home Assistant icons.

The collection stays in browser-local IndexedDB; existing data from older local storage is migrated automatically. This supports larger SVG collections. Each batch import accepts up to 50 SVG files with a combined size of 20 MiB. The custom icon set returns monochrome SVG paths and a `viewBox`; it is not a general SVG renderer. SVG imports keep their paths, suggest an icon name from the filename, and discard colors, CSS classes and gradients. Scripts, external references and transforms are rejected. PNG, JPG and WebP remain colored image files. After downloading, copy them to `/config/www/atlas-icons/png/`, `/config/www/atlas-icons/jpg/` or `/config/www/atlas-icons/webp/`; Home Assistant serves them at `/local/atlas-icons/<format>/<filename>`.

Raster images can optionally be traced into a colored SVG in the browser. Preview the result before downloading it. Tracing scales the image to a maximum 512-pixel longest side and uses up to eight colors. Simple logos usually trace better than photos or detailed artwork. The original file remains unchanged; the SVG is a separate graphic for `/config/www/atlas-icons/svg/`, not part of the monochrome `atlas:` icon set.

The plugin downloads the generated resource. It does not edit Home Assistant configuration or register resources automatically.

File Studio can also hand SVG, PNG, JPG/JPEG and WebP files directly to Icon Studio from its image preview. Raster images open in the preview; simple SVG path files are imported into the monochrome icon set. Both plugins must be installed on the same ATLAS server, and the file must remain accessible. The handoff uses a short-lived browser-local key and File Studio's existing approved file access.

The icon list renders only 24 entries at a time and supports arrow keys, Page Up/Down, Home and End. There is no fixed icon-count limit. JSON collections and `atlas-iconset.js` files generated by Icon Studio can be imported from the PC. Name conflicts can be replaced, skipped or renamed automatically. Direct Home Assistant access requires `/config/www` to be included in File Studio's approved roots. Icon Studio shows the number of icons it recognizes when reading a file; when saving, it can replace the existing file (with an automatic backup) or create a numbered new file. For a new file, it shows the resource path to add in Home Assistant. Home Assistant uploads have a 64 MiB per-file limit.

## Français

ATLAS Icon Studio gère une collection d’icônes dans le stockage local du navigateur, affiche les SVG et les formats image courants, et exporte un jeu d’icônes personnalisé Home Assistant avec le préfixe `atlas:`. Exemples : `atlas:home`, `atlas:lightbulb` et `atlas:thermometer`.

### Créer et charger un jeu d’icônes

1. Choisissez un exemple ou créez une icône. Recherchez et renommez les icônes, modifiez les données du chemin SVG et le `viewBox`, ou importez des fichiers SVG simples contenant des éléments `<path>`.
2. Sauvegardez ou importez la collection au format JSON. Téléchargez une icône individuelle en SVG ou exportez le jeu complet sous `atlas-iconset.js`.
3. Copiez le fichier JavaScript vers `/config/www/atlas-iconset.js` avec Samba ou File Studio.
4. Ajoutez `/local/atlas-iconset.js` comme module JavaScript dans Home Assistant, sous **Paramètres → Tableaux de bord → Ressources**.
5. Rechargez l’interface Home Assistant et utilisez `atlas:home` ou un autre nom d’icône exporté dans les vues, entités et cartes compatibles avec les icônes Home Assistant.

La collection reste dans IndexedDB, le stockage local du navigateur ; les données de l’ancien stockage local sont migrées automatiquement. Cela permet de conserver des collections SVG plus volumineuses. Chaque importation peut contenir jusqu’à 50 fichiers SVG, pour une taille totale de 20 Mio. Le jeu personnalisé renvoie des chemins SVG monochromes et un `viewBox` ; ce n’est pas un moteur SVG généraliste. L’import conserve les chemins, propose le nom du fichier comme nom d’icône et supprime les couleurs, les classes CSS et les dégradés. Les scripts, les références externes et les transformations sont refusés. Les fichiers PNG, JPG et WebP restent des images en couleur. Après le téléchargement, copiez-les dans `/config/www/atlas-icons/png/`, `/config/www/atlas-icons/jpg/` ou `/config/www/atlas-icons/webp/` ; Home Assistant les sert à l’adresse `/local/atlas-icons/<format>/<nom-du-fichier>`.

Les images matricielles peuvent être vectorisées en SVG couleur dans le navigateur, avec un aperçu avant le téléchargement. La conversion réduit l’image à 512 pixels maximum sur son côté le plus long et utilise jusqu’à huit couleurs. Les logos simples donnent généralement de meilleurs résultats que les photos ou les images détaillées. Le fichier original reste intact ; le SVG est un fichier graphique distinct à placer dans `/config/www/atlas-icons/svg/`, séparé du jeu d’icônes monochromes `atlas:`.

Le plugin télécharge la ressource générée. Il ne modifie pas la configuration Home Assistant et n’enregistre pas automatiquement les ressources.

File Studio peut également transmettre directement des fichiers SVG, PNG, JPG/JPEG et WebP depuis son aperçu d’image vers Icon Studio. Les images matricielles s’ouvrent dans l’aperçu ; les fichiers SVG simples contenant des chemins sont importés dans le jeu d’icônes monochromes. Les deux plugins doivent être installés sur le même serveur ATLAS et le fichier doit rester accessible. Le transfert utilise une clé temporaire dans le stockage local du navigateur et l’accès aux fichiers autorisé de File Studio.

La liste n’affiche que 24 éléments à la fois et prend en charge les flèches, Page précédente/suivante, Début et Fin. Le nombre d’icônes n’est pas limité. Les collections JSON et les fichiers `atlas-iconset.js` générés par Icon Studio peuvent être importés depuis le PC. Les conflits de noms peuvent être résolus en remplaçant, en ignorant ou en renommant automatiquement les icônes. L’accès direct à Home Assistant nécessite que `/config/www` figure parmi les dossiers autorisés de File Studio. Icon Studio affiche le nombre d’icônes reconnues lors de la lecture ; lors de l’enregistrement, il peut remplacer le fichier existant (avec sauvegarde automatique) ou créer un nouveau fichier numéroté. Pour un nouveau fichier, le chemin de ressource à ajouter dans Home Assistant est indiqué. Les envois vers Home Assistant sont limités à 64 Mio par fichier.

## Logiciel tiers

La vectorisation des images utilise [ImageTracerJS 1.2.6](https://github.com/jankovicsandras/imagetracerjs), distribué sous licence Unlicense. Le texte de cette licence est inclus dans `IMAGETRACER-LICENSE.txt`.
