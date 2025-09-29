// Elemen DOM
const scoreElement = document.getElementById('score');
const clickerButton = document.getElementById('clicker');
const clicksElement = document.getElementById('clicks');
const cpsElement = document.getElementById('cps');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const startButton = document.getElementById('startButton');
const clickSound = document.getElementById('clickSound');

// Variabel game
let score = 0;
let totalClicks = 0;
let clicksPerSecond = 0;
let clickTimes = [];
let animationId = 0;
let gameTimer = 60;
let timerInterval = null;
let gameActive = false;

// Fungsi memperbarui skor
function updateScore() {
  scoreElement.textContent = score.toLocaleString();
}

// Fungsi memperbarui statistik
function updateStats() {
  clicksElement.textContent = totalClicks.toLocaleString();
  cpsElement.textContent = clicksPerSecond.toFixed(1);
}

// Hitung klik per detik (rata2 10 detik terakhir)
function calculateCPS() {
  const now = Date.now();
  clickTimes = clickTimes.filter(time => now - time < 10000); // 10 detik
  clicksPerSecond = clickTimes.length / 10;
  updateStats();
}

// Animasi +1
function createAnimation() {
  const animation = document.createElement('div');
  animation.className = 'animation';
  animation.textContent = '+1';
  animation.id = 'animation-' + animationId++;

  // Posisi acak di sekitar tombol
  const buttonRect = clickerButton.getBoundingClientRect();
  const offsetX = (Math.random() - 0.5) * 100;
  const offsetY = (Math.random() - 0.5) * 50;

  animation.style.position = 'absolute';
  animation.style.left = (window.scrollX + buttonRect.left + buttonRect.width / 2 + offsetX) + 'px';
  animation.style.top = (window.scrollY + buttonRect.top + buttonRect.height / 2 + offsetY) + 'px';

  document.body.appendChild(animation);

  // Hapus animasi setelah selesai
  setTimeout(() => animation.remove(), 1000);
}

// Efek suara klik
function playClickSound() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.log('Error audio:', err));
  }
}

// Saat klik gambar
function handleClick() {
  if (!gameActive) return;

  score++;
  totalClicks++;

  clickTimes.push(Date.now());

  updateScore();
  calculateCPS();
  createAnimation();
  playClickSound();
}

// Mulai game
function startGame() {
  if (gameActive) return;

  gameActive = true;
  clickerButton.disabled = false;
  startButton.disabled = true;

  // Reset nilai game
  score = 0;
  totalClicks = 0;
  clicksPerSecond = 0;
  clickTimes = [];
  gameTimer = 60;

  updateScore();
  updateStats();
  timerElement.textContent = gameTimer;
  timerElement.classList.remove('timer-warning');

  // Mulai timer
  timerInterval = setInterval(() => {
    gameTimer--;
    timerElement.textContent = gameTimer;

    if (gameTimer <= 10) {
      timerElement.classList.add('timer-warning');
    }

    if (gameTimer <= 0) {
      endGame();
    }
  }, 1000);
}

// Akhiri game
function endGame() {
  gameActive = false;
  clickerButton.disabled = true;
  startButton.disabled = false;
  clearInterval(timerInterval);

  setTimeout(() => {
    alert(
      `Game Over!\nSkor Akhir: ${score}\nTotal Klik: ${totalClicks}\nRata-rata Klik/Detik: ${(totalClicks / 60).toFixed(1)}`
    );
  }, 300);
}

// Reset game
function resetGame() {
  clearInterval(timerInterval);
  gameActive = false;

  score = 0;
  totalClicks = 0;
  clicksPerSecond = 0;
  clickTimes = [];
  gameTimer = 60;

  updateScore();
  updateStats();
  timerElement.textContent = gameTimer;
  timerElement.classList.remove('timer-warning');

  clickerButton.disabled = true;
  startButton.disabled = false;

  document.querySelectorAll('.animation').forEach(a => a.remove());
}

// Event listener
clickerButton.addEventListener('click', handleClick);
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

// Hitung CPS setiap detik
setInterval(calculateCPS, 1000);

// Inisialisasi awal
updateScore();
updateStats();
clickerButton.disabled = true;

if (clickSound) clickSound.load();
