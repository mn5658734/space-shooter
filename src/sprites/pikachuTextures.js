/**
 * Procedural Pikachu-inspired hero + electric bolt textures (original pixel-style art).
 * Not official Pokémon assets — fan-style depiction for the game.
 */

const YELLOW = 0xffdc42;
const YELLOW_DARK = 0xc9a018;
const BROWN = 0x6b4423;
const BLACK = 0x1a1a1a;
const RED = 0xff4455;
const WHITE = 0xffffff;

function drawPikachuHero(g, frameIndex, W, H) {
    g.clear();

    const bob = frameIndex % 2 === 1 ? 1 : 0;

    // Lightning tail (zigzag, left side)
    g.fillStyle(YELLOW_DARK, 1);
    g.fillTriangle(4 + bob, H - 6, 10, H - 14, 6, H - 18);
    g.fillTriangle(6, H - 18, 12, H - 16, 8, H - 22);
    g.fillStyle(YELLOW, 1);
    g.fillTriangle(8, H - 22, 14, H - 20, 10, H - 26);

    // Body
    g.fillStyle(YELLOW, 1);
    g.fillRoundedRect(10, H - 18, 14, 14, 5);

    // Head
    g.fillCircle(W / 2, 13 + bob, 9);

    // Ears
    g.fillStyle(YELLOW, 1);
    g.fillTriangle(11 - bob, 10, 7 - bob, 2, 15 - bob, 7);
    g.fillTriangle(W - 11 + bob, 10, W - 7 + bob, 2, W - 15 + bob, 7);
    g.fillStyle(BLACK, 1);
    g.fillTriangle(10 - bob, 9, 8 - bob, 4, 13 - bob, 7);
    g.fillTriangle(W - 10 + bob, 9, W - 8 + bob, 4, W - 13 + bob, 7);

    // Back stripes
    g.fillStyle(BROWN, 1);
    g.fillRect(W - 8, H - 16, 3, 9);

    // Cheeks
    g.fillStyle(RED, 1);
    g.fillCircle(11, 14 + bob, 3);
    g.fillCircle(W - 11, 14 + bob, 3);

    // Eyes
    g.fillStyle(BLACK, 1);
    g.fillCircle(14, 11 + bob, 2);
    g.fillCircle(W - 14, 11 + bob, 2);
    g.fillStyle(WHITE, 1);
    g.fillCircle(15, 10 + bob, 1);
    g.fillCircle(W - 15, 10 + bob, 1);

    // Tiny grin
    g.fillStyle(BLACK, 1);
    g.fillRect(W / 2 - 2, 15 + bob, 4, 1);

    // Thrust: electric sparks around paws
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

/**
 * @param {Phaser.Scene} scene
 */
export function registerPikachuTextures(scene) {
    const heroW = 32;
    const heroH = 40;

    for (let f = 0; f < 5; f++) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawPikachuHero(g, f, heroW, heroH);
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
