/**
 * Procedural playable heroes + projectiles (fan-style originals; no ripped assets).
 */

// --- Doraemon + helicopter ---

const D_BLUE = 0x2f8bff;
const D_BLUE_DARK = 0x1e5fc7;
const WHITE = 0xffffff;
const BLACK = 0x111111;
const D_RED = 0xff3a3a;
const D_YELLOW = 0xffdd44;

function drawRotor(g, cx, cy, phase) {
    g.fillStyle(D_RED, 1);
    g.fillCircle(cx, cy, 2);
    g.lineStyle(3, 0xd8d8d8, 0.95);
    if (phase === 0) {
        g.beginPath();
        g.moveTo(cx - 9, cy);
        g.lineTo(cx + 9, cy);
        g.strokePath();
    } else if (phase === 1) {
        g.beginPath();
        g.moveTo(cx - 7, cy - 3);
        g.lineTo(cx + 7, cy + 3);
        g.strokePath();
    } else {
        g.beginPath();
        g.moveTo(cx - 7, cy + 3);
        g.lineTo(cx + 7, cy - 3);
        g.strokePath();
    }
}

function drawDoraHero(g, frameIndex, W, H) {
    g.clear();
    const bob = frameIndex % 2 === 0 ? 0 : 1;

    g.fillStyle(D_BLUE, 1);
    g.fillRoundedRect(8, H - 20, 16, 14, 6);
    g.fillStyle(WHITE, 1);
    g.fillRoundedRect(11, H - 18, 10, 10, 4);

    g.fillStyle(D_YELLOW, 1);
    g.fillCircle(W / 2, H - 11, 2);
    g.lineStyle(1, BLACK, 1);
    g.strokeCircle(W / 2, H - 11, 2);

    g.fillStyle(D_BLUE, 1);
    g.fillCircle(W / 2, 14 + bob, 10);
    g.fillStyle(WHITE, 1);
    g.fillCircle(W / 2, 16 + bob, 8);

    g.fillStyle(WHITE, 1);
    g.fillEllipse(W / 2 - 3, 11 + bob, 4, 6);
    g.fillEllipse(W / 2 + 3, 11 + bob, 4, 6);
    g.fillStyle(BLACK, 1);
    g.fillCircle(W / 2 - 2, 12 + bob, 1);
    g.fillCircle(W / 2 + 2, 12 + bob, 1);

    g.fillStyle(D_RED, 1);
    g.fillCircle(W / 2, 14 + bob, 2);
    g.lineStyle(1, BLACK, 1);
    g.beginPath();
    g.moveTo(W / 2 - 1, 16 + bob);
    g.lineTo(W / 2 - 8, 15 + bob);
    g.moveTo(W / 2 - 1, 17 + bob);
    g.lineTo(W / 2 - 8, 18 + bob);
    g.moveTo(W / 2 + 1, 16 + bob);
    g.lineTo(W / 2 + 8, 15 + bob);
    g.moveTo(W / 2 + 1, 17 + bob);
    g.lineTo(W / 2 + 8, 18 + bob);
    g.strokePath();

    g.lineStyle(1, BLACK, 1);
    g.beginPath();
    g.moveTo(W / 2, 16 + bob);
    g.lineTo(W / 2, 21 + bob);
    g.moveTo(W / 2 - 4, 21 + bob);
    g.lineTo(W / 2 + 4, 21 + bob);
    g.strokePath();

    if (frameIndex >= 2) {
        drawRotor(g, W / 2, 2, frameIndex - 2);
        g.fillStyle(D_BLUE_DARK, 1);
        g.fillRect(W / 2 - 1, 4, 2, 4);
    }
}

function drawHeliBladeShot(g, variant, W, H) {
    g.clear();
    const cx = W / 2;
    const cy = H / 2;

    g.fillStyle(0x9ec8ff, 0.8);
    g.fillCircle(cx, cy, 4);
    g.lineStyle(3, WHITE, 0.9);
    if (variant === 0) {
        g.beginPath();
        g.moveTo(cx - 6, cy);
        g.lineTo(cx + 6, cy);
        g.strokePath();
    } else if (variant === 1) {
        g.beginPath();
        g.moveTo(cx - 5, cy - 3);
        g.lineTo(cx + 5, cy + 3);
        g.strokePath();
    } else {
        g.beginPath();
        g.moveTo(cx - 5, cy + 3);
        g.lineTo(cx + 5, cy - 3);
        g.strokePath();
    }
}

