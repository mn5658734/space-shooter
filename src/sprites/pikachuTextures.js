/**
 * Procedural Doraemon-style hero + helicopter projectile textures.
 * Original fan-style vector pixels; no official character assets.
 */

const BLUE = 0x2f8bff;
const BLUE_DARK = 0x1e5fc7;
const WHITE = 0xffffff;
const BLACK = 0x111111;
const RED = 0xff3a3a;
const YELLOW = 0xffdd44;

function drawRotor(g, cx, cy, phase) {
    g.fillStyle(RED, 1);
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

    // Body
    g.fillStyle(BLUE, 1);
    g.fillRoundedRect(8, H - 20, 16, 14, 6);
    g.fillStyle(WHITE, 1);
    g.fillRoundedRect(11, H - 18, 10, 10, 4);

    // Bell
    g.fillStyle(YELLOW, 1);
    g.fillCircle(W / 2, H - 11, 2);
    g.lineStyle(1, BLACK, 1);
    g.strokeCircle(W / 2, H - 11, 2);

    // Head
    g.fillStyle(BLUE, 1);
    g.fillCircle(W / 2, 14 + bob, 10);
    g.fillStyle(WHITE, 1);
    g.fillCircle(W / 2, 16 + bob, 8);

    // Eyes
    g.fillStyle(WHITE, 1);
    g.fillEllipse(W / 2 - 3, 11 + bob, 4, 6);
    g.fillEllipse(W / 2 + 3, 11 + bob, 4, 6);
    g.fillStyle(BLACK, 1);
    g.fillCircle(W / 2 - 2, 12 + bob, 1);
    g.fillCircle(W / 2 + 2, 12 + bob, 1);

    // Nose + whiskers
    g.fillStyle(RED, 1);
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

    // Mouth
    g.lineStyle(1, BLACK, 1);
    g.beginPath();
    g.moveTo(W / 2, 16 + bob);
    g.lineTo(W / 2, 21 + bob);
    g.moveTo(W / 2 - 4, 21 + bob);
    g.lineTo(W / 2 + 4, 21 + bob);
    g.strokePath();

    // Thrust frames show active take-copter
    if (frameIndex >= 2) {
        drawRotor(g, W / 2, 2, frameIndex - 2);
        g.fillStyle(BLUE_DARK, 1);
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

/**
 * @param {Phaser.Scene} scene
 */
export function registerDoraemonTextures(scene) {
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
