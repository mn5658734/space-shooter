# Retro Space Shooter - Game Specification

## Overview
A classic vertical-scrolling 2D space shooter built with Phaser.js, featuring pixel art graphics, power-ups, boss battles, and arcade-style scoring.

---

## Requirements

### Core Gameplay
- **Vertical scrolling** shooter with player ship at bottom of screen
- **Smooth 60 FPS** gameplay in modern browsers
- **Touch-friendly** controls for mobile support
- **Keyboard controls**: Arrow keys or WASD for movement, Space to shoot

### Player Mechanics
- Player ship with 3 lives
- Health bar or hit points per life
- Respawn invincibility period after death
- Smooth movement with screen boundary constraints

### Combat System
- Primary weapon with upgradeable fire rate and patterns
- Enemy collision causes damage
- Projectile-based combat for both player and enemies

### Power-Up System
- **Weapon upgrades**: Increased fire rate, spread shot, laser beam
- **Shield**: Temporary invincibility or damage absorption
- **Speed boost**: Temporary movement speed increase
- **Extra life**: Rare drop, adds one life

### Enemy Types
- **Small enemies**: Fast, low health, simple patterns
- **Medium enemies**: Moderate health, may shoot back
- **Big enemies**: Slow, high health, dangerous projectiles
- **Boss enemies**: End-of-level encounters with attack phases

### Scoring & Progression
- Points awarded per enemy destroyed (scaled by enemy type)
- Score multiplier for consecutive kills without taking damage
- High score persistence (localStorage)
- Wave-based progression with increasing difficulty
- 3 levels/worlds with distinct backgrounds

### Audio (Stretch Goal)
- Background music
- Sound effects for shooting, explosions, power-ups

---

## Milestones

### Milestone 1: Core Combat Loop
**Goal**: Playable prototype with basic shooting mechanics

**Features**:
- [ ] Phaser.js project setup with game canvas
- [ ] Scrolling space background with parallax stars
- [ ] Player ship with keyboard movement (arrow keys + WASD)
- [ ] Player shooting with spacebar (single projectile)
- [ ] Small enemies spawning from top, moving downward
- [ ] Collision detection (projectiles hit enemies, enemies hit player)
- [ ] Basic explosion effect on enemy death
- [ ] Simple UI: Score display

**Playable Outcome**: Player can fly around, shoot enemies, see score increase, and experience game over when hit.

**Assets Used**:
- Player ship
- Small enemy
- Laser bolts
- Space background + stars
- Basic explosion

---

### Milestone 2: Progression & Power-Ups
**Goal**: Complete wave system with power-ups and all enemy types

**Features**:
- [ ] Lives system (3 lives, respawn with invincibility)
- [ ] Health bar UI
- [ ] All enemy types (small, medium, big) with different behaviors
- [ ] Medium enemies shoot back at player
- [ ] Wave system with escalating difficulty
- [ ] Power-up drops from destroyed enemies
  - [ ] Weapon upgrade (spread shot)
  - [ ] Shield power-up
  - [ ] Speed boost
  - [ ] Extra life (rare)
- [ ] Enhanced parallax background (planets visible)
- [ ] Multiple explosion variations
- [ ] High score saved to localStorage

**Playable Outcome**: Full arcade loop—survive waves, collect power-ups, try to beat your high score.

**Assets Used**:
- All Milestone 1 assets
- Medium enemy
- Big enemy
- Power-up sprites
- Planet backgrounds (ring planet, big planet, far planets)
- All explosion variations

---

### Milestone 3: Boss Battles & Polish
**Goal**: Complete game with boss fights, multiple levels, and polish

**Features**:
- [ ] 3 distinct levels with unique backgrounds
  - Level 1: Deep space (stars + far planets)
  - Level 2: Planet approach (big planet + ring planet)
  - Level 3: Alien territory (industrial/bulkhead aesthetic)
- [ ] Boss encounter at end of each level
  - [ ] Boss health bar UI
  - [ ] Multiple attack patterns per boss
  - [ ] Visual feedback on boss damage
- [ ] Level transition screens
- [ ] Start menu with "Play" and "High Scores"
- [ ] Game over screen with restart option
- [ ] Screen shake on explosions
- [ ] Particle effects for engine thrust
- [ ] Mobile touch controls
- [ ] Audio: background music + SFX (if available)

**Playable Outcome**: Complete game experience—start menu, 3 levels with bosses, win/lose conditions, replayability.

**Assets Used**:
- All Milestone 2 assets
- Industrial/bulkhead backgrounds for Level 3
- Desert backgrounds (optional alternate level)

