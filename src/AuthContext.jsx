import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userRef = doc(db, "users", firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        displayName: firebaseUser.displayName || "",
                        email: firebaseUser.email || "",
                        photoURL: firebaseUser.photoURL || "",
                        username: "",
                        theme: "light",
                        createdAt: serverTimestamp(),
                    });
                    setUser({ ...firebaseUser, username: "", theme: "light" });
                } else {
                    setUser({ ...firebaseUser, ...userSnap.data() });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshUser = async () => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setUser({ ...user, ...userSnap.data() });
        }
    };

    return (
        <AuthContext.Provider value={{ user, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
