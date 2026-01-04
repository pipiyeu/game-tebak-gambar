// =========================
// DATA GAMBAR
// =========================
const levels = [
  [
    { src: "TEBAK GAMBAR lv 1/a siluet/1.png", srcAsli: "TEBAK GAMBAR lv 1/asli/Delima.jpg", jawaban: "delima" },
    { src: "TEBAK GAMBAR lv 1/a siluet/2.png", srcAsli: "TEBAK GAMBAR lv 1/asli/Rambutan.jpg", jawaban: "rambutan" },
    { src: "TEBAK GAMBAR lv 1/a siluet/3.png", srcAsli: "TEBAK GAMBAR lv 1/asli/Durian.jpg", jawaban: "durian" },
    { src: "TEBAK GAMBAR lv 1/a siluet/4.png", srcAsli: "TEBAK GAMBAR lv 1/asli/Semangka.jpg", jawaban: "semangka" },
    { src: "TEBAK GAMBAR lv 1/a siluet/5.png", srcAsli: "TEBAK GAMBAR lv 1/asli/Sirsak.jpg", jawaban: "sirsak" }
  ],
  [
    { src: "TEBAK GAMBAR lv 2/a siluet/1.png", srcAsli: "TEBAK GAMBAR lv 2/asli/CACING.jpg", jawaban: "cacing" },
    { src: "TEBAK GAMBAR lv 2/a siluet/2.png", srcAsli: "TEBAK GAMBAR lv 2/asli/KELOMANG.jpg", jawaban: "kelomang" },
    { src: "TEBAK GAMBAR lv 2/a siluet/3.png", srcAsli: "TEBAK GAMBAR lv 2/asli/MAMMOTH.jpg", jawaban: "mammoth" },
    { src: "TEBAK GAMBAR lv 2/a siluet/4.png", srcAsli: "TEBAK GAMBAR lv 2/asli/SERIGALA.jpg", jawaban: "serigala" },
    { src: "TEBAK GAMBAR lv 2/a siluet/5.png", srcAsli: "TEBAK GAMBAR lv 2/asli/TOKEK.jpeg", jawaban: "tokek" }
  ],
  [
    { src: "TEBAK GAMBAR lv 3/a siluet/1.png", srcAsli: "TEBAK GAMBAR lv 3/asli/CLEANING SERVICE.jpg", jawaban: "cleaning service" },
    { src: "TEBAK GAMBAR lv 3/a siluet/2.png", srcAsli: "TEBAK GAMBAR lv 3/asli/DOKTER.jpg", jawaban: "dokter" },
    { src: "TEBAK GAMBAR lv 3/a siluet/3.png", srcAsli: "TEBAK GAMBAR lv 3/asli/KOKI.jpg", jawaban: "koki" },
    { src: "TEBAK GAMBAR lv 3/a siluet/4.png", srcAsli: "TEBAK GAMBAR lv 3/asli/PENGAJAR.jpg", jawaban: "pengajar" },
    { src: "TEBAK GAMBAR lv 3/a siluet/5.png", srcAsli: "TEBAK GAMBAR lv 3/asli/PILOT.jpg", jawaban: "pilot" }
  ]
];

// =========================
// DOM
// =========================
const introPage = document.getElementById("intro-page");
const gamePage = document.getElementById("game-page");
const btnMulai = document.getElementById("btnMulai");
const btnJawab = document.getElementById("btnJawab");
const btnPause = document.getElementById("btnPause");
const btnResume = document.getElementById("btnResume");
const btnHome = document.getElementById("btnHome");
const btnOK = document.getElementById("btnOK");

const gambar = document.getElementById("gambar");
const input = document.getElementById("jawaban");
const timerText = document.getElementById("timer-text");
const nyawaInfo = document.getElementById("nyawa-info");
const judulLevel = document.getElementById("judul-level");

const popup = document.getElementById("popup");
const popupJudul = document.getElementById("popup-judul");
const popupPesan = document.getElementById("popup-pesan");
const popupGambar = document.getElementById("popup-gambar");

const countdownEl = document.getElementById("countdown");

// =========================
// STATE
// =========================
let levelIndex = 0;
let soalIndex = 0;
let nyawa = 3;
let salah = 0;
let waktu = 10;
let timer = null;
let paused = false;

