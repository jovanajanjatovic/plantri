import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import Sidebar from "./Sidebar";
import TodoList from "./TodoList";
import { doc, deleteDoc, addDoc, updateDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

const TodoPage = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [todos, setTodos] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    const fetchCategories = useCallback(async () => {
        if (!user) return;
        const catRef = collection(db, "categories");
        const catQuery = query(catRef, where("owner", "==", user.uid));
        const catSnap = await getDocs(catQuery);
        const fetchedCategories = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setCategories(fetchedCategories);

        if (fetchedCategories.length > 0 && !activeCategory) {
            setActiveCategory(fetchedCategories[0]);
        }
    }, [user]);

    const fetchTodos = useCallback(async () => {
        if (!user) return;
        const todoRef = collection(db, "todos");
        const todoQuery = query(todoRef, where("owner", "==", user.uid));
        const todoSnap = await getDocs(todoQuery);
        setTodos(todoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, [user]);

    const updateCategoryName = (id, newName) => {
        setCategories(prevCategories =>
            prevCategories.map(cat =>
                cat.id === id ? { ...cat, name: newName } : cat
            )
        );

        if (activeCategory?.id === id) {
            setActiveCategory(prevCategory => ({
                ...prevCategory,
                name: newName,
            }))
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const batch = writeBatch(db);

            const todosQuery = query(collection(db, "todos"), where("category", "==", categoryId));
            const todosSnapshot = await getDocs(todosQuery);

            todosSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            batch.delete(doc(db, "categories", categoryId));

            await batch.commit();

            setCategories((prevCategories) => {
                const updatedCategories = prevCategories.filter((cat) => cat.id !== categoryId);

                if (activeCategory?.id === categoryId) {
                    if (updatedCategories.length > 0) {
                        setActiveCategory(updatedCategories[0]);
                    } else {
                        setActiveCategory(null);
                    }
                }

                return updatedCategories;
            });

            setTodos((prevTodos) => prevTodos.filter((todo) => todo.categoryId !== categoryId));

        } catch (error) {
            console.error("Error deleting category and todos:", error);
            alert("Failed to delete category and todos.");
        }
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            const todoRef = doc(db, "todos", todoId);
            await deleteDoc(todoRef);

            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        } catch (error) {
            console.error("Error deleting todo item:", error);
            alert("Failed to delete todo item.");
        }
    };

    const toggleTodoStatus = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleAddTodo = async (newTodoData) => {
        if (!activeCategory) {
            alert("Please select a category first.");
            return;
        }

        try {
            const todoToSave = {
                ...newTodoData,
                completed: false,
                owner: user.uid,
                category: activeCategory.id,
                createdAt: new Date(),
            };
            const todoRef = await addDoc(collection(db, "todos"), todoToSave);
            const newTodo = { id: todoRef.id, ...todoToSave };

            setTodos(prevTodos => [...prevTodos, newTodo]);
        } catch (error) {
            console.error("Error adding new todo:", error);
            alert("Failed to add new todo.");
        }
    };

    const handleEditTodo = async ({ id, title, description }) => {
        try {
            const todoRef = doc(db, "todos", id);
            await updateDoc(todoRef, { title, description });

            setTodos(prev =>
                prev.map(todo => todo.id === id ? { ...todo, title, description } : todo)
            );
        } catch (error) {
            console.error("Error editing todo:", error);
            alert("Failed to edit todo.");
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTodos();
    }, [fetchCategories, fetchTodos]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <Sidebar
                categories={categories}
                user={user}
                fetchCategories={fetchCategories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />
            <TodoList
                todos={todos}
                activeCategory={activeCategory}
                updateCategoryName={updateCategoryName}
                onDeleteCategory={handleDeleteCategory}
                onToggleStatus={toggleTodoStatus}
                onDeleteTodo={handleDeleteTodo}
                onAddTodo={handleAddTodo}
                userId={user?.uid}
                onEditTodo={handleEditTodo}
            />
        </div>
    );
};

export default TodoPage;