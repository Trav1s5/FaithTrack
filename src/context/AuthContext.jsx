import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function register(name, email, password, church) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            church,
            createdAt: new Date().toISOString()
        });
        // Update local state immediately for UI responsiveness
        setCurrentUser({ ...user, name, church });
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("AuthContext: User authenticated:", user.uid);
                // Fetch additional user details from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        console.log("AuthContext: User profile found:", userDoc.data());
                        setCurrentUser({ ...user, ...userDoc.data() });
                    } else {
                        console.log("AuthContext: User profile NOT found in Firestore");
                        setCurrentUser(user);
                    }
                } catch (error) {
                    console.error("AuthContext: Error fetching user profile:", error);
                    setCurrentUser(user);
                }
            } else {
                console.log("AuthContext: User signed out");
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0a1a',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    Loading FaithTrack...
                </div>
            )}
        </AuthContext.Provider>
    );
}
