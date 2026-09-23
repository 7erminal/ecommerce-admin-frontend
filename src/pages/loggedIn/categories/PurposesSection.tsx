import React, { useContext, useState } from "react";
import { Icon } from "@iconify/react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import type { AddPurpose, Purpose } from "../../../../resources/types/applicationTypes";
import ImageUploadWithCrop from "../../components/ImageUploadWithCrop";
import { Panel, EmptyState, primaryBtnClass, ghostBtnClass } from "../../components/PageUi";

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

    const purposes = appContext?.purposes ?? [];

    return <div className="flex flex-col gap-4">
        <Panel
            title="Purposes"
            description="Capture why customers reach for a product."
            action={
                <button onClick={openAdd} className={primaryBtnClass}>
                    <Icon icon="material-symbols-light:add-outline" className="h-4 w-4" />
                    Add Purpose
                </button>
            }
            scroll
        >
            {purposes.length === 0 ? (
                <EmptyState
                    icon="material-symbols-light:target-outline"
                    title="No purposes yet."
                    hint={"Use \"Add Purpose\" to create your first one."}
                />
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {purposes.map((entry) => (
                        <div
                            key={entry.PurposeId.toLocaleString()}
                            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition hover:border-red-200 hover:bg-red-50/30"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-red-50 text-sm font-semibold text-[#c53030]">
                                {entry.ImagePath ? (
                                    <img src={entry.ImagePath} alt={entry.Purpose} className="h-full w-full object-cover" />
                                ) : (
                                    <span>{(entry.Purpose || "?").charAt(0).toUpperCase()}</span>
                                )}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-gray-800">{entry.Purpose}</div>
                                <div className="truncate text-xs text-gray-500">{entry.Description}</div>
                            </div>
                            <button
                                onClick={() => openEdit(entry)}
                                className={`${ghostBtnClass} shrink-0 px-3 py-2 text-xs`}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Panel>

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