# ATLAS Icon Studio Plugin Repository

An external ATLAS plugin repository for previewing SVG/PNG/JPEG artwork and creating Home Assistant custom icon-set resources. The included vector icon set registers the `atlas:` namespace, with `atlas:home` as its example.

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

The builder synchronizes `repository.json` and the generated install package from the plugin manifest. Run it after each version change.

## Home Assistant `atlas:` icon set

The plugin exports `atlas-iconset.js`. Copy it to `/config/www/atlas-iconset.js`, add `/local/atlas-iconset.js` as a JavaScript module resource in **Settings → Dashboards → Resources**, and reload the Home Assistant frontend. The included sample can then be referenced as `atlas:home`.

This first version supports SVG icons made from simple path data. PNG and JPEG are previewed as normal images and remain useful as dashboard image assets, but they cannot be returned by Home Assistant's custom icon-set API as vector icons. See [`plugins/icon-studio/README.md`](plugins/icon-studio/README.md) for setup and format limits.
