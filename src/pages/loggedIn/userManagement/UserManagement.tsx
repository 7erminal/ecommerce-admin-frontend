import React, { useContext, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import type { AddCustomer, AddUser } from "../../../../resources/types/applicationTypes";
import { Panel, EmptyState, SwitchCard, primaryBtnClass } from "../../components/PageUi";

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
    const idTypes = Array.isArray(applicationContext?.idTypes) ? applicationContext.idTypes : [];
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
                IdType: idType,
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
                IdType: idType,
                IdNumber: idNumber.trim(),
                ImagePath: imagePath.trim(),
                Category: "Individual", 
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
        <div className="flex flex-col gap-4 whitespace-normal p-4 md:p-6">
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <SwitchCard
                        icon="material-symbols-light:group-outline"
                        label="Users"
                        description="Team members with access"
                        count={users.length}
                        isActive={activeTab === "users"}
                        onClick={() => setActiveTab("users")}
                    />
                    <SwitchCard
                        icon="material-symbols-light:face-outline"
                        label="Customers"
                        description="People who buy from you"
                        count={customers.length}
                        isActive={activeTab === "customers"}
                        onClick={() => setActiveTab("customers")}
                    />
                </section>

                <Panel
                    title={activeTab === "users" ? "Users" : "Customers"}
                    description={
                        activeTab === "users"
                            ? "Manage the people who can access the admin."
                            : "Everyone who has shopped with you."
                    }
                    action={
                        <button onClick={openAddModal} className={primaryBtnClass}>
                            <Icon icon="material-symbols-light:add-outline" className="h-4 w-4" />
                            {activeTab === "users" ? "Add User" : "Add Customer"}
                        </button>
                    }
                    scroll
                >
                    {currentRecords.length === 0 ? (
                        <EmptyState
                            icon={
                                activeTab === "users"
                                    ? "material-symbols-light:group-outline"
                                    : "material-symbols-light:face-outline"
                            }
                            title={`No ${activeTab} found.`}
                            hint={
                                activeTab === "users"
                                    ? "Use \"Add User\" to invite your first team member."
                                    : "Use \"Add Customer\" to record your first customer."
                            }
                        />
                    ) : (
                        <div className="space-y-3">
                            {currentRecords.map((entry: any, index: number) => (
                                <div
                                    key={(entry?.UserId || entry?.CustomerId || index).toString()}
                                    className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/30"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-red-50 text-sm font-semibold text-[#c53030]">
                                        {entry.ImagePath ? (
                                            <img src={entry.ImagePath} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            (entry.FullName || entry.Email || "?").charAt(0).toUpperCase()
                                        )}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-semibold text-gray-800">{entry.FullName || "-"}</div>
                                        <div className="truncate text-sm text-gray-500">{entry.Email || "-"}</div>
                                        <div className="truncate text-sm text-gray-500">{entry.PhoneNumber || "-"}</div>
                                        <div className="mt-1 truncate text-xs text-gray-400">
                                            {entry.Location || "-"} {entry.IdentificationType?.Name ? `• ${entry.IdentificationType.Name}` : ""} {entry.IdentificationNumber ? `• ${entry.IdentificationNumber}` : ""}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Panel>

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
                                <select value={idType} onChange={(e) => setIdType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
                                    <option value="">Select ID Type *</option>
                                    {idTypes.map((entry) => (
                                        <option key={String(entry.IdentificationTypeId)} value={String(entry.IdentificationTypeId)}>
                                            {entry.Name}{entry.Code ? ` (${entry.Code})` : ""}
                                        </option>
                                    ))}
                                </select>
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