---

## Pixel Art Assets

All assets are located in `Legacy Collection/Assets/`

### Player & Enemies
| Asset | File Path |
|-------|-----------|
| Player Ship | `Packs/SpaceShipShooter/spritesheets/ship.png` |
| Enemy - Small | `Packs/SpaceShipShooter/spritesheets/enemy-small.png` |
| Enemy - Medium | `Packs/SpaceShipShooter/spritesheets/enemy-medium.png` |
| Enemy - Big | `Packs/SpaceShipShooter/spritesheets/enemy-big.png` |

### Projectiles & Power-Ups
| Asset | File Path |
|-------|-----------|
| Laser Bolts | `Packs/SpaceShipShooter/spritesheets/laser-bolts.png` |
| Power-Ups | `Packs/SpaceShipShooter/spritesheets/power-up.png` |

### Explosions
| Asset | File Path |
|-------|-----------|
| Explosion (Main) | `Packs/SpaceShipShooter/spritesheets/explosion.png` |
| Explosion Variant A | `Misc/Explosions pack/explosion-1-a/spritesheet.png` |
| Explosion Variant B | `Misc/Explosions pack/explosion-1-b/spritesheet.png` |
| Explosion Variant C | `Misc/Explosions pack/explosion-1-c/spritesheet.png` |
| Explosion Variant D | `Misc/Explosions pack/explosion-1-d/spritsheet.png` |
| Explosion Variant E | `Misc/Explosions pack/explosion-1-e/explosion-5.png` |
| Explosion Variant F | `Misc/Explosions pack/explosion-1-f/Sprites.png` |

### Space Backgrounds (Level 1 & 2)
| Asset | File Path |
|-------|-----------|
| Space Background | `Environments/space_background_pack/Old Version/layers/parallax-space-backgound.png` |
| Stars Layer | `Environments/space_background_pack/Old Version/layers/parallax-space-stars.png` |
| Far Planets | `Environments/space_background_pack/Old Version/layers/parallax-space-far-planets.png` |
| Ring Planet | `Environments/space_background_pack/Old Version/layers/parallax-space-ring-planet.png` |
| Big Planet | `Environments/space_background_pack/Old Version/layers/parallax-space-big-planet.png` |

### Industrial/Station Backgrounds (Level 3)
| Asset | File Path |
|-------|-----------|
| Bulkhead Walls (Full) | `Environments/bulkhead-walls/v1/bulkhead-wallsx3.png` |
| Bulkhead Back | `Environments/bulkhead-walls/v1/layers/bulkhead-walls-back.png` |
| Bulkhead Pipes | `Environments/bulkhead-walls/v1/layers/bulkhead-walls-pipes.png` |
| Bulkhead Platform | `Environments/bulkhead-walls/v1/layers/bulkhead-walls-platform.png` |
| Industrial BG | `Environments/parallax-industrial-web/Layers/bg.png` |
| Industrial Buildings | `Environments/parallax-industrial-web/Layers/buildings.png` |
| Industrial Far Buildings | `Environments/parallax-industrial-web/Layers/far-buildings.png` |

### Alternate Backgrounds (Optional)
| Asset | File Path |
|-------|-----------|
| Desert Background | `Packs/SpaceShipShooter/Desert/backgrounds/desert-backgorund.png` |
| Desert Clouds | `Packs/SpaceShipShooter/Desert/backgrounds/clouds-transparent.png` |

---

## Technical Notes

### Project Structure
```
space-shooter-game/
├── index.html
├── src/
│   ├── main.js          # Phaser game config & entry point
│   ├── scenes/
│   │   ├── BootScene.js      # Asset loading
│   │   ├── MenuScene.js      # Start menu
│   │   ├── GameScene.js      # Main gameplay
│   │   └── GameOverScene.js  # Game over screen
│   ├── sprites/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Boss.js
│   │   └── PowerUp.js
│   └── utils/
│       └── ScoreManager.js
├── assets/               # Copied/linked from Legacy Collection
└── SPEC.md
```

### Phaser Configuration
- **Renderer**: WebGL with Canvas fallback
- **Resolution**: 480x640 (classic arcade portrait) or 800x600 (landscape)
- **Physics**: Arcade physics for simple collision detection
- **Scale Mode**: FIT to maintain aspect ratio

---

## Success Criteria

1. **Milestone 1**: Playable in browser, can shoot and destroy enemies
2. **Milestone 2**: Can survive multiple waves, power-ups functional
3. **Milestone 3**: Can complete all 3 levels, defeat bosses, see win screen
