# Icon Studio 0.1.17 recovery verification

2026-10-16. Isolated qualification only. Pi 5 and Proxmox were neither queried
nor changed. ATLAS App stays0.1.312. No real Home Assistant connection.

## Finding and correction

- The drawing text pointer handler called validateDrawingShape without importing
  it. Actual Chrome text creation on0.1.16 reproduced ReferenceError before any
  drawing write. Import the existing validator; no storage/schema change.
- Release0.1.17 consistently in manifest, catalog and generated package; catalog
  revision6->7. Extend the existing browser regression with actual text creation
  and undo. Fifteen Node tests, package validation and syntax check pass.
- Browser behavior was verified through the connected Chrome UI, including text
  creation before/after recovery, duplicate, undo, reload and actual downloads.
  The extended standalone Playwright runner was not separately executed.

## Backups and test setup

- Before edits, retain Git bundles of this repo, ATLAS and public docs; retain
  actual original16 package, private fixture and original server backup outside
  Git under source/backups/icon-studio-recovery-isolated-20261016.
- Use a unique loopback App origin, private config/plugin/history/trash paths,
  actual Administration/Editor, pinned synthetic installation identity and no
  user HA tokens. Keep initial failure fixture01; successful fixture02 uses the
  same own origin to retain its browser collection. No production data is used.
- Import128 synthetic icons through the UI; with3reference icons the collection
  contains131 entries. Export JSON before16->17 and confirm exact preservation.
- After the fix, create2text shapes including umlaut/XML characters, duplicate,
  save SVG and reload. Save collection JSON, iconset JS and drawing SVG on PC.
  Stop/archive/list/restart the full server fixture before package replacement.
  Retain both pre-fix16 and pre-recovery17 server archives.

## Recovery and preservation

- Real guarded backend compatibility preview/install17->16 retains17 snapshot.
  Verify all12older package assets exactly. In Administration, preview17, cancel,
  reopen and restore17. Verify all12current assets exactly; restart the App.
- Compare original config/binary/www iconset, sibling File Studio52, complete
  named project, installation identity, original history version and trash SVG.
  Shared metadata/repositories/activation match except version/revision counters.
- Reload Icon Studio on the same origin/profile. FR language and drawing DOM
  survive. Re-export collection/iconset/drawing: all three files are byte-identical
  to before replacement. All131 definitions and generated iconset semantics match;
  both text shapes retain positions, color and correctly escaped original text.
- Create a third text after recovery, undo and reload; original drawing DOM is
  exact again. All test services stop, owned test tabs close and evidence remains.
- Chrome's download-event wait timed out although its download completed; verify
  the actual new files on disk and copy them without any warning bypass. An
  initial hidden-input click reached the adjacent HA-read button and was safely
  refused by scoped-path rules; use the visible associated label for import.

## Limits

This qualifies package rollback and same-origin browser-data preservation, not
automatic recovery of deleted browser storage or transfer to another address or
profile. Collection JSON/iconset JS do not include the colored drawing. SVG is
an exported image, not a complete editable-draft/undo backup. Tool selection,
search and undo/redo are session state. No native HA/ARM64 test, real repository
download, full HA restore or plugin data-format migration is claimed.
