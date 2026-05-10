/** Playable pilots — procedural art only; fan-style, not official assets. */

export const DEFAULT_CHARACTER_ID = 'doraemon';

export const CHARACTER_ORDER = ['doraemon', 'pikachu', 'jet', 'spiderman'];

/** @type {Record<string, CharacterConfig>} */
export const CHARACTERS = {
    doraemon: {
        id: 'doraemon',
        label: 'Doraemon',
        shotLabel: 'Helicopter shot',
        heroTextureBase: 'dora-hero',
        useSpritesheetHero: false,
        heroIdleAnim: 'dora-idle',
        heroThrustAnim: 'dora-thrust',
        heroScale: 1.45,
        heroBodyW: 12,
        heroBodyH: 22,
        livesIconScale: 0.72,
        previewScale: 1.65,
        previewAnimThrust: true,
        normalShot: {
            texture: 'heli-shot-0',
            anim: 'heli-spin',
            scale: 2,
            bodyW: 8,
            bodyH: 14,
            vxMul: 1,
            vyMul: 1
        },
        piercingShot: {
            texture: 'heli-disc-0',
            anim: 'heli-disc-spin',
            scale: 1.85,
            bodyW: 22,
            bodyH: 22,
            vxMul: 0.8,
            vyMul: 0.9
        },
        powerupFireballMessage: ['HELICOPTER!', 0xaaddff],
        powerupFireballTint: 0xffff66
    },
    pikachu: {
        id: 'pikachu',
        label: 'Pikachu',
        shotLabel: 'Electric shot',
        heroTextureBase: 'pika-hero',
        useSpritesheetHero: false,
        heroIdleAnim: 'pika-idle',
        heroThrustAnim: 'pika-thrust',
        heroScale: 1.45,
        heroBodyW: 12,
        heroBodyH: 22,
        livesIconScale: 0.72,
        previewScale: 1.65,
        previewAnimThrust: true,
        normalShot: {
            texture: 'volt-bolt-0',
            anim: 'volt-flicker',
            scale: 2,
            bodyW: 8,
            bodyH: 14,
            vxMul: 1,
            vyMul: 1
        },
        piercingShot: {
            texture: 'volt-mega-0',
            anim: 'volt-mega-spin',
            scale: 1.85,
            bodyW: 22,
            bodyH: 22,
            vxMul: 0.8,
            vyMul: 0.9
        },
        powerupFireballMessage: ['THUNDER!', 0xffff44],
        powerupFireballTint: 0xffff66
    },
    jet: {
        id: 'jet',
        label: 'Jet plane',
        shotLabel: 'Bullet shot',
        useSpritesheetHero: true,
        heroSheetKey: 'ship',
        heroSheetIdleFrame: 0,
        heroIdleAnim: 'jet-idle',
        heroThrustAnim: 'jet-thrust',
        heroScale: 2.55,
        heroBodyW: 10,
        heroBodyH: 17,
        livesIconScale: 1.2,
        previewScale: 3.2,
        previewAnimThrust: true,
        normalShot: {
            texture: 'laser',
            frame: 0,
            anim: null,
            scale: 2,
            bodyW: 8,
            bodyH: 14,
            vxMul: 1,
            vyMul: 1
        },
        piercingShot: {
            texture: 'fireball',
            anim: 'fireball-spin',
            scale: 1.5,
            bodyW: 20,
            bodyH: 20,
            vxMul: 0.8,
            vyMul: 0.9
        },
        powerupFireballMessage: ['HEAVY GUNS!', 0xffaa66],
        powerupFireballTint: 0xff6600
    },
    spiderman: {
        id: 'spiderman',
        label: 'Spider-Man',
        shotLabel: 'Web shot',
        heroTextureBase: 'spidey-hero',
        useSpritesheetHero: false,
        heroIdleAnim: 'spidey-idle',
        heroThrustAnim: 'spidey-thrust',
        heroScale: 1.45,
        heroBodyW: 12,
        heroBodyH: 22,
        livesIconScale: 0.72,
        previewScale: 1.65,
        previewAnimThrust: true,
        normalShot: {
            texture: 'web-shot-0',
            anim: 'web-spin',
            scale: 2,
            bodyW: 8,
            bodyH: 14,
            vxMul: 1,
            vyMul: 1
        },
        piercingShot: {
            texture: 'web-burst-0',
            anim: 'web-burst-spin',
            scale: 1.85,
            bodyW: 22,
            bodyH: 22,
            vxMul: 0.8,
            vyMul: 0.9
        },
        powerupFireballMessage: ['WEB BURST!', 0xddddff],
        powerupFireballTint: 0xccccff
    }
};

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   shotLabel: string,
 *   heroTextureBase?: string,
 *   useSpritesheetHero?: boolean,
 *   heroSheetKey?: string,
 *   heroSheetIdleFrame?: number,
 *   heroIdleAnim: string,
 *   heroThrustAnim: string,
 *   heroScale: number,
 *   heroBodyW: number,
 *   heroBodyH: number,
 *   livesIconScale: number,
 *   previewScale: number,
 *   previewAnimThrust: boolean,
 *   normalShot: ShotSpec,
 *   piercingShot: ShotSpec,
 *   powerupFireballMessage: [string, number],
 *   powerupFireballTint: number
 * }} CharacterConfig
 *
 * @typedef {{
 *   texture: string,
 *   frame?: number,
 *   anim: string | null,
 *   scale: number,
 *   bodyW: number,
 *   bodyH: number,
 *   vxMul?: number,
 *   vyMul?: number
 * }} ShotSpec
 */

export function getCharacterConfig(characterId) {
    const id = characterId && CHARACTERS[characterId] ? characterId : DEFAULT_CHARACTER_ID;
    return CHARACTERS[id];
}

export function configureHeroSprite(sprite, cfg) {
    if (cfg.useSpritesheetHero) {
        sprite.setTexture(cfg.heroSheetKey, cfg.heroSheetIdleFrame ?? 0);
    } else {
        sprite.setTexture(`${cfg.heroTextureBase}-0`);
    }
}

export function playHeroAnim(sprite, cfg, thrusting) {
    sprite.play(thrusting ? cfg.heroThrustAnim : cfg.heroIdleAnim, true);
}
