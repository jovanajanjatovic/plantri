const Categories = ({ categories, onAddCategory, activeCategory, setActiveCategory }) => {

    return (
        <div className="px-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Categories</h3>
            <ul className="space-y-1">
                {categories.map(cat => (
                    <li key={cat.id}>
                        <button onClick={() => setActiveCategory(cat)} className={`cursor-pointer w-full text-left px-3 py-2 rounded font-semibold ${activeCategory?.id === cat.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                            {cat.name}
                        </button>
                    </li>
                ))}
            </ul>

            <button onClick={onAddCategory} className="cursor-pointer mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                + Add Category
            </button>
        </div>
    );
};

export default Categories;