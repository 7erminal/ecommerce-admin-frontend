import React, { useContext, useEffect, useMemo, useState } from "react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import type { AddCustomer, AddUser } from "../../../../resources/types/applicationTypes";

type ActiveTab = "users" | "customers";

const UserManagementPage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);
    const [activeTab, setActiveTab] = useState<ActiveTab>("users");
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [idType, setIdType] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const users = Array.isArray(applicationContext?.users) ? applicationContext.users : [];
    const customers = Array.isArray(applicationContext?.customers) ? applicationContext.customers : [];
    const currentRecords = useMemo(() => (activeTab === "users" ? users : customers), [activeTab, users, customers]);

    useEffect(()=>{
        document.title = "User Management";
        loadAll();
    }, [])

    const loadAll = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext.fetchIdTypes();
        await applicationContext.fetchUsers();
        await applicationContext.fetchCustomers();
    }

    const getUsers = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext.fetchUsers();
    }

    const getCustomers = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext.fetchCustomers();
    }

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setLocation("");
        setIdType("");
        setIdNumber("");
        setImagePath("");
    }

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    }

    const handleSave = async () => {
        if (!applicationContext) {
            return;
        }

        if (!name.trim() || !email.trim() || !phoneNumber.trim() || !location.trim() || !idType.trim() || !idNumber.trim()) {
            return;
        }

        setSubmitting(true);

        if (activeTab === "users") {
            const payload: AddUser = {
                Name: name.trim(),
                Email: email.trim(),
                PhoneNumber: phoneNumber.trim(),
                Location: location.trim(),
                IdType: idType.trim(),
                IdNumber: idNumber.trim(),
                ImagePath: imagePath.trim(),
            };

            const resp = await applicationContext.addUser(payload);
            if (resp.Success) {
                await getUsers();
                setShowModal(false);
            }
        } else {
            const payload: AddCustomer = {
                Name: name.trim(),
                Email: email.trim(),
                PhoneNumber: phoneNumber.trim(),
                Location: location.trim(),
                IdType: idType.trim(),
                IdNumber: idNumber.trim(),
                ImagePath: imagePath.trim(),
            };

            const resp = await applicationContext.addCustomer(payload);
            if (resp.Success) {
                await getCustomers();
                setShowModal(false);
            }
        }

        setSubmitting(false);
    }

    return (
        <div className="flex flex-col whitespace-normal p-4">
                <section className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveTab("users")}
                            className="text-white font-semibold py-8 px-4 rounded-lg transition duration-200 text-left"
                            style={{
                                backgroundColor: "#c53030",
                                opacity: activeTab === "users" ? 1 : 0.75,
                            }}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab("customers")}
                            className="text-white font-semibold py-8 px-4 rounded-lg transition duration-200 text-left"
                            style={{
                                backgroundColor: "#c53030",
                                opacity: activeTab === "customers" ? 1 : 0.75,
                            }}
                        >
                            Customers
                        </button>
                    </div>
                </section>
                <section>
                    <div className="bg-white border border-red-100 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {activeTab === "users" ? "Users" : "Customers"}
                            </h2>
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
                                {activeTab === "users" ? "Add User" : "Add Customer"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {currentRecords.length === 0 ? (
                                <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-500">
                                    No {activeTab} found.
                                </div>
                            ) : (
                                currentRecords.map((entry: any, index: number) => (
                                    <div key={(entry?.UserId || entry?.CustomerId || index).toString()} className={`flex items-start gap-4 p-4 ${index !== currentRecords.length - 1 ? "border-b border-gray-200" : ""}`}>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-800">{entry.FullName || "-"}</div>
                                            <div className="text-sm text-gray-500">{entry.Email || "-"}</div>
                                            <div className="text-sm text-gray-500">{entry.PhoneNumber || "-"}</div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {entry.Location || "-"} {entry.IdentificationType?.Name ? `• ${entry.IdentificationType.Name}` : ""} {entry.IdentificationNumber ? `• ${entry.IdentificationNumber}` : ""}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {showModal ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white w-full max-w-lg rounded-xl border border-red-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">{activeTab === "users" ? "Add User" : "Add Customer"}</h3>
                                <button onClick={() => setShowModal(false)} className="text-sm text-gray-500">Close</button>
                            </div>

                            <div className="space-y-3">
                                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                <input value={idType} onChange={(e) => setIdType(e.target.value)} placeholder="ID Type *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="ID Number *" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                                <input value={imagePath} onChange={(e) => setImagePath(e.target.value)} placeholder="Image Path (optional)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">Cancel</button>
                                <button
                                    onClick={handleSave}
                                    disabled={submitting}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                    style={{ backgroundColor: "#c53030" }}
                                >
                                    {submitting ? "Saving..." : activeTab === "users" ? "Add User" : "Add Customer"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>);
}

export default UserManagementPage;