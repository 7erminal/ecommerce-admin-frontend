import React, { useState, useContext } from "react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import type { AddCategory, Category } from "../../../../resources/types/applicationTypes";
import ImageUploadWithCrop from "../../components/ImageUploadWithCrop";

const CategoriesSection: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<Number | null | string>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File>();

    const appContext = useContext(ApplicationContext);

    const openAdd = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setImage(undefined);
        setShowModal(true);
    };

    const openEdit = (entry: Category) => {
        console.log("Editing entry:", entry);
        setEditingId(entry.CategoryId);
        setName(entry.CategoryName);
        setDescription(entry.Description);
        setImage(entry.ImagePath ? new File([], entry.ImagePath) : undefined);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!name.trim() || !description.trim()) {
            return;
        }
        const payload: AddCategory = {
            CategoryName: name.trim(),
            CategoryImage: image,
            CategoryDescription: description.trim(), 
        };

        const resp = await appContext?.addCategory(payload);
        if (resp?.Success) {
            // Handle success (e.g., show a success message, refresh the list)
        } else {
            // Handle error (e.g., show an error message)
        }
        setShowModal(false);
    };

    const handleDelete = async () => {
        if (!editingId) return;

        const resp = await appContext?.deleteCategory(editingId.toString());
        if (resp?.Success) {
            // Handle success (e.g., show a success message, refresh the list)
        } else {
            // Handle error (e.g., show an error message)
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
                { appContext?.categories.map((entry, index) => (
                    <div key={entry.CategoryId.toString()} className={`flex items-start gap-4 p-4 ${index !== appContext.categories.length - 1 ? "border-b border-gray-200" : ""}`}>
                        <img src={entry.ImagePath} alt={entry.CategoryName} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-800">{entry.CategoryName}</div>
                            <div className="text-sm text-gray-500">{entry.Description}</div>
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
                        <div>
                        <ImageUploadWithCrop onCropComplete={(file) => setImage(file)} />
                            {/* Preview the selected image */}
                            {
                                image && (
                                    <div className="mt-2">
                                        <img src={URL.createObjectURL(image)} alt="Selected" className="w-32 h-32 object-cover rounded-lg" />
                                    </div>
                                )
                            }
                        </div>
                        {/* <ImageUploadWithCrop onCropComplete={(file) => setImage(file)} /> */}
                        {/* <input type="file" onChange={(e) => setImage(e.target.files?.[0])} placeholder="Image (optional)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /> */}
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        {/* Delete button (only show when editing) */}
                        {editingId && (
                            <button onClick={handleDelete} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-red-500">Delete</button>
                        )}
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