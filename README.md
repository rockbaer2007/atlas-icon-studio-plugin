# ATLAS Icon Studio Plugin Repository

An external ATLAS plugin repository for editing and organizing monochrome SVG icons, previewing common image files, and creating Home Assistant custom icon-set resources. The included vector icon set registers the `atlas:` namespace, with `atlas:home` as its example.

## Install in ATLAS

Add this repository catalog URL in ATLAS Administration's Plugin Manager:

```text
https://raw.githubusercontent.com/rockbaer2007/atlas-icon-studio-plugin/main/repository.json
```

The Home Assistant Card Editor remains ATLAS's only integrated reference plugin. Icon Studio is a separately maintained external plugin.

## Local development

```sh
npm run build
npm run check
```

The builder synchronizes `repository.json` and the generated install package from the plugin manifest. Run it after each version change. `npm test` verifies icon validation and generated icon-set behavior.

## Home Assistant `atlas:` icon set

The plugin keeps the icon collection in this browser, lets you add, rename, search, edit and remove icons, import several SVGs at once, and back up or restore the collection as JSON. It exports both individual SVGs and the entire icon set. It exports `atlas-iconset.js`; copy it to `/config/www/atlas-iconset.js`, add `/local/atlas-iconset.js` as a JavaScript module resource in **Settings → Dashboards → Resources**, and reload the Home Assistant frontend. The included samples can then be referenced as `atlas:home`, `atlas:lightbulb` and `atlas:thermometer`.

SVG imports accept simple path elements without scripts, external references, styles or transforms. PNG, JPEG, GIF, WebP, BMP and ICO are previewed and downloadable as ordinary images; Home Assistant's custom icon-set API requires SVG vector paths and does not return raster files as `atlas:` icons. See [`plugins/icon-studio/README.md`](plugins/icon-studio/README.md) for setup and format limits.