function drawHeliDisc(g, variant, size) {
    g.clear();
    const cx = size / 2;
    const cy = size / 2;
    g.fillStyle(0x7fb9ff, 0.45);
    g.fillCircle(cx, cy, 10);
    g.lineStyle(2, 0xdff3ff, 0.9);
    g.strokeCircle(cx, cy, 10 + (variant % 2));
    g.strokeCircle(cx, cy, 7);

    g.lineStyle(3, WHITE, 1);
    if (variant === 0) {
        g.beginPath();
        g.moveTo(cx - 9, cy);
        g.lineTo(cx + 9, cy);
        g.strokePath();
    } else if (variant === 1) {
        g.beginPath();
        g.moveTo(cx - 7, cy - 4);
        g.lineTo(cx + 7, cy + 4);
        g.strokePath();
    } else {
        g.beginPath();
        g.moveTo(cx - 7, cy + 4);
        g.lineTo(cx + 7, cy - 4);
        g.strokePath();
    }
}

function registerDoraPack(scene) {
    const heroW = 32;
    const heroH = 40;

    for (let f = 0; f < 5; f++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawDoraHero(g, f, heroW, heroH);
        g.generateTexture(`dora-hero-${f}`, heroW, heroH);
        g.destroy();
    }

    for (let v = 0; v < 3; v++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawHeliBladeShot(g, v, 14, 22);
        g.generateTexture(`heli-shot-${v}`, 14, 22);
        g.destroy();
    }

    for (let m = 0; m < 3; m++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawHeliDisc(g, m, 28);
        g.generateTexture(`heli-disc-${m}`, 28, 28);
        g.destroy();
    }
}

// --- Pikachu + electric ---

const PK_YELLOW = 0xffdc42;
const PK_YELLOW_DARK = 0xc9a018;
const PK_BROWN = 0x6b4423;
const PK_RED = 0xff4455;

function drawPikaHero(g, frameIndex, W, H) {
    g.clear();
    const bob = frameIndex % 2 === 1 ? 1 : 0;

    g.fillStyle(PK_YELLOW_DARK, 1);
    g.fillTriangle(4 + bob, H - 6, 10, H - 14, 6, H - 18);
    g.fillTriangle(6, H - 18, 12, H - 16, 8, H - 22);
    g.fillStyle(PK_YELLOW, 1);
    g.fillTriangle(8, H - 22, 14, H - 20, 10, H - 26);

    g.fillStyle(PK_YELLOW, 1);
    g.fillRoundedRect(10, H - 18, 14, 14, 5);

    g.fillCircle(W / 2, 13 + bob, 9);

    g.fillStyle(PK_YELLOW, 1);
    g.fillTriangle(11 - bob, 10, 7 - bob, 2, 15 - bob, 7);
    g.fillTriangle(W - 11 + bob, 10, W - 7 + bob, 2, W - 15 + bob, 7);
    g.fillStyle(BLACK, 1);
    g.fillTriangle(10 - bob, 9, 8 - bob, 4, 13 - bob, 7);
    g.fillTriangle(W - 10 + bob, 9, W - 8 + bob, 4, W - 13 + bob, 7);

    g.fillStyle(PK_BROWN, 1);
    g.fillRect(W - 8, H - 16, 3, 9);

    g.fillStyle(PK_RED, 1);
    g.fillCircle(11, 14 + bob, 3);
    g.fillCircle(W - 11, 14 + bob, 3);

    g.fillStyle(BLACK, 1);
    g.fillCircle(14, 11 + bob, 2);
    g.fillCircle(W - 14, 11 + bob, 2);
    g.fillStyle(WHITE, 1);
    g.fillCircle(15, 10 + bob, 1);
    g.fillCircle(W - 15, 10 + bob, 1);

    g.fillStyle(BLACK, 1);
    g.fillRect(W / 2 - 2, 15 + bob, 4, 1);

    if (frameIndex >= 2) {
        const phase = frameIndex - 2;
        g.lineStyle(2, WHITE, 1);
        const offsets = [
            [[5, H - 4], [2, H - 1]], [[27, H - 4], [30, H - 1]],
            [[8, H - 2], [4, H - 1]], [[24, H - 2], [28, H - 1]]
        ];
        const pair = offsets[phase % offsets.length];
        g.beginPath();
        g.moveTo(pair[0][0], pair[0][1]);
        g.lineTo(pair[1][0], pair[1][1]);
        g.strokePath();

        g.lineStyle(2, 0xffff88, 0.9);
        g.beginPath();
        g.moveTo(12, H - 8);
        g.lineTo(phase % 2 === 0 ? 8 : 16, H - 4);
        g.strokePath();
        g.beginPath();
        g.moveTo(W - 12, H - 8);
        g.lineTo(phase % 2 === 0 ? W - 8 : W - 16, H - 4);
        g.strokePath();
    }
}

