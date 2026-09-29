# ATLAS Icon Studio

Plugin ID: `atlas.plugin.icon-studio`

ATLAS Icon Studio manages a browser-local icon collection, previews SVG and common raster images, and exports a Home Assistant custom icon set named `atlas`. Sample icons include `atlas:home`, `atlas:lightbulb` and `atlas:thermometer`.

## Create and load an icon set

1. Select a sample or create a new icon; search, rename, edit its SVG path and viewBox, or import one or more SVGs using simple `<path>` elements.
2. Back up and restore the collection as JSON. Download an individual SVG or export the complete icon set as `atlas-iconset.js`.
3. Copy the JavaScript file to `/config/www/atlas-iconset.js` using Samba or File Studio.
4. Add `/local/atlas-iconset.js` as a JavaScript module resource in Home Assistant under **Settings → Dashboards → Resources**.
5. Reload the Home Assistant frontend and use `atlas:home` (or any exported icon name) in a view, entity, or card that accepts Home Assistant icons.

The icon collection is saved in browser-local storage. The custom icon set returns monochrome SVG path data and a `viewBox`; it is not a general SVG renderer. Imported SVGs must contain path elements and must not depend on scripts, external resources, CSS, filters or transforms. PNG, JPEG, GIF, WebP, BMP and ICO images can be previewed and downloaded in Icon Studio, but Home Assistant's icon API cannot turn raster images into `atlas:` vector icons. Use them as normal image files in dashboard cards instead.

The plugin only downloads the generated resource. It does not write to Home Assistant configuration or register frontend resources automatically.
