export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Level system
        this.level = data.level || 1;
        this.wave = 1;
        // Fewer waves = boss appears faster! Level 1 is quick intro
        this.wavesPerLevel = this.level === 1 ? 2 : 3;
        this.waveInProgress = false;

        // Player stats
        this.lives = 3;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.score = data.score || 0;
        this.isInvincible = false;
        this.isDead = false;

        // Player movement
        this.playerSpeed = 200;
        this.playerSpeedBoost = 1;

        // Weapon stats - faster firing to handle more enemies!
        this.bulletSpeed = 450;
        this.lastFired = 0;
        this.fireRate = 150; // Faster fire rate
        this.weaponLevel = data.weaponLevel || 1;

        // Boss state
        this.bossActive = false;
        this.boss = null;
        this.bossHP = 0;
        this.bossMaxHP = 0;

        // Timers
        this.shieldActive = false;
        this.shieldTimer = null;
        this.speedBoostTimer = null;

        // Touch controls
        this.touchPointer = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
    }

    create() {
        // Create backgrounds based on level
        this.createBackgrounds();

        // Create player
        this.createPlayer();

        // Create groups
        this.bullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.powerups = this.physics.add.group();
        this.bossGroup = this.physics.add.group(); // Dedicated group for boss

        // Setup input
        this.setupInput();

        // Setup collisions
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.playerHitByEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemyBullets, this.playerHitByBullet, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);

        // Create UI
        this.createUI();

        // Show level intro then start
        this.showLevelIntro();
    }

    // ============== BACKGROUNDS ==============

    createBackgrounds() {
        const scaleX = 480 / 272;
        const scaleY = 640 / 160;

        // Clear any existing background elements
        this.bgLayers = [];

        if (this.level === 1) {
            // Level 1: Deep space
            this.bg = this.add.tileSprite(0, 0, 480, 640, 'background')
                .setOrigin(0, 0).setScale(scaleX, scaleY);
            this.farPlanets = this.add.tileSprite(0, 0, 480, 640, 'far-planets')
                .setOrigin(0, 0).setScale(scaleX, scaleY);
            this.stars = this.add.tileSprite(0, 0, 480, 640, 'stars')
                .setOrigin(0, 0).setScale(scaleX, scaleY);

            this.bgLayers = [
                { sprite: this.bg, speed: 0.3 },
                { sprite: this.farPlanets, speed: 0.5 },
                { sprite: this.stars, speed: 1.5 }
            ];
        } else if (this.level === 2) {
            // Level 2: Planet approach
            this.bg = this.add.tileSprite(0, 0, 480, 640, 'background')
                .setOrigin(0, 0).setScale(scaleX, scaleY);
            this.stars = this.add.tileSprite(0, 0, 480, 640, 'stars')
                .setOrigin(0, 0).setScale(scaleX, scaleY);

            // Big planet in background
            this.bigPlanet = this.add.image(350, 200, 'big-planet')
                .setScale(3).setAlpha(0.7).setDepth(1);

            // Ring planet
            this.ringPlanet = this.add.image(100, 500, 'ring-planet')
                .setScale(2.5).setAlpha(0.8).setDepth(1);

            this.bgLayers = [
                { sprite: this.bg, speed: 0.3 },
                { sprite: this.stars, speed: 1.5 }
            ];
        } else if (this.level === 3) {
            // Level 3: Industrial/Alien territory
            // industrial-bg is 272x160, industrial-buildings is 213x142
            this.bg = this.add.tileSprite(0, 0, 480, 640, 'industrial-bg')
                .setOrigin(0, 0).setScale(scaleX, scaleY);
            this.buildings = this.add.tileSprite(0, 0, 480, 640, 'industrial-buildings')
                .setOrigin(0, 0).setScale(480 / 213, 640 / 142).setAlpha(0.7);
            this.stars = this.add.tileSprite(0, 0, 480, 640, 'stars')
                .setOrigin(0, 0).setScale(scaleX, scaleY).setAlpha(0.4);

            this.bgLayers = [
                { sprite: this.bg, speed: 0.3 },
                { sprite: this.buildings, speed: 1.2 },
                { sprite: this.stars, speed: 0.6 }
            ];
        }
    }

    // ============== PLAYER ==============

    createPlayer() {
        this.player = this.physics.add.sprite(240, 550, 'ship');
        this.player.setScale(3);
        this.player.setCollideWorldBounds(true);
        this.player.play('ship-idle');
        this.player.setSize(12, 20);
        this.player.setDepth(10);

        this.shieldSprite = this.add.graphics();
        this.shieldSprite.setDepth(11);
    }

    setupInput() {
        // Keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Debug: Z key to skip to boss immediately
        this.input.keyboard.on('keydown-Z', () => {
            if (!this.bossActive && !this.isDead) {
                // Stop current wave spawning
                if (this.enemySpawnTimer) this.enemySpawnTimer.remove();
                // Clear all enemies
                this.enemies.clear(true, true);
                this.waveInProgress = false;
                // Start boss fight
                this.startBossFight();
            }
        });

        // Touch controls
        this.input.on('pointerdown', (pointer) => {
            this.touchPointer = pointer;
            this.touchStartX = this.player.x;
            this.touchStartY = this.player.y;
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown && !this.isDead) {
                this.player.x = Phaser.Math.Clamp(pointer.x, 30, 450);
                this.player.y = Phaser.Math.Clamp(pointer.y, 30, 610);
            }
        });

        this.input.on('pointerup', () => {
            this.touchPointer = null;
        });
    }

    // ============== UI ==============

    createUI() {
        // Score
        this.scoreText = this.add.text(16, 16, 'SCORE: ' + this.score, {
            fontFamily: 'monospace', fontSize: '18px',
            fill: '#fff', stroke: '#000', strokeThickness: 3
        }).setDepth(100);

        // Level & Wave
        this.levelText = this.add.text(240, 16, `LEVEL ${this.level}`, {
            fontFamily: 'monospace', fontSize: '18px',
            fill: '#ff0', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5, 0).setDepth(100);

        // Lives
        this.livesText = this.add.text(464, 16, 'x' + this.lives, {
            fontFamily: 'monospace', fontSize: '18px',
            fill: '#0f0', stroke: '#000', strokeThickness: 3
        }).setOrigin(1, 0).setDepth(100);

        // Lives icon
        this.add.sprite(440, 24, 'ship', 0).setScale(1.5).setDepth(100);

        // Health bar
        this.healthBarBg = this.add.rectangle(240, 620, 200, 14, 0x333333).setDepth(100);
        this.healthBar = this.add.rectangle(141, 620, 196, 10, 0x00ff00)
            .setOrigin(0, 0.5).setDepth(100);
        this.add.rectangle(240, 620, 200, 14).setStrokeStyle(2, 0xffffff).setDepth(100);

        // Announcement text
        this.announceText = this.add.text(240, 300, '', {
            fontFamily: 'monospace', fontSize: '42px',
            fill: '#fff', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setDepth(100).setAlpha(0);

        // Boss health bar (hidden initially)
        this.createBossHealthBar();
    }

    createBossHealthBar() {
        this.bossHealthContainer = this.add.container(240, 60).setDepth(100).setVisible(false);

        const label = this.add.text(0, -20, 'BOSS', {
            fontFamily: 'monospace', fontSize: '16px',
            fill: '#f00', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        const bg = this.add.rectangle(0, 0, 300, 20, 0x333333);
        this.bossHealthBar = this.add.rectangle(-148, 0, 296, 16, 0xff0000).setOrigin(0, 0.5);
        const border = this.add.rectangle(0, 0, 300, 20).setStrokeStyle(2, 0xffffff);

        this.bossHealthContainer.add([label, bg, this.bossHealthBar, border]);
    }

    // ============== GAME LOOP ==============

    update(time) {
        if (this.isDead) return;

        // Scroll backgrounds
        this.bgLayers.forEach(layer => {
            layer.sprite.tilePositionY -= layer.speed;
        });

        // Level 2 planet movement
        if (this.level === 2) {
            if (this.bigPlanet) this.bigPlanet.y += 0.1;
            if (this.ringPlanet) this.ringPlanet.y += 0.15;
        }

        // Player
        this.handlePlayerMovement();
        this.handleShooting(time);
        this.updateShield();

        // Enemies
        this.updateEnemies(time);

        // Boss
        if (this.bossActive && this.boss) {
            this.updateBoss(time);
        }

        // Cleanup
        this.cleanupOffscreen();

        // Check wave/boss completion
        if (!this.bossActive) {
            this.checkWaveComplete();
        }
    }

    handlePlayerMovement() {
        // Skip if touch is active
        if (this.touchPointer && this.touchPointer.isDown) {
            this.player.play('ship-idle', true);
            return;
        }

        const { left, right, up, down } = this.cursors;
        let velocityX = 0;
        let velocityY = 0;
        const speed = this.playerSpeed * this.playerSpeedBoost;

        if (left.isDown || this.wasd.left.isDown) velocityX = -speed;
        else if (right.isDown || this.wasd.right.isDown) velocityX = speed;

        if (up.isDown || this.wasd.up.isDown) velocityY = -speed;
        else if (down.isDown || this.wasd.down.isDown) velocityY = speed;

        this.player.setVelocity(velocityX, velocityY);
        this.player.play(velocityY < 0 ? 'ship-thrust' : 'ship-idle', true);
    }

    handleShooting(time) {
        const isShooting = this.spaceKey.isDown ||
            (this.touchPointer && this.touchPointer.isDown);

        if (isShooting && time > this.lastFired) {
            this.fireBullet();
            this.lastFired = time + this.fireRate;
        }
    }

    fireBullet() {
        const x = this.player.x;
        const y = this.player.y - 20;

        if (this.weaponLevel === 1) {
            this.createBullet(x, y, 0);
        } else if (this.weaponLevel === 2) {
            this.createBullet(x - 15, y, 0);
            this.createBullet(x + 15, y, 0);
        } else {
            this.createBullet(x, y, 0);
            this.createBullet(x - 15, y + 5, -50);
            this.createBullet(x + 15, y + 5, 50);
        }
    }

    createBullet(x, y, velocityX) {
        const bullet = this.bullets.create(x, y, 'laser', 0);
        bullet.setScale(2);
        bullet.body.setSize(8, 14);
        bullet.setVelocity(velocityX, -this.bulletSpeed);
    }

    updateShield() {
        this.shieldSprite.clear();
        if (this.shieldActive) {
            this.shieldSprite.lineStyle(3, 0x00ffff, 0.8);
            this.shieldSprite.strokeCircle(this.player.x, this.player.y, 35);
        }
    }

    // ============== WAVE SYSTEM ==============

    showLevelIntro() {
        this.announceText.setText(`LEVEL ${this.level}`);
        this.announceText.setAlpha(1);

        this.tweens.add({
            targets: this.announceText,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(500, () => this.startWave());
            }
        });
    }

    startWave() {
        if (this.wave > this.wavesPerLevel) {
            // All waves done, spawn boss
            this.startBossFight();
            return;
        }

        this.waveInProgress = true;
        this.levelText.setText(`LEVEL ${this.level} - WAVE ${this.wave}`);

        this.announceText.setText(`WAVE ${this.wave}`);
        this.announceText.setAlpha(1);
        this.tweens.add({
            targets: this.announceText,
            alpha: 0,
            duration: 1500,
            ease: 'Power2'
        });

        // Spawn enemies - MORE enemies for frantic gameplay!
        const enemyCount = 8 + (this.level * 4) + (this.wave * 4);
        this.spawnWaveEnemies(enemyCount);
    }

    spawnWaveEnemies(count) {
        let spawned = 0;
        // Much faster spawn rate for frantic action!
        const spawnDelay = Math.max(250, 800 - (this.level * 80) - (this.wave * 40));

        this.enemySpawnTimer = this.time.addEvent({
            delay: spawnDelay,
            callback: () => {
                if (spawned < count && !this.isDead && !this.bossActive) {
                    this.spawnEnemy();
                    spawned++;
                }
            },
            repeat: count - 1
        });
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(50, 430);
        const rand = Math.random();
        // Higher chances for tougher enemies = more chaos!
        const bigChance = Math.min(0.08 + (this.level * 0.06) + (this.wave * 0.03), 0.30);
        const mediumChance = Math.min(0.25 + (this.level * 0.08) + (this.wave * 0.04), 0.50);

        if (rand < bigChance) {
            this.createBigEnemy(x);
        } else if (rand < bigChance + mediumChance) {
            this.createMediumEnemy(x);
        } else {
            this.createSmallEnemy(x);
        }
    }

    createSmallEnemy(x) {
        const enemy = this.enemies.create(x, -30, 'enemy-small');
        enemy.setScale(3);
        enemy.play('enemy-small-fly');
        enemy.setSize(14, 14);
        enemy.enemyType = 'small';
        enemy.health = 1;
        enemy.points = 100;
        // FASTER speeds!
        enemy.setVelocityY(Phaser.Math.Between(120 + this.level * 20, 220 + this.level * 25));
        enemy.setVelocityX(Phaser.Math.Between(-60, 60));
    }

    createMediumEnemy(x) {
        const enemy = this.enemies.create(x, -30, 'enemy-medium');
        enemy.setScale(3);
        enemy.play('enemy-medium-fly');
        enemy.setSize(14, 14);
        enemy.enemyType = 'medium';
        enemy.health = 2;
        enemy.points = 200;
        enemy.canShoot = true;
        enemy.lastShot = 0;
        // Shoot much more frequently!
        enemy.shootDelay = Phaser.Math.Between(800 - this.level * 100, 1500 - this.level * 150);
        enemy.setVelocityY(Phaser.Math.Between(80, 140));
        // Medium enemies now also move horizontally
        enemy.setVelocityX(Phaser.Math.Between(-40, 40));
    }

    createBigEnemy(x) {
        const enemy = this.enemies.create(x, -50, 'enemy-big');
        enemy.setScale(2.5);
        enemy.play('enemy-big-fly');
        enemy.setSize(28, 28);
        enemy.enemyType = 'big';
        enemy.health = 3 + this.level; // Slightly less HP but more of them
        enemy.points = 500;
        enemy.canShoot = true;
        enemy.lastShot = 0;
        // Shoot more aggressively!
        enemy.shootDelay = Phaser.Math.Between(500, 1000);
        enemy.setVelocityY(Phaser.Math.Between(50, 90));
        enemy.trackPlayer = true;
    }

    updateEnemies(time) {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.y > 680) {
                enemy.destroy();
                return;
            }

            if (enemy.canShoot && time > enemy.lastShot + enemy.shootDelay) {
                this.enemyShoot(enemy);
                enemy.lastShot = time;
            }

            if (enemy.trackPlayer && this.player.active) {
                const dx = this.player.x - enemy.x;
                enemy.setVelocityX(dx * 0.5);
            }
        });
    }

    enemyShoot(enemy) {
        const bullet = this.enemyBullets.create(enemy.x, enemy.y + 20, 'laser', 2);
        bullet.setScale(2);
        bullet.setTint(0xff0000);
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        bullet.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
    }

    checkWaveComplete() {
        if (!this.waveInProgress) return;

        const spawnDone = !this.enemySpawnTimer ||
            this.enemySpawnTimer.getRepeatCount() === 0;
        const enemiesCleared = this.enemies.countActive() === 0;

        if (spawnDone && enemiesCleared) {
            this.waveInProgress = false;
            this.wave++;

            this.time.delayedCall(2000, () => {
                if (!this.isDead) this.startWave();
            });
        }
    }

    // ============== BOSS FIGHT ==============

    startBossFight() {
        this.bossActive = true;

        this.announceText.setText('WARNING!\nBOSS APPROACHING');
        this.announceText.setFill('#ff0000');
        this.announceText.setAlpha(1);

        // Flash warning
        this.tweens.add({
            targets: this.announceText,
            alpha: { from: 1, to: 0.3 },
            duration: 200,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.announceText.setAlpha(0);
                this.announceText.setFill('#ffffff');
                this.spawnBoss();
            }
        });

        // Screen shake
        this.cameras.main.shake(500, 0.01);
    }

    spawnBoss() {
        // Clear the boss group first
        this.bossGroup.clear(true, true);

        // Create boss and add to dedicated boss group
        this.boss = this.bossGroup.create(240, -100, 'boss');
        this.boss.setScale(1.2);
        this.boss.play('boss-idle');
        this.boss.setDepth(5);

        // Boss tint based on level
        const tints = [0xffffff, 0x8888ff, 0xffdd00];
        this.boss.setTint(tints[this.level - 1]);

        // Boss stats scale with level - ULTRA TANKY BOSS!
        // Store HP at SCENE level, not on sprite, to avoid any Phaser conflicts
        this.bossMaxHP = 1000; // Simple: 1000 HP, 10 damage per bullet = 100 hits to kill
        this.bossHP = this.bossMaxHP;
        this.boss.points = 5000 * this.level;
        this.boss.lastShot = 0; // Will be set properly when active

        // Mark this sprite as THE boss so we can identify it even if this.boss reference is lost
        this.boss.isBossSprite = true;

        // Debug log
        console.log('=== BOSS SPAWNED ===');
        console.log('Level:', this.level);
        console.log('Scene-level bossHP:', this.bossHP);
        console.log('Scene-level bossMaxHP:', this.bossMaxHP);
        this.boss.shootPattern = 0;
        this.boss.phaseTime = 0;

        // Set hitbox
        this.boss.body.setSize(160, 100);
        this.boss.body.setOffset(16, 22);

        // Boss is invincible during entry
        this.boss.isEntering = true;

        // Reset boss health bar to full
        this.bossHealthBar.setScale(1, 1);

        // Enter animation
        this.tweens.add({
            targets: this.boss,
            y: 120,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // NOW enable collisions after boss is visible - use bossGroup for clean collision handling
                this.bossCollider = this.physics.add.overlap(this.bullets, this.bossGroup, this.hitBoss, null, this);
                this.bossPlayerCollider = this.physics.add.overlap(this.player, this.bossGroup, this.playerHitByEnemy, null, this);

                this.bossHealthContainer.setVisible(true);
                this.boss.isEntering = false;
                this.boss.movementPhase = 'active';

                // Initialize lastShot to current time so boss shoots after first delay
                this.boss.lastShot = this.time.now;

                // Fire immediately on entry!
                this.bossShoot();

                console.log('Boss collision enabled, HP:', this.bossHP);
            }
        });
    }

    updateBoss(time) {
        if (!this.boss || !this.boss.active) return;
        if (this.boss.movementPhase !== 'active') return;

        // Movement pattern
        this.boss.phaseTime += 16;
        const moveX = Math.sin(this.boss.phaseTime * 0.002) * 100;
        this.boss.x = 240 + moveX;

        // Shooting patterns based on health - VERY AGGRESSIVE!
        // Use scene-level HP variables
        const healthPercent = this.bossHP / this.bossMaxHP;
        let shootDelay = 600; // Fast shooting!

        if (healthPercent < 0.3) {
            shootDelay = 250; // Bullet hell final phase!
            this.boss.shootPattern = 2;
        } else if (healthPercent < 0.6) {
            shootDelay = 400;
            this.boss.shootPattern = 1;
        }

        if (time > this.boss.lastShot + shootDelay) {
            this.bossShoot();
            this.boss.lastShot = time;
        }

        // Update damage animation
        if (healthPercent < 0.3) {
            this.boss.play('boss-damage-3', true);
        } else if (healthPercent < 0.6) {
            this.boss.play('boss-damage-2', true);
        } else if (healthPercent < 0.85) {
            this.boss.play('boss-damage-1', true);
        }
    }

    bossShoot() {
        if (this.boss.shootPattern === 0) {
            // 3-bullet spread
            for (let i = -1; i <= 1; i++) {
                const bullet = this.enemyBullets.create(this.boss.x + i * 40, this.boss.y + 60, 'laser', 2);
                bullet.setScale(2.5);
                bullet.setTint(0xff0000);
                bullet.setVelocity(i * 80, 250);
            }
        } else if (this.boss.shootPattern === 1) {
            // 3 aimed shots spread out
            for (let i = -1; i <= 1; i++) {
                const bullet = this.enemyBullets.create(this.boss.x + i * 50, this.boss.y + 60, 'laser', 2);
                bullet.setScale(2.5);
                bullet.setTint(0xff4400);
                const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, this.player.x, this.player.y);
                bullet.setVelocity(Math.cos(angle) * 220 + i * 40, Math.sin(angle) * 220);
            }
        } else {
            // 6-bullet spiral pattern (less intense)
            for (let i = 0; i < 6; i++) {
                const angle = (this.boss.phaseTime * 0.015) + (i * Math.PI / 3);
                const bullet = this.enemyBullets.create(this.boss.x, this.boss.y + 60, 'laser', 2);
                bullet.setScale(2);
                bullet.setTint(0xff0066);
                bullet.setVelocity(Math.cos(angle) * 180, Math.sin(angle) * 180 + 100);
            }
        }
    }

    hitBoss(bullet, boss) {
        // Safety check - make sure boss exists and is valid
        if (!boss || !boss.active || !this.bossActive) {
            bullet.destroy();
            return;
        }

        bullet.destroy();

        // Each bullet does 10 damage - use SCENE-LEVEL HP
        const damage = 10;
        const oldHealth = this.bossHP;
        this.bossHP = Math.max(0, this.bossHP - damage);

        console.log('Boss hit! HP:', oldHealth, '->', this.bossHP, '/', this.bossMaxHP);

        // Update health bar using scene-level HP
        const healthPercent = this.bossHP / this.bossMaxHP;
        this.bossHealthBar.setScale(Math.max(0, healthPercent), 1);

        // Change health bar color based on health
        if (healthPercent < 0.3) {
            this.bossHealthBar.setFillStyle(0xff0000); // Red when critical
        } else if (healthPercent < 0.6) {
            this.bossHealthBar.setFillStyle(0xff8800); // Orange when damaged
        }

        // Flash effect
        boss.setTint(0xffffff);
        this.time.delayedCall(50, () => {
            const tints = [0xffffff, 0x8888ff, 0xffdd00];
            if (boss && boss.active) boss.setTint(tints[this.level - 1]);
        });

        // Only defeat boss when health reaches 0 - use SCENE-LEVEL HP
        if (this.bossHP <= 0 && this.bossActive) {
            console.log('Boss defeated! Calling defeatBoss()');
            this.defeatBoss();
        }
    }

    defeatBoss() {
        console.log('defeatBoss() called, bossActive:', this.bossActive, 'boss:', !!this.boss);

        // Prevent multiple calls
        if (!this.bossActive) {
            console.log('defeatBoss() early return - already processed');
            return;
        }

        this.bossActive = false;
        this.bossHealthContainer.setVisible(false);

        // Remove colliders safely
        if (this.bossCollider) {
            this.bossCollider.destroy();
            this.bossCollider = null;
        }
        if (this.bossPlayerCollider) {
            this.bossPlayerCollider.destroy();
            this.bossPlayerCollider = null;
        }

        // Store boss position for explosions
        const bossX = this.boss ? this.boss.x : 240;
        const bossY = this.boss ? this.boss.y : 120;
        const bossPoints = 5000 * this.level;

        // Hide boss immediately
        if (this.boss) {
            this.boss.setVisible(false);
            if (this.boss.body) this.boss.body.enable = false;
        }

        // Multiple explosions
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 200, () => {
                const x = bossX + Phaser.Math.Between(-80, 80);
                const y = bossY + Phaser.Math.Between(-60, 60);
                this.createExplosion(x, y, 'boss');
                this.cameras.main.shake(100, 0.02);
            });
        }

        // Final big explosion and level complete
        this.time.delayedCall(1600, () => {
            console.log('Boss final explosion sequence starting');
            this.createExplosion(bossX, bossY, 'boss');
            this.createExplosion(bossX - 40, bossY - 20, 'boss');
            this.createExplosion(bossX + 40, bossY + 20, 'boss');
            this.cameras.main.shake(300, 0.03);

            this.score += bossPoints;
            this.scoreText.setText('SCORE: ' + this.score);

            // Clear boss group and reference
            this.bossGroup.clear(true, true);
            this.boss = null;

            // Level complete after short delay
            console.log('Scheduling levelComplete in 1500ms');
            this.time.delayedCall(1500, () => this.levelComplete());
        });
    }

    levelComplete() {
        console.log('levelComplete() called, current level:', this.level);

        // Save progress
        const bestLevel = parseInt(localStorage.getItem('bestLevel')) || 0;
        if (this.level > bestLevel) {
            localStorage.setItem('bestLevel', this.level);
        }

        if (this.level >= 3) {
            // Game complete!
            console.log('All levels complete! Going to VictoryScene');
            this.scene.start('VictoryScene', { score: this.score });
        } else {
            // Next level
            console.log('Level complete! Going to level', this.level + 1);
            this.announceText.setText('LEVEL COMPLETE!');
            this.announceText.setAlpha(1);

            this.time.delayedCall(2500, () => {
                this.scene.start('GameScene', {
                    level: this.level + 1,
                    score: this.score,
                    weaponLevel: this.weaponLevel
                });
            });
        }
    }

    // ============== COLLISIONS ==============

    hitEnemy(bullet, enemy) {
        // CRITICAL: Never process the boss through this function
        // Check both the flag AND if it's in the bossGroup
        if (enemy.isBossSprite || this.bossGroup.contains(enemy)) {
            console.warn('hitEnemy called with boss sprite! Redirecting to hitBoss.');
            // Don't destroy bullet here - let hitBoss handle it
            return;
        }

        bullet.destroy();
        enemy.health--;

        if (enemy.health <= 0) {
            this.createExplosion(enemy.x, enemy.y, enemy.enemyType);
            this.maybeDropPowerup(enemy.x, enemy.y);
            this.score += enemy.points;
            this.scoreText.setText('SCORE: ' + this.score);
            enemy.destroy();
        } else {
            enemy.setTint(0xff0000);
            this.time.delayedCall(100, () => {
                if (enemy.active) enemy.clearTint();
            });
        }
    }

    playerHitByEnemy(player, enemy) {
        // Check if this is the boss - use multiple checks for safety
        const isBoss = (this.boss && enemy === this.boss) ||
                       enemy.isBossSprite === true ||
                       this.bossGroup.contains(enemy);

        if (this.isInvincible || this.shieldActive) {
            if (!isBoss) {
                this.createExplosion(enemy.x, enemy.y, enemy.enemyType || 'small');
                enemy.destroy();
            }
            return;
        }

        this.takeDamage(isBoss ? 30 : 50);
        if (!isBoss) {
            this.createExplosion(enemy.x, enemy.y, enemy.enemyType || 'small');
            enemy.destroy();
        }
    }

    playerHitByBullet(player, bullet) {
        if (this.isInvincible || this.shieldActive) {
            bullet.destroy();
            return;
        }
        this.takeDamage(20);
        bullet.destroy();
    }

    takeDamage(amount) {
        this.health -= amount;
        this.updateHealthBar();

        this.player.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            if (this.player.active) this.player.clearTint();
        });

        this.cameras.main.shake(100, 0.01);

        if (this.health <= 0) this.loseLife();
    }

    updateHealthBar() {
        const pct = Math.max(0, this.health / this.maxHealth);
        this.healthBar.setScale(pct, 1);
        this.healthBar.setFillStyle(pct > 0.6 ? 0x00ff00 : pct > 0.3 ? 0xffff00 : 0xff0000);
    }

    loseLife() {
        this.lives--;
        this.livesText.setText('x' + this.lives);

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.respawn();
        }
    }

    respawn() {
        this.health = this.maxHealth;
        this.updateHealthBar();
        this.createExplosion(this.player.x, this.player.y, 'big');

        this.player.setPosition(240, 550);
        this.player.setVelocity(0, 0);

        this.isInvincible = true;
        this.tweens.add({
            targets: this.player,
            alpha: { from: 0.3, to: 0.8 },
            duration: 100,
            repeat: 15,
            yoyo: true,
            onComplete: () => {
                this.isInvincible = false;
                this.player.setAlpha(1);
            }
        });
    }

    gameOver() {
        console.log('gameOver() called! Lives:', this.lives, 'Boss active:', this.bossActive);
        this.isDead = true;
        this.createExplosion(this.player.x, this.player.y, 'big');
        this.player.setVisible(false);
        this.player.body.enable = false;

        if (this.enemySpawnTimer) this.enemySpawnTimer.remove();

        // Save stats
        const highScore = parseInt(localStorage.getItem('highScore')) || 0;
        if (this.score > highScore) localStorage.setItem('highScore', this.score);

        const bestWave = parseInt(localStorage.getItem('bestWave')) || 0;
        const totalWave = (this.level - 1) * this.wavesPerLevel + this.wave;
        if (totalWave > bestWave) localStorage.setItem('bestWave', totalWave);

        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverScene', { score: this.score, level: this.level, wave: this.wave });
        });
    }

    // ============== POWER-UPS ==============

    maybeDropPowerup(x, y) {
        // Higher drop rate (25%) to balance increased difficulty!
        if (Math.random() > 0.25) return;

        const weights = [0.4, 0.3, 0.25, 0.05];
        const types = ['weapon', 'shield', 'speed', 'life'];
        let rand = Math.random();
        let type = 'weapon';

        for (let i = 0; i < weights.length; i++) {
            if (rand < weights[i]) { type = types[i]; break; }
            rand -= weights[i];
        }

        const frameMap = { weapon: 0, shield: 1, speed: 2, life: 3 };
        const powerup = this.powerups.create(x, y, 'powerup', frameMap[type]);
        powerup.setScale(2.5);
        powerup.powerupType = type;
        powerup.setVelocityY(80);

        this.tweens.add({
            targets: powerup,
            scale: { from: 2.5, to: 3 },
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    collectPowerup(player, powerup) {
        const type = powerup.powerupType;

        const messages = {
            weapon: ['WEAPON UP!', 0xff8800],
            shield: ['SHIELD!', 0x00ffff],
            speed: ['SPEED BOOST!', 0x00ff00],
            life: ['EXTRA LIFE!', 0xff00ff]
        };

        if (type === 'weapon') this.weaponLevel = Math.min(this.weaponLevel + 1, 3);
        else if (type === 'shield') this.activateShield();
        else if (type === 'speed') this.activateSpeedBoost();
        else if (type === 'life') {
            this.lives++;
            this.livesText.setText('x' + this.lives);
        }

        this.showPowerupText(messages[type][0], messages[type][1]);
        powerup.destroy();
    }

    activateShield() {
        this.shieldActive = true;
        if (this.shieldTimer) this.shieldTimer.remove();
        this.shieldTimer = this.time.delayedCall(5000, () => this.shieldActive = false);
    }

    activateSpeedBoost() {
        this.playerSpeedBoost = 1.5;
        if (this.speedBoostTimer) this.speedBoostTimer.remove();
        this.speedBoostTimer = this.time.delayedCall(5000, () => this.playerSpeedBoost = 1);
    }

    showPowerupText(text, color) {
        const t = this.add.text(this.player.x, this.player.y - 50, text, {
            fontFamily: 'monospace', fontSize: '20px',
            fill: '#' + color.toString(16).padStart(6, '0'),
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: t, y: t.y - 50, alpha: 0, duration: 1000,
            onComplete: () => t.destroy()
        });
    }

    // ============== EXPLOSIONS & CLEANUP ==============

    createExplosion(x, y, type) {
        const config = {
            small: ['explosion', 'explode', 3],
            medium: ['explosion-large', 'explode-large', 2],
            big: ['explosion-big', 'explode-big', 1.5],
            boss: ['explosion-boss', 'explode-boss', 1.2]
        };

        const [sprite, anim, scale] = config[type] || config.small;
        const explosion = this.add.sprite(x, y, sprite).setScale(scale).setDepth(50);
        explosion.play(anim);
        explosion.on('animationcomplete', () => explosion.destroy());

        if (type === 'big' || type === 'boss') {
            this.cameras.main.shake(200, 0.02);
        }
    }

    cleanupOffscreen() {
        this.bullets.getChildren().forEach(b => { if (b.y < -20) b.destroy(); });
        this.enemyBullets.getChildren().forEach(b => {
            if (b.y > 660 || b.y < -20 || b.x < -20 || b.x > 500) b.destroy();
        });
        this.powerups.getChildren().forEach(p => { if (p.y > 660) p.destroy(); });
    }
}