function drawLightningBolt(g, variant, W, H) {
    g.clear();
    const seeds = [
        [[W / 2, H - 2], [W / 2 - 4, H * 0.55], [W / 2 + 3, H * 0.35], [W / 2 - 2, 2]],
        [[W / 2, H - 2], [W / 2 + 4, H * 0.5], [W / 2 - 5, H * 0.38], [W / 2 + 2, 2]],
        [[W / 2, H - 2], [W / 2 - 3, H * 0.52], [W / 2 + 5, H * 0.32], [W / 2 - 3, 2]]
    ];
    const pts = seeds[variant % 3];

    g.lineStyle(4, 0xffee44, 1);
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
        g.lineTo(pts[i][0], pts[i][1]);
    }
    g.strokePath();

    g.lineStyle(2, WHITE, 1);
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
        g.lineTo(pts[i][0] + (i % 2 === 0 ? -1 : 1), pts[i][1]);
    }
    g.strokePath();
}

function drawMegaVolt(g, variant, S) {
    g.clear();
    const cx = S / 2;
    const cy = S / 2;
    for (let r = 8; r <= 14; r += 3) {
        g.lineStyle(2, variant === 0 ? 0xffffaa : 0x88ddff, 0.85);
        g.strokeCircle(cx, cy, r + (variant % 2));
    }
    const j = variant % 3;
    const dx = j === 0 ? 0 : j === 1 ? -1 : 1;
    g.lineStyle(4, 0xffee44, 1);
    g.beginPath();
    g.moveTo(cx, S - 4);
    g.lineTo(cx - 4 + dx, cy + 2);
    g.lineTo(cx + 4 + dx, cy - 2);
    g.lineTo(cx + dx, 5);
    g.strokePath();
    g.lineStyle(2, WHITE, 1);
    g.beginPath();
    g.moveTo(cx, S - 5);
    g.lineTo(cx - 3 + dx, cy + 2);
    g.lineTo(cx + 3 + dx, cy - 3);
    g.lineTo(cx + dx, 6);
    g.strokePath();
}

function registerPikaPack(scene) {
    const heroW = 32;
    const heroH = 40;

    for (let f = 0; f < 5; f++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawPikaHero(g, f, heroW, heroH);
        g.generateTexture(`pika-hero-${f}`, heroW, heroH);
        g.destroy();
    }

    const voltW = 14;
    const voltH = 22;
    for (let v = 0; v < 3; v++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawLightningBolt(g, v, voltW, voltH);
        g.generateTexture(`volt-bolt-${v}`, voltW, voltH);
        g.destroy();
    }

    for (let m = 0; m < 3; m++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawMegaVolt(g, m, 28);
        g.generateTexture(`volt-mega-${m}`, 28, 28);
        g.destroy();
    }
}

// --- Spider-Man style + web ---

const SM_BLUE = 0x153885;
const SM_RED = 0xb21212;

