const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
const benchmark = new BenchmarkOverlay();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let showBenchmark = true;

const layers = [
  { count: 800, speed: 0.01, radius: 0.3, stars: [] },
  { count: 600, speed: 0.04, radius: 0.7, stars: [] },
  { count: 300, speed: 0.1, radius: 1.2, stars: [] },
];

const nebulaLayers = [];
const starColors = ["#FFFFFF", "#FFE9C4", "#D4FBFF", "#FFD1DC"];
const nebulaCanvases = [];
let frameCount = 0;

// Shooting star pool
const MAX_SHOOTING_STARS = 20;
const shootingStarPool = [];
for (let i = 0; i < MAX_SHOOTING_STARS; i++) {
  shootingStarPool.push({ active: false });
}

function hexToRGB(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

function generateStarsAndNebula() {
  // Stars
  layers.forEach((layer) => {
    layer.stars = [];
    for (let i = 0; i < layer.count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * layer.radius + 0.2;
      const alpha = Math.random() * 0.8 + 0.2;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      layer.stars.push({
        x,
        y,
        radius,
        alpha,
        color,
        dx: (Math.random() - 0.5) * layer.speed,
        dy: (Math.random() - 0.5) * layer.speed,
      });
    }
  });
}

generateStarsAndNebula();

function livelyPropertyListener(name, value) {
  if (name === "starDensity") {
    value = Number(value);

    layers[0].count = Math.floor(value * 0.405);
    layers[1].count = Math.floor(value * 0.357);
    layers[2].count = Math.floor(value * 0.238);

    generateStarsAndNebula();
  }

  // Handle music volume toggle
  if (name === "muteMusic") {
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic) {
      bgMusic.muted = value;
    }
  }

  if (name === "showBenchmark") {
    showBenchmark = value;
  }

  if (name === "benchmarkPosition") {
    const positions = ["Top-Right", "Top-Left", "Bottom-Right", "Bottom-Left"];
    benchmark.position = positions[value] ?? "Top-Right";
  }

  // Handle Color Dropdown changes (Expanded with Magenta, Orange, and Deep Pink)
  if (name === "benchmarkTextColor") {
    const colors = [
      "red", "lime", "cyan", "white", "yellow",
      "magenta", "orange", "deeppink", "hotpink", "gold",
      "chartreuse", "springgreen", "deepskyblue", "lavender", "plum",
      "aquamarine", "mediumpurple", "crimson"
    ];
    benchmark.textColor = colors[value] ?? "red";
  }

  if (name === "benchmarkBgVisibility") {
    const bgStyles = ["rgba(0,0,0,0.5)", "rgba(0,0,0,1)", "transparent"];
    benchmark.bgColor = bgStyles[value] ?? "rgba(0,0,0,0.5)";
  }
}

let lastWidth = canvas.width;
let lastHeight = canvas.height;

function resize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  const xRatio = newWidth / lastWidth;
  const yRatio = newHeight / lastHeight;

  canvas.width = newWidth;
  canvas.height = newHeight;

  layers.forEach((layer) =>
    layer.stars.forEach((star) => {
      star.x *= xRatio;
      star.y *= yRatio;
    }),
  );
  nebulaLayers.forEach((n) => {
    n.x *= xRatio;
    n.y *= yRatio;
  });
  orbs.forEach((o) => {
    o.x *= xRatio;
    o.y *= yRatio;
  });

  lastWidth = newWidth;
  lastHeight = newHeight;

  generateStarsAndNebula();
}

window.addEventListener("resize", resize);

// Spawn shooting star using object pool
function spawnShootingStarCanvas() {
  const star = shootingStarPool.find((s) => !s.active);
  if (!star) return;

  star.active = true;
  star.x = Math.random() * canvas.width;
  star.y = Math.random() * canvas.height * 0.6;
  star.length = 8 + Math.random() * 8;
  star.speed = 8 + Math.random() * 6;
  star.angle = Math.random() * Math.PI * 2;
  const colors = ["#489BCF", "#4A61A4", "#2E1B49", "#FFFFFF"];
  star.color = colors[Math.floor(Math.random() * colors.length)];
}

setInterval(
  () => {
    if (!document.hidden && Math.random() < 0.7) spawnShootingStarCanvas();
  },
  2000 + Math.random() * 3000,
);

function drawShootingStars() {
  shootingStarPool.forEach((s) => {
    if (!s.active) return;

    const dx = Math.cos(s.angle) * s.speed;
    const dy = Math.sin(s.angle) * s.speed;

    if (
      s.x + s.length < 0 ||
      s.x - s.length > canvas.width ||
      s.y + s.length < 0 ||
      s.y - s.length > canvas.height
    ) {
      s.active = false;
      return;
    }

    const grad = ctx.createLinearGradient(
      s.x,
      s.y,
      s.x - dx * s.length,
      s.y - dy * s.length,
    );
    grad.addColorStop(0, s.color);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - dx * s.length, s.y - dy * s.length);
    ctx.stroke();

    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
    ctx.fill();

    s.x += dx;
    s.y += dy;
  });
}

function draw() {
  const start = performance.now();
  frameCount++;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  layers.forEach((layer) =>
    layer.stars.forEach((star) => {
      if (
        star.x + star.radius < 0 ||
        star.x - star.radius > canvas.width ||
        star.y + star.radius < 0 ||
        star.y - star.radius > canvas.height
      )
        return;

      // Only update alpha every 5 frames
      if (frameCount % 5 === 0) {
        star.alpha += (Math.random() - 0.5) * 0.02;
        star.alpha = Math.max(0.1, Math.min(1, star.alpha));
      }

      star.x += star.dx;
      star.y += star.dy;
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRGB(star.color)},${star.alpha})`;
      ctx.fill();
    }),
  );

  drawShootingStars();
  const end = performance.now();
  benchmark.update(end - start);
  if (showBenchmark) { benchmark.draw(ctx); };
  requestAnimationFrame(draw);
}

draw();

const bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.3;

let musicStarted = false;
musicStarted = true;
bgMusic.play().catch((err) => console.warn("Autoplay blocked:", err));
