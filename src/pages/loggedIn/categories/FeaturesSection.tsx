import React, { useState } from "react";

type FeatureRecord = {
    id: string;
    name: string;
    description: string;
    image: string;
};

const initialFeatures: FeatureRecord[] = [
    { id: "ft-1", name: "Color", description: "Use this to classify items by available color variants.", image: "/placeholder.png" },
    { id: "ft-2", name: "Material", description: "Group items by composition such as cotton, wood, or leather.", image: "/placeholder.png" },
    { id: "ft-3", name: "Size", description: "Attach dimensions or sizing options for better product filtering.", image: "/placeholder.png" },
    { id: "ft-4", name: "Compatibility", description: "Define compatible models, systems, or environments for each item.", image: "/placeholder.png" },
];

const FeaturesSection: React.FC = () => {
    const [features, setFeatures] = useState<FeatureRecord[]>(initialFeatures);
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

    const openEdit = (entry: FeatureRecord) => {
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
        const payload: FeatureRecord = {
            id: editingId || `ft-${Date.now()}`,
            name: name.trim(),
            description: description.trim(),
            image: image.trim() || "/placeholder.png",
        };
        if (editingId) {
            setFeatures((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
        } else {
            setFeatures((prev) => [payload, ...prev]);
        }
        setShowModal(false);
    };

    return <div className="p-6">
        <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Features</h2>
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
                    Add Feature
                </button>
            </div>
            <div className="space-y-4">
                {features.map((entry, index) => (
                    <div key={entry.id} className={`flex items-start gap-4 p-4 ${index !== features.length - 1 ? "border-b border-gray-200" : ""}`}>
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
                        <h3 className="text-lg font-semibold text-gray-800">{editingId ? "Edit Feature" : "Add Feature"}</h3>
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
                            {editingId ? "Save Changes" : "Add Feature"}
                        </button>
                    </div>
                </div>
            </div>
        ) : null}
    </div>
}

export default FeaturesSection;