/**
 * Pure helpers for localStorage-backed stats (unit-testable without Phaser/DOM).
 */

export function parseStoredInt(raw, fallback = 0) {
    if (raw == null || raw === '') return fallback;
    const n = Number.parseInt(String(raw), 10);
    return Number.isFinite(n) ? n : fallback;
}

/** Linear wave index used when persisting bestWave on game over. */
export function computeTotalWaveIndex(level, wave, wavesPerLevel) {
    return (level - 1) * wavesPerLevel + wave;
}

export function mergeHighScore(storedRaw, candidateScore) {
    const prev = parseStoredInt(storedRaw, 0);
    if (candidateScore > prev) {
        return { nextHighScore: candidateScore, isNewRecord: true };
    }
    return { nextHighScore: prev, isNewRecord: false };
}

export function mergeBestLevel(storedRaw, completedLevel) {
    const prev = parseStoredInt(storedRaw, 0);
    if (completedLevel > prev) {
        return { nextBestLevel: completedLevel, improved: true };
    }
    return { nextBestLevel: prev, improved: false };
}

export function mergeBestWave(storedRaw, totalWave) {
    const prev = parseStoredInt(storedRaw, 0);
    if (totalWave > prev) {
        return { nextBestWave: totalWave, improved: true };
    }
    return { nextBestWave: prev, improved: false };
}
