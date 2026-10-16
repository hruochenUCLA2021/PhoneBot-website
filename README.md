# PhoneBot supplementary website

Static HTML and CSS. Open `index.html` in a browser, then refresh after saving edits. No build or package installation is required.

## Editing

- `index.html`: title, overview text, navigation, and figure caption.
- `css/style.css`: typography, colors, spacing, and responsive layout.
- `assets/hardware.png`: hardware figure. Keep its path or update the HTML reference.

The current page only presents the supplied description and hardware image. Add paper downloads, experiments, and local video files when the corresponding anonymous materials are available; avoid empty links or invented results.

## Anonymous review

The rendered page uses anonymous authors, local assets and bundled fonts. It has no outgoing links, third-party embeds, analytics, or author/affiliation metadata. Search indexing is discouraged with a robots meta tag; this is not access control.

Before sharing review material:

- Use an anonymous hosting address or the review system's supplementary upload. The existing GitHub repository owner, its history, and any publicly associated project/domain can identify the authors even when the page itself omits names.
- Check future PDFs, images, CAD files, and videos for names, affiliations, logos, faces, voices, identifying backgrounds, and embedded metadata.
- Confirm the venue's policy on project names and previously public material. PhoneBot remains in the paper title.
- Do not distribute the `.git` folder with supplementary files.

`CNAME` is the existing public deployment configuration. It is not linked by the page and has not been changed. Do not use an identifying public deployment for anonymous review.

Local edits do not publish the website. Pushing to a branch configured for GitHub Pages may deploy them.

## Adding the bill of materials

Put the spreadsheet in the website folder and set its relative path in the `bom` entry of `js/hardware-resources.js`. The existing file is `assets/Phonebot_BOM.xlsx`. See Hardware section: file configuration below for all resources.

## Typography

Noto Sans is used for body text and section headings; Google Sans is used for the main paper title. Variable TrueType files and their SIL Open Font Licenses are stored in `assets/fonts/`. Font sources: the official `google/fonts` repository, `ofl/notosans` and `ofl/googlesans`. The fonts load locally through `@font-face` rules in `css/style.css`, without external font requests.

## Hardware section: file configuration

Edit **`js/hardware-resources.js`**, the `hardwareResources` object at the top. This is the single place to choose the Hardware section's images, downloads, and optional Onshape URL. Do not edit the generated resource buttons in HTML to change their targets.

| Setting | Purpose | Current value or example |
|---|---|---|
| `hardwareFigure` | Joint figure | `assets/hardware.png` |
| `systemFigure` | Optional replacement for the built-in system diagram | `assets/hardware/system-overview.png` |
| `bom` | BOM download | `assets/Phonebot_BOM.xlsx` |
| `cad` | CAD download | `assets/hardware/PhoneBot.step` |
| `stepFiles` | STEP file or ZIP download | `assets/hardware/PhoneBot_STEP.zip` |
| `printableParts` | Printable files ZIP | `assets/hardware/PrintableParts.zip` |
| `onshape` | Optional interactive CAD | Full `https://` sharing URL |

An empty string (`""`) leaves a download unavailable. The built-in system diagram remains visible when `systemFigure` is empty or its image cannot load. Only set a download path after adding that file; these configured paths are not automatically checked for file existence in the browser.

Put future files in **`assets/hardware/`**, or choose another folder within the website and set its relative path. Use forward slashes. Preserve the current spreadsheet in `assets/Phonebot_BOM.xlsx` unless you also change `bom`.

You can use an HTTPS URL for a remotely hosted file. Remote links open in a new tab; the host determines whether they preview or download. Nothing in this configuration uploads or publishes files. Check that third-party sharing is compatible with anonymous review before adding a link.

Text editing locations in `index.html`:

- Hardware description: search `HARDWARE DESCRIPTION START`.
- Specifications: search `class="hardware-specs"`.
- Captions: edit each `<figcaption>`; update the associated `alt` text if you replace a figure.
- Resource headings and descriptions: search `class="hardware-resources"`.

After editing files or configuration, save and refresh the browser with Ctrl+Shift+R. The JavaScript is local and does not require a server or build step.

## Results section: simulation and hardware videos

The Results section follows Hardware and has two galleries: Simulation results and Hardware results. Each has two video slots; no source videos have been selected or uploaded.

### Add videos and individual descriptions

1. Copy the chosen videos into `assets/videos/` inside the Website folder. H.264 MP4 is recommended for browser playback.
2. Open **`js/results-videos.js`**. In the `resultsVideos` object, find the `simulation` or `hardware` array.
3. Set an entry's `src` to its relative file path, for example `src: "assets/videos/walking.mp4"`.
4. Change that entry's `title` and `description` to your text. Optional `poster` is a thumbnail image path. `aspectRatio: "9 / 16"` suits portrait recordings; `"16 / 9"` suits landscape video. Videos are contained within the frame, never cropped.
5. Add more demo objects to an array for additional videos, or remove objects to reduce the number of slots. An empty `src` shows a coming-soon panel without making a missing-file request. No autoplay is used; controls appear when video metadata loads.

For a video file elsewhere in the Paper folder, copy it into Website/assets/videos first; do not use an absolute Windows file path as the website URL. Hosted HTTPS links must point directly to a playable video file, not a YouTube page.

### Edit section descriptions

In `index.html`, search for `RESULTS INTRO`, `SIMULATION DESCRIPTION`, or `HARDWARE RESULTS DESCRIPTION`. Edit the associated paragraph, and add more `<p class="results-description">...</p>` elements if needed. Individual video captions are in `js/results-videos.js`.

Save and refresh with Ctrl+Shift+R. This is a local change only; video files are not published automatically.

## Interactive 3D viewer

The viewer uses `assets/models/PhoneBot-preview.glb`, an optimized upright copy of the original `assets/Phonebot_Asm.glb`. Both hosted pages and direct-file previews load automatically when the viewer becomes visible. The local companion `assets/models/PhoneBot-preview-data.js` embeds the same model for file previews. Auto-rotation starts after load and stops when the visitor drags the model. See `assets/models/README.md` for details and model replacement instructions.
