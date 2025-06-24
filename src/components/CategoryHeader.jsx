import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import ConfirmModal from "./ConfirmModal";

const CategoryHeader = ({ activeCategory, updateCategoryName, onDeleteCategory }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategoryName, setEditedCategoryName] = useState("");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleEditClick = () => {
        if (activeCategory) {
            setIsEditing(true);
            setEditedCategoryName(activeCategory.name);
        }
    };

    const handleSave = async () => {
        try {
            const categoryRef = doc(db, "categories", activeCategory.id);
            await updateDoc(categoryRef, { name: editedCategoryName });
            updateCategoryName(activeCategory.id, editedCategoryName);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Failed to update category.");
        }
    };

    return (
        <div className="flex justify-between items-center mb-4">

            {isEditing ? (
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <h2 className="text-2xl text-blue-600 font-bold">
                    {activeCategory?.name || 'Select category'}
                </h2>
            )}

            {activeCategory && (
                <div className="flex space-x-2">
                    {!isEditing && (
                        <>
                            <button
                                onClick={handleEditClick}
                                className="cursor-pointer text-blue-600 hover:text-blue-800"
                                aria-label="Edit category"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsConfirmModalOpen(true)}
                                className="cursor-pointer text-red-600 hover:text-red-800"
                                aria-label="Delete category"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => onDeleteCategory(activeCategory?.id)}
                title="Delete Category"
                message={`Are you sure you want to delete the category "${activeCategory?.name}"? All todo items in this category will also be deleted.`}
            />

        </div>
    );
};

export default CategoryHeader;