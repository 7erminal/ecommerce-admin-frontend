import React, { useContext, useState } from "react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import type { AddPurpose, Purpose } from "../../../../resources/types/applicationTypes";
import ImageUploadWithCrop from "../../components/ImageUploadWithCrop";

const PurposesSection: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | undefined>(undefined);

    const appContext = useContext(ApplicationContext);

    const openAdd = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setImage(undefined);
        setShowModal(true);
    };

    const openEdit = (entry: Purpose) => {
        setEditingId(entry.PurposeId.toString());
        setName(entry.Purpose);
        setDescription(entry.Description);
        setImage(entry.ImagePath ? new File([], entry.ImagePath) : undefined);
        setShowModal(true);
    };

    const handleSave = async () => {
            if (!name.trim() || !description.trim()) {
                return;
            }
            const payload: AddPurpose = {
                        PurposeName: name.trim(),
                        // Description: description.trim(),
                        PurposeImage: image,
                        PurposeDescription: description.trim(), 
                    };
            
            const resp = await appContext?.addPurpose(payload);
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
                <h2 className="text-xl font-semibold text-gray-800">Purposes</h2>
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
                    Add Purpose
                </button>
            </div>
            <div className="space-y-4">
                {appContext?.purposes.map((entry, index) => (
                    <div key={entry.PurposeId.toLocaleString()} className={`flex items-start gap-4 p-4 ${index !== appContext.purposes.length - 1 ? "border-b border-gray-200" : ""}`}>
                        <img src={entry.ImagePath} alt={entry.Purpose} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-800">{entry.Purpose}</div>
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
                        <h3 className="text-lg font-semibold text-gray-800">{editingId ? "Edit Purpose" : "Add Purpose"}</h3>
                        <button onClick={() => setShowModal(false)} className="text-sm text-gray-500">Close</button>
                    </div>

                    <div className="space-y-3">
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Description *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        {/* <input type="file" onChange={(e) => setImage(e.target.files?.[0])} placeholder="Image URL (optional)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /> */}
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
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        {editingId && (
                            <button onClick={handleDelete} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-red-500">Delete</button>
                        )}
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#c53030" }}>
                            {editingId ? "Save Changes" : "Add Purpose"}
                        </button>
                    </div>
                </div>
            </div>
        ) : null}
    </div>
}

export default PurposesSection;