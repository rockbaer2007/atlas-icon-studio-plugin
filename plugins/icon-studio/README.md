# ATLAS Icon Studio

Plugin ID: `atlas.plugin.icon-studio`

ATLAS Icon Studio previews SVG, PNG and JPEG files. It can export a small Home Assistant custom icon set named `atlas`, so the sample icon is used as `atlas:home`.

## Create and load an icon set

1. Import an SVG that uses simple `<path>` elements, or start with the `home` sample.
2. Enter an icon name using lowercase letters, digits and hyphens.
3. Download `atlas-iconset.js` from the plugin.
4. Copy the file to `/config/www/atlas-iconset.js` using Samba or File Studio.
5. Add `/local/atlas-iconset.js` as a JavaScript module resource in Home Assistant under **Settings → Dashboards → Resources**.
6. Reload the Home Assistant frontend and use `atlas:home` (or the name you chose) in a view, entity, or card that accepts Home Assistant icons.

The custom icon set returns SVG path data and a `viewBox`; it is not a general SVG renderer. Imported SVGs must contain path elements and must not depend on scripts, external resources, CSS, filters or transforms. Raster PNG/JPEG images can be previewed in Icon Studio, but Home Assistant's icon API cannot turn them into `atlas:` vector icons. Use them as normal image files in dashboard cards instead.

The plugin only downloads the generated resource. It does not write to Home Assistant configuration or register frontend resources automatically.
