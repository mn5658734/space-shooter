export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Show loading progress
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // ============== PLAYER & ENEMIES ==============

        this.load.spritesheet('ship', 'assets/sprites/ship.png', {
            frameWidth: 16, frameHeight: 24
        });

        this.load.spritesheet('enemy-small', 'assets/sprites/enemy-small.png', {
            frameWidth: 16, frameHeight: 16
        });

        this.load.spritesheet('enemy-medium', 'assets/sprites/enemy-medium.png', {
            frameWidth: 16, frameHeight: 16
        });

        this.load.spritesheet('enemy-big', 'assets/sprites/enemy-big.png', {
            frameWidth: 32, frameHeight: 32
        });

        // Boss: 960x144, 5 frames of 192x144
        this.load.spritesheet('boss', 'assets/sprites/boss.png', {
            frameWidth: 192, frameHeight: 144
        });

        // Boss thrust: 256x48, 4 frames of 64x48
        this.load.spritesheet('boss-thrust', 'assets/sprites/boss-thrust.png', {
            frameWidth: 64, frameHeight: 48
        });

        // ============== PROJECTILES & POWERUPS ==============

        this.load.spritesheet('laser', 'assets/sprites/laser-bolts.png', {
            frameWidth: 16, frameHeight: 16
        });

        this.load.spritesheet('powerup', 'assets/sprites/power-up.png', {
            frameWidth: 16, frameHeight: 16
        });

        // ============== EXPLOSIONS ==============

        this.load.spritesheet('explosion', 'assets/sprites/explosion.png', {
            frameWidth: 16, frameHeight: 16
        });

        this.load.spritesheet('explosion-large', 'assets/sprites/explosion-large.png', {
            frameWidth: 32, frameHeight: 32
        });

        this.load.spritesheet('explosion-big', 'assets/sprites/explosion-big.png', {
            frameWidth: 64, frameHeight: 64
        });

        // Boss explosion: 560x80, 7 frames of 80x80
        this.load.spritesheet('explosion-boss', 'assets/sprites/explosion-boss.png', {
            frameWidth: 80, frameHeight: 80
        });

        // ============== BACKGROUNDS ==============

        // Level 1: Deep space
        this.load.image('background', 'assets/backgrounds/parallax-space-backgound.png');
        this.load.image('stars', 'assets/backgrounds/parallax-space-stars.png');
        this.load.image('far-planets', 'assets/backgrounds/parallax-space-far-planets.png');

        // Level 2: Planet approach
        this.load.image('ring-planet', 'assets/backgrounds/parallax-space-ring-planet.png');
        this.load.image('big-planet', 'assets/backgrounds/parallax-space-big-planet.png');

        // Level 3: Industrial/Alien territory
        this.load.image('industrial-bg', 'assets/backgrounds/industrial-bg.png');
        this.load.image('industrial-buildings', 'assets/backgrounds/industrial-buildings.png');
        this.load.image('bulkhead', 'assets/backgrounds/bulkhead-walls-back.png');
    }

    create() {
        // ============== PLAYER ANIMATIONS ==============

        this.anims.create({
            key: 'ship-idle',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'ship-thrust',
            frames: this.anims.generateFrameNumbers('ship', { start: 5, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        // ============== ENEMY ANIMATIONS ==============

        this.anims.create({
            key: 'enemy-small-fly',
            frames: this.anims.generateFrameNumbers('enemy-small', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-medium-fly',
            frames: this.anims.generateFrameNumbers('enemy-medium', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy-big-fly',
            frames: this.anims.generateFrameNumbers('enemy-big', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });

        // ============== BOSS ANIMATIONS ==============

        this.anims.create({
            key: 'boss-idle',
            frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'boss-damage-1',
            frames: [{ key: 'boss', frame: 2 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'boss-damage-2',
            frames: [{ key: 'boss', frame: 3 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'boss-damage-3',
            frames: [{ key: 'boss', frame: 4 }],
            frameRate: 1
        });

        this.anims.create({
            key: 'boss-thrust',
            frames: this.anims.generateFrameNumbers('boss-thrust', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

        // ============== EXPLOSION ANIMATIONS ==============

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'explode-large',
            frames: this.anims.generateFrameNumbers('explosion-large', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'explode-big',
            frames: this.anims.generateFrameNumbers('explosion-big', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: 'explode-boss',
            frames: this.anims.generateFrameNumbers('explosion-boss', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        // Start menu scene
        this.scene.start('MenuScene');
    }
}
