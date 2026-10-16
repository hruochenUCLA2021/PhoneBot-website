/* PHONEBOT 3D VIEWER
   Optimized web model: assets/models/PhoneBot-preview.glb.
   Original CAD export is preserved at assets/PhoneBot_Asm.glb.
   Direct-file previews use a generated, embedded model-data script.
   Export the full assembly with embedded materials/textures and no Draco,
   Meshopt, or KTX2 compression. STEP and STL files are downloads, not viewer inputs.
*/
const cadViewerConfig = {
  modelPath: "assets/models/PhoneBot-preview.glb?v=battery-yellow-1",
  embeddedModelPath: "assets/models/PhoneBot-preview-data.js?v=battery-yellow-1",
  cameraOrbit: "35deg 75deg 105%",
  orientation: "0deg 0deg 0deg"
};

// Validate the GLB before loading it: the review page must not fetch remote textures.
function readPhoneBotGlb(buffer) {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 20) {
    throw new Error("Please choose a valid GLB model.");
  }
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2 ||
      view.getUint32(8, true) !== buffer.byteLength || view.getUint32(16, true) !== 0x4e4f534a) {
    throw new Error("Please use a GLB file exported in glTF 2.0 format.");
  }
  const jsonLength = view.getUint32(12, true);
  if (20 + jsonLength > buffer.byteLength) throw new Error("The model file is incomplete.");
  const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength)).replace(/\0+$/, ""));
  const extensions = [...(json.extensionsUsed || []), ...(json.extensionsRequired || [])];
  if (extensions.some(name => ["KHR_draco_mesh_compression", "EXT_meshopt_compression", "KHR_texture_basisu"].includes(name))) {
    throw new Error("Please export a GLB without Draco, Meshopt, or KTX2 compression.");
  }
  if ([...(json.buffers || []), ...(json.images || [])].some(item => item.uri && !item.uri.startsWith("data:"))) {
    throw new Error("Please export one GLB with all geometry and textures embedded.");
  }
  return json;
}

(() => {
  const viewer = document.getElementById("phonebot-model");
  if (!viewer) return;
  const overlay = document.getElementById("cad-viewer-placeholder");
  const status = document.getElementById("cad-viewer-status");
  const isFilePreview = location.protocol === "file:";
  let currentUrl = "";
  let request;
  let generation = 0;
  let userInteracted = false;
  let isReady = false;
  let resumeTimer;
  const activePointers = new Set();

  function setRotation(enabled) {
    viewer.autoRotate = enabled;
  }

  function showStatus(message, state = "empty") {
    status.textContent = message;
    isReady = state === "ready";
    overlay.hidden = isReady;
    if (state !== "ready") {
      clearTimeout(resumeTimer);
      setRotation(false);
    }
  }

  async function loadBuffer(buffer, token) {
    if (token !== generation) return;
    readPhoneBotGlb(buffer);
    if (!window.customElements || !customElements.get("model-viewer")) {
      throw new Error("The 3D viewer could not start. Please reload the page in a modern browser.");
    }
    const nextUrl = URL.createObjectURL(new Blob([buffer], { type: "model/gltf-binary" }));
    const oldUrl = currentUrl;
    currentUrl = nextUrl;
    viewer.setAttribute("orientation", cadViewerConfig.orientation);
    viewer.setAttribute("camera-orbit", cadViewerConfig.cameraOrbit);
    userInteracted = false;
    viewer.src = nextUrl;
    if (oldUrl) URL.revokeObjectURL(oldUrl);
  }

  async function loadEmbeddedModel() {
    const token = ++generation;
    showStatus("Loading the 3D model…", "loading");
    try {
      if (!window.phonebotModelBase64) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = cadViewerConfig.embeddedModelPath;
          script.onload = resolve;
          script.onerror = () => {
            script.remove();
            reject(new Error("The local model preview is unavailable. Please reload the page."));
          };
          document.head.append(script);
        });
      }
      const binary = atob(window.phonebotModelBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      await loadBuffer(bytes.buffer, token);
    } catch (error) {
      if (token === generation) showStatus(error.message);
    }
  }

  async function loadHostedModel() {
    const token = ++generation;
    if (request) request.abort();
    request = new AbortController();
    showStatus("Loading the 3D model…", "loading");
    try {
      const response = await fetch(cadViewerConfig.modelPath, { signal: request.signal, credentials: "same-origin" });
      if (response.status === 404) {
        showStatus("3D model coming soon.");
        return;
      }
      if (!response.ok) throw new Error("The 3D model is temporarily unavailable.");
      await loadBuffer(await response.arrayBuffer(), token);
    } catch (error) {
      if (error.name !== "AbortError" && token === generation) showStatus(error.message);
    }
  }

  // Presentation adjustments only: retain the original CAD file and part colors.
  function softenBrightMaterials() {
    for (const material of viewer.model?.materials || []) {
      const pbr = material.pbrMetallicRoughness;
      if (!pbr || pbr.metallicFactor > 0.1) continue;
      const color = pbr.baseColorFactor;
      if (Math.min(...color.slice(0, 3)) < 0.45) continue;
      // Leave room for highlights on white plastic instead of flattening to white.
      const peak = Math.max(...color.slice(0, 3));
      if (peak > 0.8) {
        const scale = 0.8 / peak;
        pbr.setBaseColorFactor([color[0] * scale, color[1] * scale, color[2] * scale, color[3]]);
      }
      pbr.setRoughnessFactor(Math.max(pbr.roughnessFactor, 0.55));
    }
  }

  viewer.addEventListener("load", () => {
    softenBrightMaterials();
    showStatus("", "ready");
    if (!userInteracted) setRotation(true);
  });
  function pauseRotation() {
    clearTimeout(resumeTimer);
    if (!isReady) return;
    userInteracted = true;
    setRotation(false);
  }
  function scheduleRotation() {
    clearTimeout(resumeTimer);
    if (!isReady || activePointers.size) return;
    resumeTimer = setTimeout(() => {
      if (isReady && !activePointers.size) setRotation(true);
    }, 2000);
  }
  viewer.addEventListener("pointerdown", event => {
    activePointers.add(event.pointerId);
    pauseRotation();
  });
  function finishPointer(event) {
    if (activePointers.delete(event.pointerId)) scheduleRotation();
  }
  window.addEventListener("pointerup", finishPointer);
  window.addEventListener("pointercancel", finishPointer);
  window.addEventListener("blur", () => {
    activePointers.clear();
    scheduleRotation();
  });
  viewer.addEventListener("wheel", () => {
    pauseRotation();
    scheduleRotation();
  }, { passive: true });
  viewer.addEventListener("keydown", event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      pauseRotation();
      scheduleRotation();
    }
  });
  viewer.addEventListener("camera-change", event => {
    if (event.detail?.source === "user-interaction") {
      pauseRotation();
      scheduleRotation();
    }
  });
  viewer.addEventListener("error", () => showStatus("The model could not be displayed. Please use a standard, self-contained GLB."));
  const startLoading = isFilePreview ? loadEmbeddedModel : loadHostedModel;
  window.addEventListener("pagehide", () => { clearTimeout(resumeTimer); if (currentUrl) URL.revokeObjectURL(currentUrl); });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        startLoading();
      }
    }, { rootMargin: "150px" });
    observer.observe(viewer);
  } else {
    startLoading();
  }
})();
