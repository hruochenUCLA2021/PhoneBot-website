/* RESULTS VIDEOS - edit the configuration below.
   1. Copy your videos into assets/videos/ (or another folder inside Website).
   2. Put the exact relative path in src, for example "assets/videos/walking.mp4".
   3. Edit each title and description. Leave src: "" to retain a coming-soon slot.
   4. Add or remove demo objects to change the number of video cards.
   Optional poster: path to a thumbnail image. Leave empty to use the video frame.
   Optional aspectRatio: "9 / 16" for portrait clips; "16 / 9" for landscape.
   A full HTTPS video-file URL also works; this does not accept YouTube page URLs.
*/
const resultsVideos = {
  simulation: [
    {
      title: "Walking Simulation",
      description: "Comparison of locomotion policies simulated with and without the sagittal mirror. Enforcing the constraint promotes a more natural gait and a more balanced distribution of joint torques between the legs.",
      src: "assets/videos/Walking_Sim.mp4",
      poster: "",
      aspectRatio: "16 / 9"
    },
    {
      title: "Recovery Simulation",
      description: "Simulation of a recovery policy that returns the robot from a lying position to an upright stance.",
      src: "assets/videos/Standing_Sim.mp4",
      poster: "",
      aspectRatio: "16 / 9"
    }
  ],
  hardware: [
    {
      title: "Walking",
      description: "Hardware locomotion tests demonstrating forward and backward walking and turning under remote control.",
      src: "assets/videos/Walking.mp4",
      poster: "",
      aspectRatio: "16 / 9"
    },
    {
      title: "Recovery",
      description: "Hardware tests demonstrating recovery from a lying position on different contact surfaces, including rough rubber surfaces and smooth tile floors.",
      src: "assets/videos/Recovery.mp4",
      poster: "",
      aspectRatio: "16 / 9"
    }
  ]
};

// Gallery rendering. Edit only the configuration above to add your videos.
function allowedVideoPath(value) {
  const path = String(value || "").trim();
  if (!path || path.startsWith("//")) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) && !/^https:\/\//i.test(path)) return "";
  return path;
}

Object.entries(resultsVideos).forEach(([group, demos]) => {
  const grid = document.getElementById(group + "-videos");
  if (!grid) return;
  demos.forEach((demo, index) => {
    const card = document.createElement("article");
    card.className = "result-video-card";
    const titleId = group + "-demo-" + (index + 1);
    card.setAttribute("aria-labelledby", titleId);

    const media = document.createElement("div");
    media.className = "result-video-media";
    if (/^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(demo.aspectRatio || "")) {
      media.style.aspectRatio = demo.aspectRatio;
    }
    const placeholder = document.createElement("div");
    placeholder.className = "result-video-placeholder";
    const icon = document.createElement("span");
    icon.className = "video-placeholder-icon";
    icon.setAttribute("aria-hidden", "true");
    const status = document.createElement("span");
    status.className = "video-placeholder-status";
    status.textContent = "Video coming soon";
    placeholder.append(icon, status);
    media.append(placeholder);

    const source = allowedVideoPath(demo.src);
    if (source) {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.hidden = true;
      video.setAttribute("aria-label", demo.title || "Result video");
      const poster = allowedVideoPath(demo.poster);
      if (poster) video.poster = poster;
      status.textContent = "Loading video";
      video.addEventListener("loadedmetadata", () => {
        placeholder.hidden = true;
        video.hidden = false;
      });
      video.addEventListener("error", () => {
        video.hidden = true;
        placeholder.hidden = false;
        status.textContent = "Video unavailable";
      });
      video.src = source;
      media.append(video);
    }

    const copy = document.createElement("div");
    copy.className = "result-video-copy";
    const title = document.createElement("h4");
    title.id = titleId;
    title.textContent = demo.title || "Demo " + (index + 1);
    const description = document.createElement("p");
    description.textContent = demo.description || "";
    copy.append(title, description);
    card.append(media, copy);
    grid.append(card);
  });
});
