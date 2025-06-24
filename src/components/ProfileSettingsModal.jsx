import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProfileSettingsModal = ({ isOpen, onClose }) => {
    const { user, refreshUser } = useAuth();
    const [username, setUsername] = useState("");
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setTheme(user.theme || "light");
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSave = async () => {
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                username,
                theme
            });
            await refreshUser();
            onClose();
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save changes.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Profile Settings
                </h2>

                <div className="flex items-center space-x-4 mb-4">
                    <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <p className="text-gray-800 dark:text-white font-medium">
                            {user.displayName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <label className="block mb-1 text-gray-700 dark:text-gray-300">Username</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="block mb-1 text-gray-700 dark:text-gray-300">Theme</label>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="cursor-pointer px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsModal;