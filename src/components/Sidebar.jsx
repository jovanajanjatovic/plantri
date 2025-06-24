import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import ProfileSettingsModal from "./ProfileSettingsModal";
import { useState } from "react";
import Categories from "./Categories";
import AddCategoryModal from "./AddCategoryModal";
import { ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ categories, user, fetchCategories, activeCategory, setActiveCategory }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <aside className="w-full md:w-64 bg-white shadow-md flex flex-col justify-between">
            <div>
                <div className="flex flex-col items-center py-6">
                    <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full mb-2"
                    />
                    <p className="font-semibold text-gray-800">
                        {user.username || user.displayName}
                    </p>
                </div>

                <Categories
                    categories={categories}
                    onAddCategory={() => setIsCategoryModalOpen(true)}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            </div>

            <div className="px-4 py-4 border-t">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 text-left text-red-500 hover:text-red-700 mb-2 cursor-pointer"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center space-x-2 text-left text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Settings</span>
                </button>
            </div>

            <ProfileSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <AddCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} fetchCategories={fetchCategories} />
        </aside>
    );
};

export default Sidebar;