import React, { useContext, useEffect, useMemo, useState } from "react";
import ApplicationContext from "../../../resources/providers/ApplicationContext";
import type { AddItem, Item } from "../../../resources/types/applicationTypes";
import MultiImageUploadWithCrop from "../components/MultiImageUploadWithCrop";

type ItemFormState = {
    name: string;
    category: string;
    purpose: string;
    feature: string;
    amount: string;
    currency: string;
    description: string;
    colors: string;
    sizes: string;
    weightKg: string;
    sku: string;
    stockQty: string;
    status: string;
};

const defaultFormState: ItemFormState = {
    name: "",
    category: "",
    purpose: "",
    feature: "",
    amount: "",
    currency: "USD",
    description: "",
    colors: "",
    sizes: "",
    weightKg: "",
    sku: "",
    stockQty: "",
    status: "Active",
};

const ItemsPage: React.FC = () => {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft" | "Archived">("All");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<ItemFormState>(defaultFormState);
    const [images, setImages] = useState<File[]>([]);

    const applicationContext = useContext(ApplicationContext);
    const items = Array.isArray(applicationContext?.items) ? applicationContext.items : [];

    useEffect(()=>{
        document.title = "Home"
        if (!applicationContext) {
            return;
        }
        getItems();
    }, [])

    const getItems = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext!.fetchItems();
        applicationContext!.fetchCategories();
        applicationContext!.fetchFeatures();
        applicationContext!.fetchPurposes();
    }

    const totalValue = useMemo(
        () => items.reduce((sum, item) => sum + item.ProductPrice*item.Quantity, 0),
        [items]
    );

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesQuery =
                item.ProductName.toLowerCase().includes(query.toLowerCase()) ||
                item.Category?.CategoryName.toLowerCase().includes(query.toLowerCase()) ||
                item.ProductId.toString().toLowerCase().includes(query.toLowerCase());
            const matchesStatus = statusFilter === "All" || item.Status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    }, [items, query, statusFilter]);

    const openAddModal = () => {
        setEditingId(null);
        setFormState(defaultFormState);
        setImages([]);
        setShowModal(true);
    };

    const openEditModal = (item: Item) => {
        setEditingId(item.ProductId.toString());
        setFormState({
            name: item.ProductName,
            category: item.Category?.CategoryId?.toString() || "",
            purpose: item.Purposes && item.Purposes.length > 0 ? item.Purposes[0].PurposeId.toString() : "",
            feature: item.Features && item.Features.length > 0 ? item.Features[0].FeatureId.toString() : "",
            amount: String(item.ProductPrice),
            currency: "GHC",
            description: item.Description,
            colors: item.AvailableColors?.join(", ") || "",
            sizes: item.AvailableSizes?.join(", ") || "",
            weightKg: item.Weight ? item.Weight.replace(" kg", "") : "",
            sku: item.ProductId.toString(),
            stockQty: String(item.Quantity),
            status: item.Status,
        });
        setImages([]);
        setShowModal(true);
    };

    const handleSaveItem = async () => {
        if (!formState.name.trim() || !formState.category.trim() || !formState.amount.trim() || !formState.description.trim()) {
            return;
        }

        const uploadedImagePaths: string[] = [];
        for (const imageFile of images) {
            const uploadResp = await applicationContext?.uploadItemImage(imageFile);
            if (uploadResp?.Success && uploadResp.Result) {
                uploadedImagePaths.push(uploadResp.Result);
            }
        }

        const payload: AddItem = {
            ImagePath: uploadedImagePaths[0] || "",
            ImagePaths: uploadedImagePaths.length > 0 ? uploadedImagePaths : undefined,
            ProductName: formState.name.trim(),
            Description: formState.description.trim(),
            Purposes: formState.purpose ? [Number(formState.purpose)] : undefined,
            Features: formState.feature ? [Number(formState.feature)] : undefined,
            AvailableSizes: formState.sizes ? formState.sizes.split(",").map(s => s.trim()) : undefined,
            AvailableColors: formState.colors ? formState.colors.split(",").map(c => c.trim()) : undefined,
            Quantity: Number(formState.stockQty) || 0,
            CostPrice: 0, // This can be extended to include cost price in the form
            SellingPrice: Number(formState.amount) || 0,
            QuantityAlert: 10, // This can be extended to include quantity alert in the form
            Weight: formState.weightKg ? `${formState.weightKg} kg` : "0 kg",
            CategoryId: formState.category ? Number(formState.category) : undefined,
        };

        const resp = await applicationContext?.addItem(payload);
        if (resp?.Success) {
            // Handle success (e.g., show a success message, refresh the list)
            setShowModal(false);
            getItems(); // Refresh the items list after adding/updating
        } else {
            // Handle error (e.g., show an error message)
        }
        setImages([]);
    };

    return <div className="flex flex-col whitespace-normal p-6 gap-6">
        <section className="bg-white border border-red-100 rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Items Catalog</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage products, attributes, pricing and stock. Backend integration can replace this local dummy dataset later.</p>
                </div>
                <button
                    onClick={openAddModal}
                    style={{
                        background: "#c53030",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontWeight: 600,
                        textAlign: "center",
                        border: "2px solid #c53030",
                    }}
                >
                    Add Item
                </button>
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-red-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{applicationContext?.itemCount}</p>
            </div>
            <div className="bg-white border border-red-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Active Items</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{items.filter((i) => i.Status === "Active").length}</p>
            </div>
            <div className="bg-white border border-red-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">${totalValue.toFixed(2)}</p>
            </div>
        </section>

        <section className="bg-white border border-red-100 rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, category, or SKU"
                    className="w-full md:max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Draft" | "Archived")}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>
        </section>

        <section className="space-y-4">
            {filteredItems.map((item) => (
                <div key={item.ProductId.toString()} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <img src={item.ImagePath} alt={item.ProductName} className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{item.ProductName}</h3>
                                    <p className="text-xs text-gray-500">SKU: {item.ProductId.toString()}</p>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 rounded-md w-fit" style={{
                                    backgroundColor: item.Status === "Active" ? "#fee2e2" : item.Status === "Draft" ? "#fef3c7" : "#e5e7eb",
                                    color: item.Status === "Active" ? "#b91c1c" : item.Status === "Draft" ? "#92400e" : "#374151",
                                }}>
                                    {item.Status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{item.Description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                                <div><span className="text-gray-500">Category:</span> <span className="font-medium text-gray-800">{item.Category?.CategoryName}</span></div>
                                <div><span className="text-gray-500">Purpose:</span> 
                                    {
                                        item.Purposes && item.Purposes.length > 0 ? (
                                            <span className="font-medium text-gray-800">{item.Purposes.map(p => p.Purpose).join(", ")}</span>
                                        ) : (
                                            <span className="font-medium text-gray-800">-</span>
                                        )
                                    }
                                </div>
                                <div><span className="text-gray-500">Feature:</span> 
                                    {
                                        item.Features && item.Features.length > 0 ? (
                                            <span className="font-medium text-gray-800">{item.Features.map(f => f.FeatureName).join(", ")}</span>
                                        ) : (
                                            <span className="font-medium text-gray-800">-</span>
                                        )
                                    }
                                </div>
                                <div><span className="text-gray-500">Weight:</span> <span className="font-medium text-gray-800">{item.Weight} kg</span></div>
                                <div><span className="text-gray-500">Amount:</span> <span className="font-medium text-gray-800">GHC {item.ProductPrice.toFixed(2)}</span></div>
                                <div><span className="text-gray-500">Stock:</span> <span className="font-medium text-gray-800">{item.Quantity}</span></div>
                                <div><span className="text-gray-500">Colors:</span> <span className="font-medium text-gray-800">{item.AvailableColors?.join(", ") || "-"}</span></div>
                                <div><span className="text-gray-500">Sizes:</span> <span className="font-medium text-gray-800">{item.AvailableSizes?.join(", ") || "-"}</span></div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium border"
                                    style={{ borderColor: "#c53030", color: "#c53030" }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                                    style={{ backgroundColor: "#c53030" }}
                                >
                                    Configure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {filteredItems.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                    No items match your current filter.
                </div>
            ) : null}
        </section>

        {showModal ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white w-full max-w-3xl rounded-xl border border-red-100 p-5 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{editingId ? "Edit Item" : "Add Item"}</h3>
                        <button onClick={() => setShowModal(false)} className="text-sm text-gray-500">Close</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input value={formState.name} onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name *" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <select value={formState.category} onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                            <option value="">Select Category</option>
                            {
                                applicationContext?.categories.map((cat) => (
                                    <option key={cat.CategoryId.toString()} value={cat.CategoryId.toString()}>{cat.CategoryName}</option>
                                ))
                            }
                        </select>
                        <select value={formState.purpose} onChange={(e) => setFormState((prev) => ({ ...prev, purpose: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                            <option value="">Select purpose</option>
                            {
                                applicationContext?.purposes.map((purpose) => (
                                    <option key={purpose.PurposeId.toString()} value={purpose.PurposeId.toString()}>{purpose.Purpose}</option>
                                ))
                            }
                        </select>
                        <select value={formState.feature} onChange={(e) => setFormState((prev) => ({ ...prev, feature: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                            <option value="">Select feature</option>
                            {
                                applicationContext?.features.map((feature) => (
                                    <option key={feature.FeatureId.toString()} value={feature.FeatureId.toString()}>{feature.FeatureName}</option>
                                ))
                            }
                        </select>
                        <input value={formState.amount} type="number" onChange={(e) => setFormState((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Amount *" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.currency} onChange={(e) => setFormState((prev) => ({ ...prev, currency: e.target.value }))} placeholder="Currency" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.colors} onChange={(e) => setFormState((prev) => ({ ...prev, colors: e.target.value }))} placeholder="Colors (comma separated)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.sizes} onChange={(e) => setFormState((prev) => ({ ...prev, sizes: e.target.value }))} placeholder="Sizes (comma separated)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.weightKg} type="number" onChange={(e) => setFormState((prev) => ({ ...prev, weightKg: e.target.value }))} placeholder="Weight (kg)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.stockQty} type="number" onChange={(e) => setFormState((prev) => ({ ...prev, stockQty: e.target.value }))} placeholder="Stock quantity" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.sku} onChange={(e) => setFormState((prev) => ({ ...prev, sku: e.target.value }))} placeholder="SKU" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <select value={formState.status} onChange={(e) => setFormState((prev) => ({ ...prev, status: e.target.value as "Active" | "Draft" | "Archived" }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                        </select>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-700 mb-2">Images (you can add multiple and crop each one)</p>
                            <MultiImageUploadWithCrop onImagesChange={setImages} />
                        </div>
                        <textarea value={formState.description} onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description *" rows={4} className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" />
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
                        <button onClick={handleSaveItem} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#c53030" }}>
                            {editingId ? "Save Changes" : "Add Item"}
                        </button>
                    </div>
                </div>
            </div>
        ) : null}
    </div>
}

export default ItemsPage;