// =========================
// COUNTDOWN
// =========================
function startCountdown(callback) {
  let count = 3;

  document.body.classList.add("countdown-active");

  countdownEl.textContent = count;
  countdownEl.classList.remove("hidden");

  const cd = setInterval(() => {
    count--;

    if (count > 0) {
      countdownEl.textContent = count;
    } 
    else if (count === 0) {
      countdownEl.textContent = "GO!";
    } 
    else {
      clearInterval(cd);

      countdownEl.classList.add("hidden");
      document.body.classList.remove("countdown-active");

      callback && callback();
    }
  }, 1000);
}


// =========================
// START GAME
// =========================
btnMulai.onclick = () => {
  // pastikan countdown SELALU mati dulu
  countdownEl.classList.add("hidden");

  introPage.classList.remove("active");
  gamePage.classList.add("active");

  startCountdown(() => {
    startGame(); // ⬅️ BARU JALAN DI SINI
  });
}

function startGame() {
  levelIndex = 0;
  soalIndex = 0;
  nyawa = 3;
  salah = 0;
  updateNyawa();
  loadSoal();
}

// =========================
// LOAD SOAL
// =========================
function loadSoal() {
  clearInterval(timer);

  const data = levels[levelIndex][soalIndex];
  judulLevel.textContent = `Level ${levelIndex + 1}`;
  gambar.src = data.src;

  input.value = "";
  input.disabled = false;
  btnJawab.disabled = false;

  paused = false;
  waktu = 10;        // ⬅️ RESET DI SINI SAJA
  startTimer();
}


// =========================
// TIMER
// =========================
function startTimer() {
  timerText.textContent = `⏱️ ${waktu}`;

  timer = setInterval(() => {
    if (paused) return;

    waktu--;
    timerText.textContent = `⏱️ ${waktu}`;

    if (waktu <= 0) {
      clearInterval(timer);
      waktuHabis();
    }
  }, 1000);
}

// =========================
// WAKTU HABIS
// =========================
function waktuHabis() {
  paused = true;
  clearInterval(timer);


  showPopup("⏰ Waktu Habis", "Tekan OK untuk lanjut", true);

  btnOK.onclick = () => {
    closePopup();
    paused = false;
    waktu = 10;
    startTimer();

    input.value = "";
    input.focus();
  };
}



// =========================
// JAWAB
// =========================
// =====================
// CEK JAWABAN
// =====================
btnJawab.onclick = () => {
  const user = input.value.trim().toLowerCase();
  const benar = levels[levelIndex][soalIndex].jawaban;

  if (!user) return;

  clearInterval(timer);
  paused = true;

  // =====================
  // JAWABAN BENAR
  // =====================
  if (user === benar) {
  clearInterval(timer);
  paused = true;

  popupGambar.classList.remove("hidden");
  popupGambar.style.display = "block";   // 🔥 PAKSA TAMPIL
  popupGambar.src = levels[levelIndex][soalIndex].srcAsli;


  showPopup("✅ Benar", "Jawaban tepat!");

  // 🔥 WAJIB
  btnOK.classList.remove("hidden");
  btnResume.classList.add("hidden");
  btnHome.classList.add("hidden");

  btnOK.onclick = () => {
    popupGambar.classList.add("hidden");
    closePopup();

    salah = 0;
    input.value = "";
    input.blur();

    paused = false;
    nextSoal();
    };
  }


  // =====================
  // JAWABAN SALAH
  // =====================
  else {
  clearInterval(timer);
  paused = true;

  salah++;

  // 🔥 hapus jawaban langsung
  input.value = "";
  input.blur();

  // =====================
  // NYAWA BERKURANG
  // =====================
  if (salah >= 2) {
    nyawa--;
    salah = 0;
    updateNyawa();

    if (nyawa <= 0) {
      showPopup("💀 Game Over", "Nyawa habis");
      btnOK.classList.remove("hidden");
      btnResume.classList.add("hidden");
      btnHome.classList.add("hidden");

      btnOK.onclick = backToHome;
      return;
    }

    showPopup("💔 Salah", "Nyawa berkurang!");
  } 
  // =====================
  // SALAH BIASA
  // =====================
  else {
    showPopup("❌ Salah", "Coba lagi");
  }

  // 🔥 PAKSA tombol OK muncul
  btnOK.classList.remove("hidden");
  btnResume.classList.add("hidden");
  btnHome.classList.add("hidden");

  // =====================
  // TEKAN OK → ULANG TIMER, SOAL TETAP
  // =====================
  btnOK.onclick = () => {
    closePopup();

    paused = false;
    waktu = 10;
    timerText.textContent = `⏱️ ${waktu}`;
    startTimer();

    input.value = "";
    input.focus();
  };
}
}

