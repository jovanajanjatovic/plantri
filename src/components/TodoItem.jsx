import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const TodoItem = ({ todo, onToggleStatus, onDelete, onEdit }) => {

    const handleChange = async () => {
        onToggleStatus(todo.id);

        try {
            const todoRef = doc(db, "todos", todo.id);
            await updateDoc(todoRef, { completed: !todo.completed });
        } catch (error) {
            console.error("Error updating todo item status:", error);
            alert("Failed to update todo item status.");
        }
    };

    return (
        <li className="bg-white p-4 rounded shadow flex justify-between items-start">
            <div className="flex items-start space-x-3 min-w-0">
                <input
                    type="checkbox"
                    className="flex-shrink-0 w-5 h-5 cursor-pointer mt-1"
                    checked={todo.completed}
                    onChange={handleChange}
                />
                <div className="min-w-0">
                    <p className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.title}
                    </p>
                    {todo.description && (
                        <p className="text-sm text-gray-500">{todo.description}</p>
                    )}
                </div>
            </div>

            <div className="flex space-x-2 flex-shrink-0 self-start ml-6">
                <button
                    onClick={onEdit}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    aria-label="Edit todo"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={onDelete}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    aria-label="Delete todo"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </li>
    );
};

export default TodoItem;