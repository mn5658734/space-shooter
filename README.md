# Space Shooter

A retro-style space shooter built with Phaser 3. Fight through three distinct levels, defeat powerful bosses, and save the Vega-9 colony.

## Story

The Vega-9 colony went dark. Recon footage shows sand where there should be steel, fire where there should be sky. Something is tearing the planet apart from the inside. You're the only pilot in range. Get in. Get answers.

## Features

- **3 Unique Levels**: Deep Space, Desert Canyon, and Lava/Hell environments
- **Boss Battles**: Each level ends with a challenging boss fight
- **Power-ups**: Weapon upgrades, shields, speed boosts, extra lives, and piercing fireballs
- **Chiptune Soundtrack**: Original music by Juhani Junkala (CC0)
- **Mobile Support**: Touch controls with relative drag movement
- **High Score Tracking**: Local storage saves your best runs

## Controls

**Desktop:**
- WASD / Arrow Keys - Move
- Space - Fire
- Z - Skip to boss (debug)
- X - Skip level (debug)

**Mobile:**
- Touch and drag to move (relative movement)
- Auto-fire enabled

## Enemies

- **Small**: Fast-moving fodder
- **Medium**: Can shoot back at you
- **Big**: Tracks your position, tanky

## Tech Stack

- Phaser 3.60
- Vanilla JavaScript (ES6 modules)
- Pixel art assets from Legacy Collection

## Running Locally

```bash
# Serve with any static file server
npx serve .
```

Then open http://localhost:3000

## Credits

- Music: Juhani Junkala (CC0 License)
- Sprites: Legacy Collection
