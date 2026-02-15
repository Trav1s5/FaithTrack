// FaithTrack Resolution Service — CRUD + progress logging via localStorage

const RESOLUTIONS_KEY = 'faithtrack_resolutions';

function getAll() {
    const raw = localStorage.getItem(RESOLUTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveAll(resolutions) {
    localStorage.setItem(RESOLUTIONS_KEY, JSON.stringify(resolutions));
}

/**
 * Create a new resolution.
 * @param {Object} data - { userId, title, category, target, unit, deadline, description }
 *   category: 'financial' | 'spiritual' | 'custom'
 *   For financial: target = amount (number), unit = currency label e.g. 'KES'
 *   For spiritual: target = total chapters (number), unit = 'chapters'
 *   For custom: target = any number, unit = custom label
 */
export function createResolution(data) {
    const all = getAll();
    const resolution = {
        id: crypto.randomUUID(),
        userId: data.userId,
        title: data.title,
        category: data.category,
        target: Number(data.target),
        unit: data.unit || '',
        deadline: data.deadline,
        description: data.description || '',
        current: 0,
        entries: [],
        createdAt: new Date().toISOString(),
    };
    all.push(resolution);
    saveAll(all);
    return resolution;
}

export function getResolutions(userId) {
    return getAll().filter(r => r.userId === userId);
}

export function getResolution(id) {
    return getAll().find(r => r.id === id) || null;
}

export function updateResolution(id, data) {
    const all = getAll();
    const idx = all.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Resolution not found');
    all[idx] = { ...all[idx], ...data };
    saveAll(all);
    return all[idx];
}

export function deleteResolution(id) {
    const all = getAll();
    saveAll(all.filter(r => r.id !== id));
}

/**
 * Log a progress entry.
 * @param {string} resolutionId
 * @param {Object} entry - { amount: number, note?: string }
 */
export function logProgress(resolutionId, entry) {
    const all = getAll();
    const idx = all.findIndex(r => r.id === resolutionId);
    if (idx === -1) throw new Error('Resolution not found');

    const progressEntry = {
        id: crypto.randomUUID(),
        amount: Number(entry.amount),
        note: entry.note || '',
        date: new Date().toISOString(),
    };

    all[idx].entries.push(progressEntry);
    all[idx].current = all[idx].entries.reduce((sum, e) => sum + e.amount, 0);
    saveAll(all);
    return all[idx];
}

/**
 * Get progress percentage for a resolution.
 */
export function getProgressPercent(resolution) {
    if (!resolution || resolution.target <= 0) return 0;
    return Math.min(100, Math.round((resolution.current / resolution.target) * 100));
}
