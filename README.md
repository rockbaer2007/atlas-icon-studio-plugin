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

The plugin also includes a separate colored graphics editor with rectangle, ellipse, line, freehand and text tools; selection, move, duplicate and layer ordering; transparent fill/background; stroke, text-size and zoom controls; and up to ten undo/redo steps. Save as exports SVG, PNG or WebP, with optional transparency for raster backgrounds. Drafts stay in browser-local storage. This editor remains separate from the monochrome `atlas:` icon set.

The plugin stores its icon collection in browser-local IndexedDB and automatically migrates older local-storage data. Its virtualized list renders 24 icons at a time, while search and export cover the complete collection; there is no fixed icon-count limit. Import JSON collections or Icon Studio generated `atlas-iconset.js` files from the PC, and resolve duplicate names by replacing, skipping or automatic renaming. The PC export remains available. With `/config/www` approved in File Studio, Icon Studio can also read and write the Home Assistant icon-set file. Replacing it creates a backup; alternatively, create a numbered file and add the displayed `/local/...` resource path in Home Assistant.

SVG imports accept simple path elements without scripts, external references, styles or transforms. PNG, JPG and WebP are previewed and downloaded as ordinary images into separate suggested folders; simple raster artwork can optionally be traced to a separate colored SVG. Home Assistant's custom icon-set API requires SVG vector paths and does not return raster files as `atlas:` icons. See [`plugins/icon-studio/README.md`](plugins/icon-studio/README.md) for setup and format limits.

File Studio can open SVG, PNG, JPG/JPEG and WebP files directly in Icon Studio from its image preview. Raster files open as previews; simple SVG path files are imported into the monochrome icon set. Both plugins must be installed on the same ATLAS server and the file must remain accessible. The handoff uses a short-lived browser-local key and the existing approved File Studio asset endpoint.
