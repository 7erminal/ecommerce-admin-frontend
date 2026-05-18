import React, { useMemo, useState } from "react";

type ItemRecord = {
    id: string;
    name: string;
    category: string;
    purpose?: string;
    feature?: string;
    amount: number;
    currency: string;
    description: string;
    colors: string[];
    sizes: string[];
    weightKg: number;
    sku: string;
    stockQty: number;
    status: "Active" | "Draft" | "Archived";
    image: string;
};

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
    status: "Active" | "Draft" | "Archived";
    image: string;
};

const initialItems: ItemRecord[] = [
    {
        id: "item-1",
        name: "Urban Travel Backpack",
        category: "Bags",
        purpose: "Travel",
        feature: "Waterproof",
        amount: 79.99,
        currency: "USD",
        description: "Durable commuter backpack with laptop sleeve and anti-theft pocket.",
        colors: ["Black", "Red", "Gray"],
        sizes: ["Standard"],
        weightKg: 0.9,
        sku: "BAG-UTB-001",
        stockQty: 120,
        status: "Active",
        image: "/placeholder.png",
    },
    {
        id: "item-2",
        name: "Performance Running Shoe",
        category: "Footwear",
        purpose: "Outdoor",
        feature: "Breathable",
        amount: 109.5,
        currency: "USD",
        description: "Lightweight running shoe with responsive cushioning for daily training.",
        colors: ["White", "Red"],
        sizes: ["40", "41", "42", "43"],
        weightKg: 0.6,
        sku: "SHO-PRS-042",
        stockQty: 86,
        status: "Active",
        image: "/placeholder.png",
    },
    {
        id: "item-3",
        name: "Minimal Desk Lamp",
        category: "Home",
        purpose: "Office Use",
        feature: "Dimmable",
        amount: 44.0,
        currency: "USD",
        description: "2D-inspired matte desk lamp with adjustable neck and warm LED profile.",
        colors: ["Red", "Cream"],
        sizes: ["Small", "Medium"],
        weightKg: 1.2,
        sku: "HOM-MDL-210",
        stockQty: 42,
        status: "Draft",
        image: "/placeholder.png",
    },
];

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
    image: "",
};

const ItemsPage: React.FC = () => {
    const [items, setItems] = useState<ItemRecord[]>(initialItems);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Draft" | "Archived">("All");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<ItemFormState>(defaultFormState);

    const totalValue = useMemo(
        () => items.reduce((sum, item) => sum + item.amount*item.stockQty, 0),
        [items]
    );

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesQuery =
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase()) ||
                item.sku.toLowerCase().includes(query.toLowerCase());
            const matchesStatus = statusFilter === "All" || item.status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    }, [items, query, statusFilter]);

    const openAddModal = () => {
        setEditingId(null);
        setFormState(defaultFormState);
        setShowModal(true);
    };

    const openEditModal = (item: ItemRecord) => {
        setEditingId(item.id);
        setFormState({
            name: item.name,
            category: item.category,
            purpose: item.purpose || "",
            feature: item.feature || "",
            amount: String(item.amount),
            currency: item.currency,
            description: item.description,
            colors: item.colors.join(", "),
            sizes: item.sizes.join(", "),
            weightKg: String(item.weightKg),
            sku: item.sku,
            stockQty: String(item.stockQty),
            status: item.status,
            image: item.image,
        });
        setShowModal(true);
    };

    const handleSaveItem = () => {
        if (!formState.name.trim() || !formState.category.trim() || !formState.amount.trim() || !formState.description.trim()) {
            return;
        }

        const payload: ItemRecord = {
            id: editingId || `item-${Date.now()}`,
            name: formState.name.trim(),
            category: formState.category.trim(),
            purpose: formState.purpose.trim() || undefined,
            feature: formState.feature.trim() || undefined,
            amount: Number(formState.amount),
            currency: formState.currency.trim() || "USD",
            description: formState.description.trim(),
            colors: formState.colors
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
            sizes: formState.sizes
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
            weightKg: Number(formState.weightKg || 0),
            sku: formState.sku.trim() || `SKU-${Date.now()}`,
            stockQty: Number(formState.stockQty || 0),
            status: formState.status,
            image: formState.image.trim() || "/placeholder.png",
        };

        if (editingId) {
            setItems((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
        } else {
            setItems((prev) => [payload, ...prev]);
        }

        setShowModal(false);
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
                <p className="text-2xl font-bold text-gray-800 mt-2">{items.length}</p>
            </div>
            <div className="bg-white border border-red-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Active Items</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{items.filter((i) => i.status === "Active").length}</p>
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
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 rounded-md w-fit" style={{
                                    backgroundColor: item.status === "Active" ? "#fee2e2" : item.status === "Draft" ? "#fef3c7" : "#e5e7eb",
                                    color: item.status === "Active" ? "#b91c1c" : item.status === "Draft" ? "#92400e" : "#374151",
                                }}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                                <div><span className="text-gray-500">Category:</span> <span className="font-medium text-gray-800">{item.category}</span></div>
                                <div><span className="text-gray-500">Purpose:</span> <span className="font-medium text-gray-800">{item.purpose || "-"}</span></div>
                                <div><span className="text-gray-500">Feature:</span> <span className="font-medium text-gray-800">{item.feature || "-"}</span></div>
                                <div><span className="text-gray-500">Weight:</span> <span className="font-medium text-gray-800">{item.weightKg} kg</span></div>
                                <div><span className="text-gray-500">Amount:</span> <span className="font-medium text-gray-800">{item.currency} {item.amount.toFixed(2)}</span></div>
                                <div><span className="text-gray-500">Stock:</span> <span className="font-medium text-gray-800">{item.stockQty}</span></div>
                                <div><span className="text-gray-500">Colors:</span> <span className="font-medium text-gray-800">{item.colors.join(", ") || "-"}</span></div>
                                <div><span className="text-gray-500">Sizes:</span> <span className="font-medium text-gray-800">{item.sizes.join(", ") || "-"}</span></div>
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
                        <input value={formState.category} onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category *" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.purpose} onChange={(e) => setFormState((prev) => ({ ...prev, purpose: e.target.value }))} placeholder="Purpose (optional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        <input value={formState.feature} onChange={(e) => setFormState((prev) => ({ ...prev, feature: e.target.value }))} placeholder="Feature (optional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
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
                        <input value={formState.image} onChange={(e) => setFormState((prev) => ({ ...prev, image: e.target.value }))} placeholder="Image URL (optional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" />
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