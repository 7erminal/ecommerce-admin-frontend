import React, { useState } from "react";

type CategoryRecord = {
    id: string;
    name: string;
    description: string;
    image: string;
};

const initialCategories: CategoryRecord[] = [
    { id: "cat-1", name: "Bags", description: "Everyday and travel bag collections.", image: "/placeholder.png" },
    { id: "cat-2", name: "Footwear", description: "Casual, formal and sport footwear lines.", image: "/placeholder.png" },
    { id: "cat-3", name: "Home", description: "Home lifestyle and utility products.", image: "/placeholder.png" },
    { id: "cat-4", name: "Accessories", description: "Complementary fashion and utility add-ons.", image: "/placeholder.png" },
];

const CategoriesSection: React.FC = () => {
    const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const openAdd = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setImage("");
        setShowModal(true);
    };

    const openEdit = (entry: CategoryRecord) => {
        setEditingId(entry.id);
        setName(entry.name);
        setDescription(entry.description);
        setImage(entry.image);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!name.trim() || !description.trim()) {
            return;
        }
        const payload: CategoryRecord = {
            id: editingId || `cat-${Date.now()}`,
            name: name.trim(),
            description: description.trim(),
            image: image.trim() || "/placeholder.png",
        };
        if (editingId) {
            setCategories((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
        } else {
            setCategories((prev) => [payload, ...prev]);
        }
        setShowModal(false);
    };

    return <div className="p-6">
        <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                <button onClick={openAdd} style={{
                  marginTop: "10px",
                  background: "#c53030",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                  border: "2px solid #c53030",
                }}>
                    Add Category
                </button>
            </div>
            <div className="space-y-4">
                {categories.map((entry, index) => (
                    <div key={entry.id} className={`flex items-start gap-4 p-4 ${index !== categories.length - 1 ? "border-b border-gray-200" : ""}`}>
                        <img src={entry.image} alt={entry.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-800">{entry.name}</div>
                            <div className="text-sm text-gray-500">{entry.description}</div>
                        </div>
                        <button
                            onClick={() => openEdit(entry)}
                            className="px-3 py-2 rounded-lg text-xs font-medium border"
                            style={{ borderColor: "#c53030", color: "#c53030" }}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </section>

        {showModal ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white w-full max-w-lg rounded-xl border border-red-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{editingId ? "Edit Category" : "Add Category"}</h3>
                        <button onClick={() => setShowModal(false)} className="text-sm text-gray-500">Close</button>
                    </div>

                    <div className="space-y-3">
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Description *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (optional)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#c53030" }}>
                            {editingId ? "Save Changes" : "Add Category"}
                        </button>
                    </div>
                </div>
            </div>
        ) : null}
    </div>
}

export default CategoriesSection;