import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'resolutions';

/**
 * Create a new resolution in Firestore.
 */
export async function createResolution(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        current: 0,
        entries: [],
        createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data, current: 0, entries: [] };
}

/**
 * Get all resolutions for a specific user.
 */
export async function getResolutions(userId) {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

/**
 * Get a single resolution by ID.
 */
export async function getResolution(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}

/**
 * Update a resolution.
 */
export async function updateResolution(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
    const updatedSnap = await getDoc(docRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
}

/**
 * Delete a resolution.
 */
export async function deleteResolution(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}

/**
 * Log a progress entry.
 */
export async function logProgress(resolutionId, entry) {
    const resolution = await getResolution(resolutionId);
    if (!resolution) throw new Error('Resolution not found');

    const newEntry = {
        id: crypto.randomUUID(),
        amount: Number(entry.amount),
        note: entry.note || '',
        date: new Date().toISOString(),
    };

    const updatedEntries = [...(resolution.entries || []), newEntry];
    const newCurrent = updatedEntries.reduce((sum, e) => sum + e.amount, 0);

    const docRef = doc(db, COLLECTION_NAME, resolutionId);
    await updateDoc(docRef, {
        entries: updatedEntries,
        current: newCurrent
    });

    return { ...resolution, entries: updatedEntries, current: newCurrent };
}

/**
 * Get progress percentage for a resolution.
 */
export function getProgressPercent(resolution) {
    if (!resolution || resolution.target <= 0) return 0;
    return Math.min(100, Math.round((resolution.current / resolution.target) * 100));
}
