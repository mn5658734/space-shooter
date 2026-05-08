import { describe, test } from 'vitest';
import assert from 'node:assert';
import {
    parseStoredInt,
    computeTotalWaveIndex,
    mergeHighScore,
    mergeBestLevel,
    mergeBestWave
} from '../src/persistenceLogic.js';

describe('parseStoredInt', () => {
    test('parses numeric strings', () => {
        assert.strictEqual(parseStoredInt('42', 0), 42);
        assert.strictEqual(parseStoredInt('0', 99), 0);
    });

    test('returns fallback for null, empty, or NaN', () => {
        assert.strictEqual(parseStoredInt(null, 7), 7);
        assert.strictEqual(parseStoredInt(undefined, 7), 7);
        assert.strictEqual(parseStoredInt('', 7), 7);
        assert.strictEqual(parseStoredInt('abc', 7), 7);
    });
});

describe('computeTotalWaveIndex', () => {
    test('matches level-one intro layout (2 waves per level)', () => {
        assert.strictEqual(computeTotalWaveIndex(1, 1, 2), 1);
        assert.strictEqual(computeTotalWaveIndex(1, 2, 2), 2);
    });

    test('indexes across levels with three waves per level', () => {
        assert.strictEqual(computeTotalWaveIndex(2, 1, 3), 4);
        assert.strictEqual(computeTotalWaveIndex(3, 3, 3), 9);
    });
});

describe('mergeHighScore', () => {
    test('updates when candidate beats stored value', () => {
        const r = mergeHighScore('1000', 1500);
        assert.strictEqual(r.nextHighScore, 1500);
        assert.strictEqual(r.isNewRecord, true);
    });

    test('keeps stored value when candidate is lower or equal', () => {
        assert.deepStrictEqual(mergeHighScore('2000', 1500), {
            nextHighScore: 2000,
            isNewRecord: false
        });
        assert.deepStrictEqual(mergeHighScore('500', 500), {
            nextHighScore: 500,
            isNewRecord: false
        });
    });

    test('treats missing storage as zero', () => {
        assert.deepStrictEqual(mergeHighScore(null, 10), {
            nextHighScore: 10,
            isNewRecord: true
        });
    });
});

describe('mergeBestLevel', () => {
    test('improves when current level exceeds stored', () => {
        assert.deepStrictEqual(mergeBestLevel('1', 2), {
            nextBestLevel: 2,
            improved: true
        });
    });

    test('does not regress stored progress', () => {
        assert.deepStrictEqual(mergeBestLevel('3', 2), {
            nextBestLevel: 3,
            improved: false
        });
    });
});

describe('mergeBestWave', () => {
    test('improves when total wave index increases', () => {
        assert.deepStrictEqual(mergeBestWave('5', 8), {
            nextBestWave: 8,
            improved: true
        });
    });

    test('keeps previous best when not surpassed', () => {
        assert.deepStrictEqual(mergeBestWave('10', 4), {
            nextBestWave: 10,
            improved: false
        });
    });
});
