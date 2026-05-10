import {
    CHARACTER_ORDER,
    CHARACTERS,
    DEFAULT_CHARACTER_ID,
    configureHeroSprite,
    getCharacterConfig,
    playHeroAnim
} from '../gameCharacters.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;

        this.sound.stopAll();
        this.music = this.sound.add('music-title', { loop: true, volume: 0.5 });
        this.music.play();

        this.bgIndex = 0;
        this.backgrounds = ['background', 'desert-bg', 'lava-bg'];
        this.bg = this.add.image(240, 320, this.backgrounds[0])
            .setDisplaySize(480, 640);

        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.bgIndex = (this.bgIndex + 1) % 3;
                this.tweens.add({
                    targets: this.bg,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        this.bg.setTexture(this.backgrounds[this.bgIndex]);
                        this.tweens.add({
                            targets: this.bg,
                            alpha: 1,
                            duration: 500
                        });
                    }
                });
            },
            loop: true
        });

        this.stars = this.add.tileSprite(0, 0, 480, 640, 'stars')
            .setOrigin(0, 0)
            .setTileScale(2)
            .setAlpha(0.7);

        this.bgEnemies = [];
        this.time.addEvent({
            delay: 800,
            callback: () => this.spawnBackgroundEnemy(),
            loop: true
        });

        this.add.rectangle(240, 320, 480, 640, 0x000000, 0.4);

        // ===== TITLE =====

        this.add.text(width / 2, 48, 'SPACE', {
            fontFamily: 'monospace',
            fontSize: '36px',
            fill: '#ffaa00',
            stroke: '#ff4400',
            strokeThickness: 4
        }).setOrigin(0.5);

        const titleInferno = this.add.text(width / 2, 92, 'KILLER', {
            fontFamily: 'monospace',
            fontSize: '56px',
            fill: '#ff4400',
            stroke: '#ffcc00',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: [titleInferno],
            scale: { from: 1, to: 1.03 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== CHARACTER SELECT =====

        this.add.text(width / 2, 132, 'CHOOSE PILOT', {
            fontFamily: 'monospace',
            fontSize: '17px',
            fill: '#ffdd66',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(4);

        const rowBaseY = 158;
        const rowGap = 24;

        this.pickHighlight = this.add.rectangle(width / 2, rowBaseY, 440, rowGap - 2, 0xffff00, 0.14)
            .setOrigin(0.5)
            .setDepth(3);

        this.selectedCharacterId = DEFAULT_CHARACTER_ID;

        const previewY = 318;
        const startCfg = getCharacterConfig(this.selectedCharacterId);
        const pk = startCfg.useSpritesheetHero ? startCfg.heroSheetKey : `${startCfg.heroTextureBase}-0`;
        const pf = startCfg.heroSheetIdleFrame ?? 0;
        this.previewHero = this.add.sprite(width / 2, previewY, pk, pf).setDepth(5);
        configureHeroSprite(this.previewHero, startCfg);
        this.previewHero.setScale(startCfg.previewScale);
        playHeroAnim(this.previewHero, startCfg, startCfg.previewAnimThrust);

        CHARACTER_ORDER.forEach((id, idx) => {
            const c = CHARACTERS[id];
            const y = rowBaseY + idx * rowGap;
            const txt = this.add.text(width / 2, y, `${idx + 1}. ${c.label} — ${c.shotLabel}`, {
                fontFamily: 'monospace',
                fontSize: '13px',
                fill: '#dddddd',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(4);

            txt.on('pointerover', () => txt.setFill('#ffffff'));
            txt.on('pointerout', () => txt.setFill('#dddddd'));
            txt.on('pointerdown', () => this.selectCharacter(id));
        });

        this.selectCharacter(this.selectedCharacterId);

        this.tweens.add({
            targets: this.previewHero,
            y: { from: previewY, to: previewY + 14 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.previewHero,
            angle: { from: -3, to: 3 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(width / 2, 418, 'Tap a pilot, then launch.', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#777777',
            align: 'center'
        }).setOrigin(0.5);

        const launch = () => {
            this.cameras.main.flash(500, 255, 255, 255);
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene', {
                    level: 1,
                    characterId: this.selectedCharacterId
                });
            });
        };

        const playBtn = this.createButton(width / 2, 468, '[ LAUNCH ]', '#00ff00', launch);

        this.tweens.add({
            targets: playBtn,
            alpha: { from: 1, to: 0.7 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.add.text(width / 2, 548, 'Keys 1–4: pick pilot   Space/Enter: launch', {
            fontFamily: 'monospace',
            fontSize: '11px',
            fill: '#444444'
        }).setOrigin(0.5);

        this.add.text(width / 2, 625, 'v1.1', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#222222'
        }).setOrigin(0.5);

        const k1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        const k2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        const k3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        const k4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        k1.on('down', () => this.selectCharacter(CHARACTER_ORDER[0]));
        k2.on('down', () => this.selectCharacter(CHARACTER_ORDER[1]));
        k3.on('down', () => this.selectCharacter(CHARACTER_ORDER[2]));
        k4.on('down', () => this.selectCharacter(CHARACTER_ORDER[3]));

        this.input.keyboard.once('keydown-SPACE', launch);
        this.input.keyboard.once('keydown-ENTER', launch);

        this.cameras.main.flash(1000, 0, 0, 0);
    }

    selectCharacter(id) {
        if (!CHARACTERS[id]) return;
        this.selectedCharacterId = id;
        const cfg = getCharacterConfig(id);
        configureHeroSprite(this.previewHero, cfg);
        this.previewHero.setScale(cfg.previewScale);
        playHeroAnim(this.previewHero, cfg, cfg.previewAnimThrust);

        const idx = CHARACTER_ORDER.indexOf(id);
        const rowBaseY = 158;
        const rowGap = 24;
        if (idx >= 0) {
            this.pickHighlight.y = rowBaseY + idx * rowGap;
        }
    }

    update() {
        this.stars.tilePositionY -= 1;

        this.bgEnemies.forEach((enemy, index) => {
            if (enemy.y > 700) {
                enemy.destroy();
                this.bgEnemies.splice(index, 1);
            }
        });
    }

    spawnBackgroundEnemy() {
        const enemies = [
            { key: 'enemy-small', anim: 'enemy-small-fly', scale: 2 },
            { key: 'enemy-medium', anim: 'enemy-medium-fly', scale: 2 },
            { key: 'l2-enemy-small', anim: 'l2-enemy-small-fly', scale: 1 },
            { key: 'l3-enemy-small', anim: 'l3-enemy-small-fly', scale: 0.3 }
        ];
        const config = Phaser.Math.RND.pick(enemies);

        const x = Phaser.Math.Between(50, 430);
        const enemy = this.add.sprite(x, -30, config.key)
            .setScale(config.scale)
            .setAlpha(0.4)
            .setDepth(-1);

        enemy.play(config.anim);

        this.tweens.add({
            targets: enemy,
            y: 700,
            duration: Phaser.Math.Between(4000, 8000),
            ease: 'Linear'
        });

        this.bgEnemies.push(enemy);
    }

    createButton(x, y, text, color, callback) {
        const btn = this.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => {
            btn.setScale(1.15);
            btn.setFill('#ffffff');
            this.tweens.add({
                targets: btn,
                x: x + 5,
                duration: 50,
                yoyo: true
            });
        });

        btn.on('pointerout', () => {
            btn.setScale(1);
            btn.setFill(color);
        });

        btn.on('pointerdown', callback);

        return btn;
    }
}
