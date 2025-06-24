import { useState } from "react";
import CategoryHeader from "./CategoryHeader";
import ConfirmModal from "./ConfirmModal";
import AddTodoModal from "./AddTodoModal";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, activeCategory, updateCategoryName, onDeleteCategory, onToggleStatus, onDeleteTodo, onAddTodo, onEditTodo }) => {
    const filteredTodos = activeCategory ? todos.filter(todo => todo.category === activeCategory.id) : [];

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [todoToEdit, setTodoToEdit] = useState(null);

    const handleDeleteClick = (todo) => {
        setTodoToDelete(todo);
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setTodoToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        await onDeleteTodo(todoToDelete.id);
        handleCancelDelete();
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (todo) => {
        setTodoToEdit(todo);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setTodoToEdit(null);
        setIsEditModalOpen(false);
    };

    return (
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-100">
            <CategoryHeader
                activeCategory={activeCategory}
                updateCategoryName={updateCategoryName}
                onDeleteCategory={onDeleteCategory}
            />

            {activeCategory ? (
                filteredTodos.length > 0 ? (
                    <ul className="space-y-2">
                        {filteredTodos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggleStatus={onToggleStatus}
                                onDelete={() => handleDeleteClick(todo)}
                                onEdit={() => openEditModal(todo)}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-4">There are no todos in this category yet.</p>
                )
            ) : (
                <p className="text-red-600 mt-4 font-semibold">
                    Please create and select a category first to add todos.
                </p>
            )}

            {activeCategory && (
                <button
                    onClick={openAddModal}
                    className="cursor-pointer mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Add Todo
                </button>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Todo"
                message={`Are you sure you want to delete "${todoToDelete?.title}"?`}
            />

            <AddTodoModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onAddTodo={onAddTodo}
            />

            <AddTodoModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onEditTodo={onEditTodo}
                isEdit={true}
                todoId={todoToEdit?.id}
                initialTitle={todoToEdit?.title}
                initialDescription={todoToEdit?.description}
            />
        </main>
    );
};

export default TodoList;