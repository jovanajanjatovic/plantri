import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

const AddCategoryModal = ({ isOpen, onClose, fetchCategories }) => {
    const { user } = useAuth();
    const [category, setCategory] = useState("");

    if (!isOpen) return null;

    const handleSave = async () => {
        if (category.trim() === "") {
            alert("Category name cannot be empty.");
            return;
        }

        try {
            await addDoc(collection(db, "categories"), {
                name: category.trim(),
                owner: user.uid,
                createdAt: serverTimestamp(),
            });

            setCategory("");
            onClose();

            if (fetchCategories) {
                fetchCategories();
            }
        } catch (error) {
            console.error("Error adding category:", error);
            alert("Failed to add category.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Categories
                </h2>

                <label className="block mb-1 text-gray-700 dark:text-gray-300">Category</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

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

export default AddCategoryModal;