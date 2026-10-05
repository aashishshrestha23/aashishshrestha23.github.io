const themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    playClickSound();
});
// Futuristic UI click sound
function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.08
    );

    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.08
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
}
