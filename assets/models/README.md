# PhoneBot 3D preview

The website uses **PhoneBot-preview.glb**, a reduced, upright presentation copy of `assets/Phonebot_Asm.glb`. The original export has not been changed. Geometry is simplified, so use the original CAD files rather than the preview for manufacturing or measurements.

The optimized preview is about 7.8 MB (original 66.3 MB), with 12 material/mesh batches and approximately 277,000 triangles. The original's Z-up coordinate system is converted to Y-up for the viewer.

**Automatic loading:** When hosted over HTTP/HTTPS, the viewer fetches PhoneBot-preview.glb. When opening index.html directly, it loads the generated companion PhoneBot-preview-data.js, which embeds the same model data in a local script. No file picker or browser-security changes are required. Both paths start when the viewer approaches the viewport.

**Rotation:** The model rotates automatically after loading. Clicking/touching it to drag, or using arrow keys to move it, stops rotation. It stays stopped until the visitor selects Auto rotate. Reset view restores the default camera.

Viewer paths, cameraOrbit and orientation are set at the top of `js/cad-viewer.js`. The model's upright correction is already baked into the preview; leave orientation at zero for this file.

If replacing the model, rebuild both preview files together. Changing the GLB alone will update hosted previews but not the embedded file-preview companion. The companion is base64-encoded GLB data assigned to window.phonebotModelBase64; it is not an external upload or embed. Do not edit it by hand.

Standard, self-contained GLB files with embedded resources are supported. STEP/STL downloads remain separate in Build Resources. No Draco, Meshopt or KTX2 decoder downloads are used.

Library: @google/model-viewer 4.4.0, Apache-2.0. License: assets/vendor/model-viewer-LICENSE.txt.