function showPopupImage(src) {
  popupGambar.src = src;
  popupGambar.classList.remove("hidden");
  popupGambar.style.display = "block";
}

// =========================
// NEXT SOAL / LEVEL
// =========================
function nextSoal() {
  // popupGambar.classList.add("hidden");
  soalIndex++;

  // =========================
  // MASIH ADA SOAL
  // =========================
  if (soalIndex < levels[levelIndex].length) {
    loadSoal();
    return;
  }

  // =========================
  // SOAL HABIS → PINDAH LEVEL
  // =========================
  levelIndex++;
  soalIndex = 0;

  // =========================
  // MASIH ADA LEVEL
  // =========================
  if (levelIndex < levels.length) {
    paused = true;
    clearInterval(timer);

    showPopup(
      "🎉 Level Selesai",
      `Siap masuk Level ${levelIndex + 1}?`,
      true
    );

    btnOK.onclick = () => {
      closePopup();
      paused = false;
      loadSoal();
    };
  }
  // =========================
  // GAME SELESAI
  // =========================
  else {
    paused = true;
    clearInterval(timer);

    showPopup(
      "🏆 Game Selesai",
      "Selamat! Kamu telah menyelesaikan semua level 🎉",
      true
    );

    btnOK.classList.remove("hidden");
    btnResume.classList.add("hidden");
    btnHome.classList.add("hidden");

    btnOK.onclick = () => {
      backToHome();
    };
  }
}





// =========================
// PAUSE / RESUME
// =========================
btnPause.onclick = () => {
  paused = true;
  clearInterval(timer);
  showPopup("⏸ Pause", "Game dijeda");
  btnResume.classList.remove("hidden");
  btnHome.classList.remove("hidden");
};

btnResume.onclick = () => {
  closePopup();
  startCountdown(() => {
    paused = false;
    startTimer();
  });
};

btnHome.onclick = backToHome;

// =========================
// POPUP
// =========================
function showPopup(judul, pesan, withOK = false) {
  popup.classList.remove("hidden");
  popupJudul.textContent = judul;
  popupPesan.textContent = pesan;

  if (withOK) {
    btnOK.classList.remove("hidden");
  } else {
    btnOK.classList.add("hidden");
  }

  btnResume.classList.add("hidden");
  btnHome.classList.add("hidden");
}




function closePopup() {
  popup.classList.add("hidden");
  popupGambar.classList.add("hidden");
}

// =========================
// UTIL
// =========================
function updateNyawa() {
  nyawaInfo.textContent = "❤️".repeat(nyawa) + "🖤".repeat(3 - nyawa);
}

function backToHome() {
  clearInterval(timer);
  popup.classList.add("hidden");
  gamePage.classList.remove("active");
  introPage.classList.add("active");
}


// =========================
// BACKGROUND PARTICLES
// =========================
const emojis = ["🍎","🐘","👨‍⚕️","🍌","🦁","👨‍🍳"];
const bg = document.getElementById("bg-particles");

let particleInterval = null;

function createParticle() {
  const p = document.createElement("div");
  p.className = "particle";
  p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = Math.random() * 25 + 30 + "px";
  p.style.animationDuration = Math.random() * 6 + 6 + "s";

  bg.appendChild(p);

  p.addEventListener("animationend", () => {
    p.remove();
  });
}

function startParticles() {
  if (particleInterval) return;
  particleInterval = setInterval(createParticle, 900);
}

function stopParticles() {
  clearInterval(particleInterval);
  particleInterval = null;
}

// mulai otomatis
startParticles();

// pause saat tab tidak aktif
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopParticles();
  } else {
    startParticles();
  }
});

// pastikan countdown TIDAK PERNAH muncul saat load
window.addEventListener("load", () => {
  countdownEl.classList.add("hidden");
});


