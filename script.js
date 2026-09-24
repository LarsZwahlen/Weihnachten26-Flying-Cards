const canvas = document.getElementById('c');
// alpha:false since we always paint an opaque background -> lets the
// browser skip compositing work (see MDN "Optimizing canvas")
const ctx = canvas.getContext('2d', { alpha: false });

const dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize() {
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener('resize', resize);

// ---------- thumbnail definitions ----------
const colorPalette = [
  ['#ff6b6b', '#c92a2a'],
  ['#5f7a1d', '#064c08'],
  ['#69db7c', '#2b8a3e'],
  ['#ffd43b', '#e67700'],
  ['#da77f2', '#862e9c'],
  ['#66d9e8', '#0b7285'],
];
const colorSongTitles = [
  'Silent Night',
  'Frosty the Snowman',
  "Rockin' Around the Christmas Tree",
  'Feliz Navidad',
  'Rudolph the Red-Nosed Reindeer',
  'Jingle Bell Rock',
];
const songImages = [
  'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1513297887119-d8f283251e16?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1513884923967-4b182ef167ab?auto=format&fit=crop&w=320&q=80',
];
const bwPalette = [
  ['#f1f3f5', '#adb5bd'],
  ['#dee2e6', '#868e96'],
  ['#e9ecef', '#495057'],
  ['#ced4da', '#343a40'],
  ['#f8f9fa', '#6c757d'],
  ['#d0d3d6', '#212529'],
];

const W = 150, H = 150; // thumbnail size

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function offscreenThumb(colors, label) {
  // Pre-render each thumbnail once onto an offscreen canvas so the main
  // loop only ever does a cheap drawImage() per frame (see MDN tip:
  // "pre-render repeating objects on an offscreen canvas")
  const oc = document.createElement('canvas');
  oc.width = W * dpr;
  oc.height = H * dpr;
  const octx = oc.getContext('2d');
  octx.scale(dpr, dpr);
  
  const grad = octx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(1, colors[1]);
  octx.fillStyle = grad;
  roundRect(octx, 0, 0, W, H, 10);
  octx.fill();

  octx.strokeStyle = 'rgba(255,255,255,0.35)';
  octx.lineWidth = 2;
  roundRect(octx, 1, 1, W - 2, H - 2, 9);
  octx.stroke();

  drawLabel(octx, label);
  return oc;
}

function drawLabel(octx, label) {
  octx.fillStyle = 'rgb(255, 255, 255)';
  octx.font = '400 13px "Goudy Bookletter 1911", serif';
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  const words = label.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (line && octx.measureText(candidate).width > W - 12) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  const lineHeight = 13;
  const startY = H / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((text, index) => {
    octx.fillText(text, W / 2, startY + index * lineHeight);
  });
}

function offscreenImageThumb(image) {
  const oc = document.createElement('canvas');
  oc.width = W * dpr;
  oc.height = H * dpr;
  const octx = oc.getContext('2d');
  octx.scale(dpr, dpr);
  const scale = Math.max(W / image.width, H / image.height);
  const width = image.width * scale;
  const height = image.height * scale;

  octx.save();
  roundRect(octx, 0, 0, W, H, 10);
  octx.clip();
  octx.drawImage(image, (W - width) / 2, (H - height) / 2, width, height);
  octx.fillStyle = 'rgba(0,0,0,0.12)';
  octx.fillRect(0, 0, W, H);
  octx.restore();

  octx.strokeStyle = 'rgba(255,255,255,0.45)';
  octx.lineWidth = 2;
  roundRect(octx, 1, 1, W - 2, H - 2, 9);
  octx.stroke();
  return oc;
}

// ---------- items ----------
const items = [];
// tracks which single card is frozen per group
const frozenByGroup = { color: null, bw: null };

function rand(min, max) { return min + Math.random() * (max - min); }

function makeGroup(group, palette, prefix) {
  for (let i = 0; i < palette.length; i++) {
    const item = {
      group,
      img: offscreenThumb(
        palette[i],
        colorSongTitles[i]
      ),
      x: rand(W, innerWidth - W),
      y: rand(H, innerHeight - H),
      vx: rand(-60, 60) || 40,
      vy: rand(-60, 60) || 40,
      angle: rand(0, Math.PI * 2),
      va: rand(-0.8, 0.8) || 0.3,
      stopped: false,
      w: W,
      h: H,
      glow: 0 // animates in when stopped
    };
    items.push(item);

    if (group === 'bw') {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        item.img = offscreenImageThumb(image);
      };
      image.src = songImages[i];
    }
  }
}

