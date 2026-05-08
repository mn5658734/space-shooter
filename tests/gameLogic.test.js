import { describe, test } from 'vitest';
import assert from 'node:assert';
import {
    calculateEnemyCount,
    calculateSpawnDelay,
    getEnemyProbabilities,
    calculateBossHP,
    calculateBigEnemyHealth,
    getWavesPerLevel,
    isValidLevel,
    calculateHealthBarWidth,
    DAMAGE,
    SCORE,
    POWERUP
} from '../src/gameLogic.js';

describe('Enemy Spawning', () => {
    test('calculateEnemyCount increases with level and wave', () => {
        const l1w1 = calculateEnemyCount(1, 1);
        const l1w2 = calculateEnemyCount(1, 2);
        const l2w1 = calculateEnemyCount(2, 1);
        const l3w1 = calculateEnemyCount(3, 1);

        assert.ok(l1w2 > l1w1, 'Wave 2 should have more enemies than wave 1');
        assert.ok(l2w1 > l1w1, 'Level 2 should have more enemies than level 1');
        assert.ok(l3w1 > l2w1, 'Level 3 should have more enemies than level 2');
    });

    test('calculateEnemyCount adds bonus for level 2 and 3', () => {
        // Level 2 gets +4, Level 3 gets +6
        const base = 8 + (1 * 4) + (1 * 4); // level 1, wave 1
        const l2base = 8 + (2 * 4) + (1 * 4);
        const l3base = 8 + (3 * 4) + (1 * 4);

        assert.strictEqual(calculateEnemyCount(1, 1), base);
        assert.strictEqual(calculateEnemyCount(2, 1), l2base + 4);
        assert.strictEqual(calculateEnemyCount(3, 1), l3base + 6);
    });

    test('calculateSpawnDelay decreases with level', () => {
        const l1 = calculateSpawnDelay(1, 1);
        const l2 = calculateSpawnDelay(2, 1);
        const l3 = calculateSpawnDelay(3, 1);

        assert.ok(l2 < l1, 'Level 2 should have faster spawns');
        assert.ok(l3 < l2, 'Level 3 should have fastest spawns');
    });

    test('calculateSpawnDelay has minimum values', () => {
        const l3w10 = calculateSpawnDelay(3, 10);
        assert.ok(l3w10 >= 180, 'Spawn delay should not go below 180ms');
    });

    test('calculateSpawnDelay respects global floor on levels 1–2', () => {
        const floorCase = calculateSpawnDelay(1, 99);
        assert.ok(floorCase >= 250, 'Levels 1–2 should not spawn faster than 250ms');
    });
});

describe('Enemy Probabilities', () => {
    test('probabilities sum to 1', () => {
        for (let level = 1; level <= 3; level++) {
            for (let wave = 1; wave <= 5; wave++) {
                const { bigChance, mediumChance, smallChance } = getEnemyProbabilities(level, wave);
                const total = bigChance + mediumChance + smallChance;
                assert.ok(Math.abs(total - 1) < 0.001, `Probabilities should sum to 1 for L${level}W${wave}`);
            }
        }
    });

    test('big enemy chance is capped at 30%', () => {
        const { bigChance } = getEnemyProbabilities(3, 10);
        assert.ok(bigChance <= 0.30, 'Big chance should be capped at 30%');
    });

    test('medium enemy chance is capped at 50%', () => {
        const { mediumChance } = getEnemyProbabilities(3, 10);
        assert.ok(mediumChance <= 0.50, 'Medium chance should be capped at 50%');
    });
});

describe('Boss and Enemy Stats', () => {
    test('calculateBossHP returns correct values', () => {
        assert.strictEqual(calculateBossHP(1), 50);
        assert.strictEqual(calculateBossHP(2), 75);
        assert.strictEqual(calculateBossHP(3), 100);
    });

    test('calculateBossHP defaults for unknown level', () => {
        assert.strictEqual(calculateBossHP(0), 50);
        assert.strictEqual(calculateBossHP(99), 50);
    });

    test('calculateBigEnemyHealth increases with level', () => {
        assert.strictEqual(calculateBigEnemyHealth(1), 4);
        assert.strictEqual(calculateBigEnemyHealth(2), 5);
        assert.strictEqual(calculateBigEnemyHealth(3), 6);
    });
});

describe('Wave System', () => {
    test('getWavesPerLevel returns correct counts', () => {
        assert.strictEqual(getWavesPerLevel(1), 2, 'Level 1 should have 2 waves');
        assert.strictEqual(getWavesPerLevel(2), 3, 'Level 2 should have 3 waves');
        assert.strictEqual(getWavesPerLevel(3), 3, 'Level 3 should have 3 waves');
    });

    test('isValidLevel validates level range', () => {
        assert.strictEqual(isValidLevel(0), false);
        assert.strictEqual(isValidLevel(1), true);
        assert.strictEqual(isValidLevel(2), true);
        assert.strictEqual(isValidLevel(3), true);
        assert.strictEqual(isValidLevel(4), false);
    });
});

describe('UI Calculations', () => {
    test('calculateHealthBarWidth scales correctly', () => {
        assert.strictEqual(calculateHealthBarWidth(100, 100), 196);
        assert.strictEqual(calculateHealthBarWidth(50, 100), 98);
        assert.strictEqual(calculateHealthBarWidth(0, 100), 0);
    });

    test('calculateHealthBarWidth does not go negative', () => {
        assert.strictEqual(calculateHealthBarWidth(-10, 100), 0);
    });

    test('calculateHealthBarWidth allows over-max health for overshield-style UI', () => {
        assert.strictEqual(calculateHealthBarWidth(150, 100), 294);
    });
});

describe('Game Constants', () => {
    test('DAMAGE values are defined', () => {
        assert.strictEqual(DAMAGE.ENEMY_COLLISION, 50);
        assert.strictEqual(DAMAGE.BOSS_COLLISION, 30);
        assert.strictEqual(DAMAGE.BULLET_HIT, 20);
    });

    test('SCORE values are defined', () => {
        assert.strictEqual(SCORE.SMALL_ENEMY, 100);
        assert.strictEqual(SCORE.MEDIUM_ENEMY, 200);
        assert.strictEqual(SCORE.BIG_ENEMY, 500);
        assert.strictEqual(SCORE.BOSS, 2000);
    });

    test('POWERUP weights sum to 1', () => {
        const total = Object.values(POWERUP.WEIGHTS).reduce((a, b) => a + b, 0);
        assert.ok(Math.abs(total - 1) < 0.001, 'Powerup weights should sum to 1');
    });
});
