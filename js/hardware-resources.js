/* HARDWARE FILES AND LINKS — edit only the values between quotes below.
   Paths are relative to index.html. Leave a value empty ("") until ready.
   Use forward slashes, keep the exact filename and extension, and keep files
   inside the website folder. An HTTPS download URL can also be used.
   Example: cad: "assets/hardware/PhoneBot.step"
   For anonymous review, check files and any Onshape link for identifying info.
*/
const hardwareResources = {
  hardwareFigure: "assets/hardware.png",        // Existing joint diagram.
  systemFigure: "assets/System_Diagram.png",                            // Optional image; blank keeps the built-in diagram.
  bom: "assets/Phonebot_BOM.xlsx",              // Your existing spreadsheet.
  cad: "",                                     // Example: "assets/hardware/PhoneBot.step"
  stepFiles: "assets/PhoneBot_Assembly_STEP.zip",                               // Example: "assets/hardware/PhoneBot_STEP.zip" or a .step file.
  printableParts: "",                          // Example: "assets/hardware/PrintableParts.zip"
  assemblyTutorial: "",                        // Local video/PDF, e.g. "assets/videos/Assembly.mp4", or an HTTPS tutorial link.
  onshape: ""                                  // Optional full https:// Onshape link.
};

document.querySelectorAll("[data-resource]").forEach((link) => {
  const key = link.dataset.resource;
  const path = (hardwareResources[key] || "").trim();
  // Empty values deliberately have no href: no broken placeholder downloads.
  if (!path) return;
  const isExternal = /^https:\/\//i.test(path);
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) && !isExternal) return;
  if (path.startsWith("//") || (key === "onshape" && !isExternal)) return;
  link.hidden = false;
  link.href = path;
  link.textContent = link.dataset.label;
  link.removeAttribute("aria-disabled");
  if (key === "onshape" || key === "assemblyTutorial" || isExternal) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("download", path.split("/").pop().split("?")[0]);
  }
});

const hardwareImage = document.getElementById("hardware-figure-image");
if (hardwareResources.hardwareFigure.trim()) {
  hardwareImage.src = hardwareResources.hardwareFigure.trim();
}
const systemImage = document.getElementById("system-figure-image");
if (hardwareResources.systemFigure.trim()) {
  systemImage.addEventListener("load", () => {
    systemImage.hidden = false;
    document.getElementById("system-flow").hidden = true;
  });
  systemImage.addEventListener("error", () => {
    systemImage.hidden = true;
    document.getElementById("system-flow").hidden = false;
  });
  systemImage.src = hardwareResources.systemFigure.trim();
}

// A local license acknowledgment precedes configured resource downloads.
// No personal details, submissions, cookies, or acceptance records are collected.
(() => {
  const dialog = document.getElementById("download-license-dialog");
  const form = document.getElementById("download-license-form");
  const agree = document.getElementById("download-license-agree");
  const download = document.getElementById("download-license-continue");
  const resource = document.getElementById("download-license-resource");
  const note = document.querySelector(".hardware-resources .resources-note");
  if (!dialog || !form || !agree || !download || !note) return;
  document.getElementById("download-license-text").innerHTML = note.innerHTML;
  let selectedLink = null;

  document.querySelectorAll("[data-resource]").forEach(link => {
    if (link.dataset.resource === "onshape" || !link.getAttribute("href")) return;
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      event.preventDefault();
      selectedLink = link;
      agree.checked = false;
      download.disabled = true;
      resource.textContent = link.closest(".resource-card").querySelector("h4").textContent;
      dialog.showModal();
    });
  });
  agree.addEventListener("change", () => { download.disabled = !agree.checked; });
  document.getElementById("download-license-cancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    selectedLink = null;
    agree.checked = false;
    download.disabled = true;
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!agree.checked || !selectedLink) return;
    const link = document.createElement("a");
    link.href = selectedLink.href;
    if (selectedLink.hasAttribute("download")) {
      link.setAttribute("download", selectedLink.getAttribute("download"));
    } else if (selectedLink.target) {
      link.target = selectedLink.target;
      link.rel = "noopener noreferrer";
    }
    document.body.append(link);
    link.click();
    link.remove();
    dialog.close();
  });
})();
