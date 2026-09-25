# ATLAS Plugin Template

Starter repository for publishing one ATLAS plugin through the ATLAS Plugin Hub.
It contains a working example page, plugin manifest, repository catalog, install
package generator, artwork placeholders, validation and a GitHub Actions check.

## Quick start

1. In GitHub, choose **Use this template** to create a repository for your plugin.
2. Clone your new repository and edit `plugins/atlas-plugin/atlas-plugin.json`.
   Set a unique ID such as `atlas.plugin.lights`, a display name, version,
   description and only the capabilities the plugin actually needs.
3. Build and validate the package:

   ```sh
   npm run build
   npm run check
   ```

4. Update `repository.json` with your repository name, homepage and the same
   plugin ID, name, version and description as the manifest.
5. Replace the example app in `plugins/atlas-plugin/`, and replace `icon.svg`,
   `logo.svg` and `preview.svg` with artwork for your plugin.
6. Enable GitHub Pages with **Deploy from a branch** and the `main` branch.
   The repository catalog is then available at
   `https://raw.githubusercontent.com/<owner>/<repo>/main/repository.json`.
7. Add that URL in ATLAS Administration to install and test your plugin.

After every plugin version change, run `npm run build` so the install package
and repository catalog stay in sync. The validation workflow checks this on
every push and pull request.

## Template contents

```text
repository.json
install.html
plugins/atlas-plugin/
  atlas-plugin.json
  atlas-plugin.atlas-plugin.json  # generated
  README.md
  index.html
  styles.css
  app.js
  icon.svg
  logo.svg
  preview.svg
scripts/
  build-package.mjs
  validate.mjs
```

The example plugin is intentionally small and does not request privileged ATLAS
capabilities. Add capabilities only when the plugin needs and implements them.
The package format stores plugin files as text; large binary assets should be
hosted separately and referenced by URL.

## Release checklist

- Keep the plugin ID stable after publication.
- Bump the plugin version for every published change.
- Regenerate the package with `npm run build`.
- Check that `repository.json`, `atlas-plugin.json` and the generated package
  show the same ID and version.
- Review permissions and external requests before listing capabilities.
- Provide a README, function-specific icon, ATLAS-branded logo and a 16:9 preview.

See [the ATLAS plugin repository format](https://github.com/rockbaer2007/atlas/blob/main/docs/project/specifications/PLUGIN_REPOSITORY_FORMAT.md)
for the catalog and package contracts.