function makeItems() {
  items.length = 0;
  frozenByGroup.color = null;
  frozenByGroup.bw = null;
  makeGroup('color', colorPalette, 'C');
  makeGroup('bw', bwPalette, 'BW');
}
makeItems();

// ---------- interaction ----------
function toLocalPoint(item, px, py) {
  const dx = px - item.x;
  const dy = py - item.y;
  const cos = Math.cos(-item.angle);
  const sin = Math.sin(-item.angle);
  return { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
}

function hitTest(px, py) {
  // topmost first: frozen cards are always drawn last (on top),
  // so check them first, then the rest in reverse draw order
  const order = getRenderOrder();
  for (let i = order.length - 1; i >= 0; i--) {
    const it = order[i];
    const p = toLocalPoint(it, px, py);
    if (Math.abs(p.x) <= it.w / 2 && Math.abs(p.y) <= it.h / 2) return it;
  }
  return null;
}

function getRenderOrder() {
  return items;
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const hit = hitTest(x, y);
  if (!hit) return;

  const currentFrozen = frozenByGroup[hit.group];

  if (currentFrozen === hit) {
    // clicking the already-frozen card in this group unfreezes it
    hit.stopped = false;
    frozenByGroup[hit.group] = null;
  } else {
    // unfreeze whatever was frozen in this group before
    if (currentFrozen) currentFrozen.stopped = false;
    hit.stopped = true;
    frozenByGroup[hit.group] = hit;

    // permanently move the newly frozen card to the front of the draw
    // order (end of the array) until another card in its group is frozen
    const idx = items.indexOf(hit);
    items.splice(idx, 1);
    items.push(hit);
  }
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  canvas.style.cursor = hitTest(x, y) ? 'pointer' : 'default';
});

// ---------- physics + render loop ----------
let last = performance.now();

function step(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  // background
  ctx.fillStyle = '#0e0e12';
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  for (const it of getRenderOrder()) {
    if (!it.stopped) {
      it.x += it.vx * dt;
      it.y += it.vy * dt;
      it.angle += it.va * dt;

      const halfW = it.w / 2, halfH = it.h / 2;
      if (it.x - halfW < 0) { it.x = halfW; it.vx *= -1; it.va *= -1; }
      if (it.x + halfW > innerWidth) { it.x = innerWidth - halfW; it.vx *= -1; it.va *= -1; }
      if (it.y - halfH < 0) { it.y = halfH; it.vy *= -1; it.va *= -1; }
      if (it.y + halfH > innerHeight) { it.y = innerHeight - halfH; it.vy *= -1; it.va *= -1; }

      if (it.glow > 0) it.glow = Math.max(0, it.glow - dt * 3);
    } else if (it.glow < 1) {
      it.glow = Math.min(1, it.glow + dt * 4);
    }

    // integer-round the draw position to avoid sub-pixel AA cost
    const x = Math.round(it.x);
    const y = Math.round(it.y);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(it.angle);

    if (it.glow > 0) {
      ctx.shadowColor = 'rgba(255,255,255,' + (0.6 * it.glow) + ')';
      ctx.shadowBlur = 18 * it.glow;
    }

    ctx.drawImage(it.img, -it.w / 2, -it.h / 2, it.w, it.h);

    if (it.glow > 0.02) {
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.8 * it.glow) + ')';
      ctx.lineWidth = 2;
      roundRect(ctx, -it.w / 2 - 3, -it.h / 2 - 3, it.w + 6, it.h + 6, 12);
      ctx.stroke();
    }

    ctx.restore();
  }

  requestAnimationFrame(step);
}

requestAnimationFrame(step);