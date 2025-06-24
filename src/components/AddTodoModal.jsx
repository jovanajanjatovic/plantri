import { useState, useEffect } from "react";

const AddTodoModal = ({ isOpen, onClose, onAddTodo, initialTitle = "", initialDescription = "", isEdit = false, onEditTodo, todoId }) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);

    useEffect(() => {
        setTitle(initialTitle);
        setDescription(initialDescription);
    }, [initialTitle, initialDescription, isOpen]);

    const handleSubmit = () => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        if (isEdit) {
            onEditTodo({ id: todoId, title, description });
        } else {
            onAddTodo({ title, description });
        }
        setTitle("");
        setDescription("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">
                    {isEdit ? "Edit Todo" : "Add New Todo"}
                </h2>
                <input
                    type="text"
                    placeholder="Title"
                    className="border p-2 mb-3 w-full rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description (optional)"
                    className="border p-2 mb-3 w-full rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {isEdit ? "Save" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTodoModal;
