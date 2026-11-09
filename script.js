const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const soundButton = document.querySelector(".sound-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const projectDialog = document.querySelector("#project-dialog");
const lightboxDialog = document.querySelector("#lightbox-dialog");
const lightboxImage = document.querySelector("#lightbox-image");

function setTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === "dark";
  themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  try { localStorage.setItem("portfolio-theme", theme); } catch (_) {}
}
setTheme(root.dataset.theme === "dark" ? "dark" : "light");

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

let soundEnabled = false;
let audioContext;

try {
  soundEnabled = localStorage.getItem("portfolio-sound") === "on";
} catch (_) {}

function updateSoundButton() {
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.setAttribute("aria-label", soundEnabled ? "Turn interface sounds off" : "Turn interface sounds on");
  soundButton.title = soundEnabled ? "Interface sounds on" : "Interface sounds off";
  soundButton.innerHTML = soundEnabled ? '<span aria-hidden="true">♪</span>' : '<span aria-hidden="true">♩</span>';
}

function playClickSound() {
  if (!soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    audioContext ||= new AudioContextClass();
    if (audioContext.state === "suspended") audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(470, now + 0.055);
    gain.gain.setValueAtTime(0.018, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  } catch (_) {}
}

updateSoundButton();
soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem("portfolio-sound", soundEnabled ? "on" : "off"); } catch (_) {}
  updateSoundButton();
  if (soundEnabled) playClickSound();
});

document.addEventListener("click", event => {
  if (event.target.closest(".sound-toggle")) return;
  if (event.target.closest("button, a")) playClickSound();
});

function closeMenu() {
  navLinks.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navLinks.classList.toggle("is-open", open);
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

function openProject() {
  if (typeof projectDialog.showModal === "function") projectDialog.showModal();
}
document.querySelectorAll("[data-open-project]").forEach(button => {
  button.addEventListener("click", openProject);
});
document.querySelector("[data-close-dialog]").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", event => {
  if (event.target === projectDialog) projectDialog.close();
});

function openLightbox(src) {
  lightboxImage.src = src;
  lightboxDialog.showModal();
}
document.querySelectorAll("[data-lightbox]").forEach(button => {
  button.addEventListener("click", () => openLightbox(button.dataset.lightbox));
});
document.querySelector("[data-close-lightbox]").addEventListener("click", () => lightboxDialog.close());
lightboxDialog.addEventListener("click", event => {
  if (event.target === lightboxDialog) lightboxDialog.close();
});
lightboxDialog.addEventListener("close", () => { lightboxImage.src = ""; });

document.querySelector("#year").textContent = new Date().getFullYear();
