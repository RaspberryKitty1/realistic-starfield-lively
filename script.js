const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const layers = [
  { count: 2000, speed: 0.01, radius: 0.3, stars: [] },
  { count: 1700, speed: 0.04, radius: 0.7, stars: [] },
  { count: 1500, speed: 0.1, radius: 1.2, stars: [] }
];

const nebulaLayers = [];
const starColors = ["#FFFFFF", "#FFE9C4", "#D4FBFF", "#FFD1DC"];
const nebulaCanvases = [];
const orbs = [];
let frameCount = 0;

// Shooting star pool
const MAX_SHOOTING_STARS = 20;
const shootingStarPool = [];
for (let i = 0; i < MAX_SHOOTING_STARS; i++) {
  shootingStarPool.push({ active: false });
}

// drifting orb(s)
for (let i = 0; i < 1; i++) {
  orbs.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    radius: 30
  });
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
  layers.forEach(layer => {
    layer.stars = [];
    for (let i = 0; i < layer.count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * layer.radius + 0.2;
      const alpha = Math.random() * 0.8 + 0.2;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      layer.stars.push({
        x, y, radius, alpha, color,
        dx: (Math.random() - 0.5) * layer.speed,
        dy: (Math.random() - 0.5) * layer.speed
      });
    }
  });

  // Nebula layers
  nebulaLayers.length = 0;
  for (let i = 0; i < 3; i++) {
    const n = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.8,
      radius: 250 + Math.random() * 300,
      colors: ["#489BCF", "#4A61A4", "#2E1B49"],
      alpha: 0.1 + Math.random() * 0.15,
      dx: (Math.random() - 0.5) * 0.02,
      dy: (Math.random() - 0.5) * 0.01
    };
    nebulaLayers.push(n);
  }
}

function generateNebulaCanvases() {
  nebulaCanvases.length = 0;
  nebulaLayers.forEach(n => {
    const off = document.createElement("canvas");
    off.width = n.radius * 2;
    off.height = n.radius * 2;
    const offCtx = off.getContext("2d");

    const grad = offCtx.createRadialGradient(
      n.radius, n.radius, n.radius * 0.1,
      n.radius, n.radius, n.radius
    );
    grad.addColorStop(0, `rgba(${hexToRGB(n.colors[0])},${n.alpha})`);
    grad.addColorStop(0.5, `rgba(${hexToRGB(n.colors[1])},${n.alpha * 0.7})`);
    grad.addColorStop(1, `rgba(${hexToRGB(n.colors[2])},0)`);

    offCtx.fillStyle = grad;
    offCtx.fillRect(0, 0, off.width, off.height);

    nebulaCanvases.push(off);
  });
}

generateStarsAndNebula();
generateNebulaCanvases();

let lastWidth = canvas.width;
let lastHeight = canvas.height;

function resize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  const xRatio = newWidth / lastWidth;
  const yRatio = newHeight / lastHeight;

  canvas.width = newWidth;
  canvas.height = newHeight;

  layers.forEach(layer =>
    layer.stars.forEach(star => {
      star.x *= xRatio;
      star.y *= yRatio;
    })
  );
  nebulaLayers.forEach(n => {
    n.x *= xRatio;
    n.y *= yRatio;
  });
  orbs.forEach(o => {
    o.x *= xRatio;
    o.y *= yRatio;
  });

  lastWidth = newWidth;
  lastHeight = newHeight;
}

window.addEventListener("resize", resize);

// Spawn shooting star using object pool
function spawnShootingStarCanvas() {
  const star = shootingStarPool.find(s => !s.active);
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

setInterval(() => {
  if (!document.hidden && Math.random() < 0.7) spawnShootingStarCanvas();
}, 2000 + Math.random() * 3000);

function drawShootingStars() {
  shootingStarPool.forEach(s => {
    if (!s.active) return;

    const dx = Math.cos(s.angle) * s.speed;
    const dy = Math.sin(s.angle) * s.speed;

    if (
      s.x + s.length < 0 || s.x - s.length > canvas.width ||
      s.y + s.length < 0 || s.y - s.length > canvas.height
    ) {
      s.active = false;
      return;
    }

    const grad = ctx.createLinearGradient(
      s.x,
      s.y,
      s.x - dx * s.length,
      s.y - dy * s.length
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

// orb update + draw
function drawOrbs() {
  orbs.forEach(o => {
    o.x += o.dx;
    o.y += o.dy;

    if (o.x < o.radius || o.x > canvas.width - o.radius) o.dx *= -1;
    if (o.y < o.radius || o.y > canvas.height - o.radius) o.dy *= -1;

    if (
      o.x + o.radius < 0 || o.x - o.radius > canvas.width ||
      o.y + o.radius < 0 || o.y - o.radius > canvas.height
    ) return;

    const grad = ctx.createRadialGradient(
      o.x, o.y,
      o.radius * 0.2,
      o.x, o.y,
      o.radius
    );
    grad.addColorStop(0, "rgba(200,150,255,0.6)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function draw() {
  frameCount++;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw nebula (pre-rendered)
  nebulaLayers.forEach((n, i) => {
    n.x += n.dx;
    n.y += n.dy;

    if (n.x - n.radius > canvas.width) n.x = -n.radius;
    if (n.x + n.radius < 0) n.x = canvas.width + n.radius;
    if (n.y - n.radius > canvas.height) n.y = -n.radius;
    if (n.y + n.radius < 0) n.y = canvas.height + n.radius;

    if (
      n.x + n.radius < 0 || n.x - n.radius > canvas.width ||
      n.y + n.radius < 0 || n.y - n.radius > canvas.height
    ) return;

    ctx.drawImage(
      nebulaCanvases[i],
      n.x - n.radius,
      n.y - n.radius
    );
  });

  // Draw stars
  layers.forEach(layer =>
    layer.stars.forEach(star => {
      if (
        star.x + star.radius < 0 || star.x - star.radius > canvas.width ||
        star.y + star.radius < 0 || star.y - star.radius > canvas.height
      ) return;

      // Only update alpha every 5 frames
      if (frameCount % 5 === 0) {
        star.alpha += (Math.random() - 0.5) * 0.02;
        star.alpha = Math.max(0.1, Math.min(1, star.alpha));
      }

      star.x += star.dx;
      star.y += star.dy;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRGB(star.color)},${star.alpha})`;
      ctx.fill();
    })
  );

  drawShootingStars();
  drawOrbs();
  requestAnimationFrame(draw);
}

draw();