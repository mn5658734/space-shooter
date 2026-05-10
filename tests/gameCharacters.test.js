import { describe, test } from 'vitest';
import assert from 'node:assert';
import {
    CHARACTER_ORDER,
    DEFAULT_CHARACTER_ID,
    getCharacterConfig,
    CHARACTERS
} from '../src/gameCharacters.js';

describe('gameCharacters', () => {
    test('four selectable pilots', () => {
        assert.strictEqual(CHARACTER_ORDER.length, 4);
        assert.strictEqual(new Set(CHARACTER_ORDER).size, 4);
    });

    test('getCharacterConfig falls back for unknown id', () => {
        const cfg = getCharacterConfig('not-a-real-hero');
        assert.strictEqual(cfg.id, DEFAULT_CHARACTER_ID);
        assert.ok(CHARACTERS[cfg.id]);
    });

    test('each pilot has shot specs', () => {
        for (const id of CHARACTER_ORDER) {
            const c = CHARACTERS[id];
            assert.ok(c.normalShot.texture);
            assert.ok(c.piercingShot.texture);
            assert.ok(c.heroIdleAnim && c.heroThrustAnim);
        }
    });
});