function drawSpideyHero(g, frameIndex, W, H) {
    g.clear();
    const bob = frameIndex % 2;

    g.fillStyle(SM_BLUE, 1);
    g.fillRoundedRect(9, H - 18, 14, 14, 5);

    g.fillStyle(SM_RED, 1);
    g.fillCircle(W / 2, 13 + bob, 9);

    g.fillStyle(WHITE, 1);
    g.fillEllipse(W / 2 - 4, 11 + bob, 6, 5);
    g.fillEllipse(W / 2 + 4, 11 + bob, 6, 5);

    g.fillStyle(BLACK, 1);
    g.fillCircle(W / 2 - 4, 11 + bob, 1.5);
    g.fillCircle(W / 2 + 4, 11 + bob, 1.5);

    g.lineStyle(1, BLACK, 0.55);
    g.beginPath();
    g.moveTo(W / 2, 6 + bob);
    g.lineTo(W / 2, 18 + bob);
    g.moveTo(W / 2 - 7, 11 + bob);
    g.lineTo(W / 2 + 7, 11 + bob);
    g.strokePath();

    if (frameIndex >= 2) {
        const phase = frameIndex - 2;
        g.lineStyle(2, 0xe8eefc, 0.95);
        const dx = phase === 1 ? -4 : phase === 2 ? 4 : 0;
        g.beginPath();
        g.moveTo(8 + dx, H - 10);
        g.lineTo(2 + dx, H - 4);
        g.strokePath();
        g.beginPath();
        g.moveTo(W - 8 - dx, H - 10);
        g.lineTo(W - 2 - dx, H - 4);
        g.strokePath();
    }
}

function drawWebStrand(g, variant, W, H) {
    g.clear();
    const cx = W / 2;
    const off = variant === 0 ? 0 : variant === 1 ? -2 : 2;
    g.lineStyle(2, 0xf5f8ff, 1);
    g.beginPath();
    g.moveTo(cx + off, H - 2);
    g.lineTo(cx - 3 + off, H * 0.58);
    g.lineTo(cx + 4 + off, H * 0.36);
    g.lineTo(cx - 2 + off, 4);
    g.strokePath();
    g.lineStyle(1, 0x8899bb, 0.85);
    g.beginPath();
    g.moveTo(cx + off + 2, H - 3);
    g.lineTo(cx + 1 + off, H * 0.5);
    g.lineTo(cx + 5 + off, H * 0.28);
    g.lineTo(cx + 1 + off, 6);
    g.strokePath();
}

function drawWebBurst(g, variant, S) {
    g.clear();
    const cx = S / 2;
    const cy = S / 2;
    g.fillStyle(0xffffff, 0.15);
    g.fillCircle(cx, cy, 11);

    const angles = [0, Math.PI / 3, (2 * Math.PI) / 3];
    g.lineStyle(2, 0xf0f4ff, 0.95);
    for (let i = 0; i < 3; i++) {
        const base = angles[i] + variant * 0.35;
        const r = 10;
        g.beginPath();
        g.moveTo(cx + Math.cos(base) * 3, cy + Math.sin(base) * 3);
        g.lineTo(cx + Math.cos(base) * r, cy + Math.sin(base) * r);
        g.strokePath();
    }
    g.lineStyle(1, 0xaab8dd, 0.9);
    g.strokeCircle(cx, cy, 7 + (variant % 2));
}

function registerSpiderPack(scene) {
    const heroW = 32;
    const heroH = 40;

    for (let f = 0; f < 5; f++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawSpideyHero(g, f, heroW, heroH);
        g.generateTexture(`spidey-hero-${f}`, heroW, heroH);
        g.destroy();
    }

    for (let v = 0; v < 3; v++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawWebStrand(g, v, 14, 22);
        g.generateTexture(`web-shot-${v}`, 14, 22);
        g.destroy();
    }

    for (let m = 0; m < 3; m++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawWebBurst(g, m, 28);
        g.generateTexture(`web-burst-${m}`, 28, 28);
        g.destroy();
    }
}

/**
 * Register textures + relies on BootScene to define matching Phaser anims.
 * @param {Phaser.Scene} scene
 */
export function registerAllPlayableCharacterTextures(scene) {
    registerDoraPack(scene);
    registerPikaPack(scene);
    registerSpiderPack(scene);
}
