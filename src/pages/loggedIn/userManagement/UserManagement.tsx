import React, { useContext, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import type { AddCustomer, AddUser, AddRole, AddPermission, Role } from "../../../../resources/types/applicationTypes";
import { Panel, EmptyState, SwitchCard, primaryBtnClass, ghostBtnClass, dangerBtnClass, inputClass, selectClass } from "../../components/PageUi";

type ActiveTab = "users" | "customers" | "roles";

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
    const [submitting, setSubmitting] = useState("");

    // Role form state
    const [roleName, setRoleName] = useState("");
    const [roleDescription, setRoleDescription] = useState("");

    // Role permissions state
    const [permissionRole, setPermissionRole] = useState<Role | null>(null);
    const [permissionRoleName, setPermissionRoleName] = useState("");
    const [permissionAction, setPermissionAction] = useState("");
    const [permissionCode, setPermissionCode] = useState("");

    const users = Array.isArray(applicationContext?.users) ? applicationContext.users : [];
    const customers = Array.isArray(applicationContext?.customers) ? applicationContext.customers : [];
    const idTypes = Array.isArray(applicationContext?.idTypes) ? applicationContext.idTypes : [];
    const roles = Array.isArray(applicationContext?.roles) ? applicationContext.roles : [];
    const actions = Array.isArray(applicationContext?.actions) ? applicationContext.actions : [];
    const permissions = Array.isArray(applicationContext?.permissions) ? applicationContext.permissions : [];
    const currentRecords = useMemo(
        () => (activeTab === "users" ? users : activeTab === "customers" ? customers : roles),
        [activeTab, users, customers, roles]
    );
    const rolePermissions = useMemo(() => {
        if (!permissionRole) {
            return [];
        }
        return permissions.filter((entry) => String(entry.Role || "").toLowerCase() === permissionRole.Role.toLowerCase());
    }, [permissionRole, permissions]);

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
        await applicationContext.fetchRoles();
        await applicationContext.fetchActions();
        await applicationContext.fetchPermissions();
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

    const getRoles = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext.fetchRoles();
    }

    const getPermissions = async () => {
        if (!applicationContext) {
            return;
        }
        await applicationContext.fetchPermissions();
    }

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setLocation("");
        setIdType("");
        setIdNumber("");
        setImagePath("");
        setRoleName("");
        setRoleDescription("");
    }

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    }

    const handleSave = async () => {
        if (!applicationContext) {
            return;
        }

        if (activeTab === "roles") {
            if (!roleName.trim()) {
                return;
            }

            setSubmitting("role");

            const payload: AddRole = {
                Role: roleName.trim(),
                Description: roleDescription.trim(),
            };

            const resp = await applicationContext.addRole(payload);
            if (resp.Success) {
                await getRoles();
                setShowModal(false);
            }

            setSubmitting("");
            return;
        }

        if (!name.trim() || !email.trim() || !phoneNumber.trim() || !location.trim() || !idType.trim() || !idNumber.trim()) {
            return;
        }

        setSubmitting("person");

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

        setSubmitting("");
    }

    const openPermissions = (role: Role) => {
        setPermissionRole(role);
        setPermissionRoleName(role.Role);
        setPermissionAction("");
        setPermissionCode("");
    }

    const closePermissions = () => {
        setPermissionRole(null);
        setPermissionRoleName("");
        setPermissionAction("");
        setPermissionCode("");
    }

    const handleAddPermission = async () => {
        if (!applicationContext) {
            return;
        }

        if (!permissionRoleName.trim() || !permissionAction.trim() || !permissionCode.trim()) {
            return;
        }

        setSubmitting("permission");

        const payload: AddPermission = {
            Role: permissionRoleName.trim(),
            Action: permissionAction.trim(),
            PermissionCode: permissionCode.trim(),
        };

        const resp = await applicationContext.addPermission(payload);
        if (resp.Success) {
            await getPermissions();
            setPermissionAction("");
            setPermissionCode("");
        }

        setSubmitting("");
    }

    const handleRemovePermission = async (entry: { Role: string; Action: string; PermissionCode: string }) => {
        if (!applicationContext) {
            return;
        }

        setSubmitting(`remove-${entry.Action}-${entry.PermissionCode}`);

        const resp = await applicationContext.removePermission({
            Role: entry.Role,
            Action: entry.Action,
            PermissionCode: entry.PermissionCode,
        });
        if (resp.Success) {
            await getPermissions();
        }

        setSubmitting("");
    }

    return (
        <div className="flex flex-col gap-4 whitespace-normal p-4 md:p-6">
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                    <SwitchCard
                        icon="material-symbols-light:shield-person-outline"
                        label="Roles"
                        description="Access levels & permissions"
                        count={roles.length}
                        isActive={activeTab === "roles"}
                        onClick={() => setActiveTab("roles")}
                    />
                </section>

                <Panel
                    title={activeTab === "users" ? "Users" : activeTab === "customers" ? "Customers" : "Roles"}
                    description={
                        activeTab === "users"
                            ? "Manage the people who can access the admin."
                            : activeTab === "customers"
                                ? "Everyone who has shopped with you."
                                : "Create roles and control what each role is allowed to do."
                    }
                    action={
                        <button onClick={openAddModal} className={primaryBtnClass}>
                            <Icon icon="material-symbols-light:add-outline" className="h-4 w-4" />
                            {activeTab === "users" ? "Add User" : activeTab === "customers" ? "Add Customer" : "Add Role"}
                        </button>
                    }
                    scroll
                >
                    {currentRecords.length === 0 ? (
                        <EmptyState
                            icon={
                                activeTab === "users"
                                    ? "material-symbols-light:group-outline"
                                    : activeTab === "customers"
                                        ? "material-symbols-light:face-outline"
                                        : "material-symbols-light:shield-person-outline"
                            }
                            title={`No ${activeTab} found.`}
                            hint={
                                activeTab === "users"
                                    ? "Use \"Add User\" to invite your first team member."
                                    : activeTab === "customers"
                                        ? "Use \"Add Customer\" to record your first customer."
                                        : "Use \"Add Role\" to create your first role."
                            }
                        />
                    ) : activeTab === "roles" ? (
                        <div className="space-y-3">
                            {(currentRecords as Array<Role>).map((entry) => {
                                const permissionCount = permissions.filter(
                                    (perm) => String(perm.Role || "").toLowerCase() === String(entry.Role || "").toLowerCase()
                                ).length;
                                return (
                                    <div
                                        key={entry.RoleId || entry.Role}
                                        className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/30"
                                    >
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#c53030]">
                                            <Icon icon="material-symbols-light:shield-person-outline" className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="truncate text-sm font-semibold text-gray-800">{entry.Role}</div>
                                                <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[#c53030]">
                                                    {permissionCount} permission{permissionCount === 1 ? "" : "s"}
                                                </span>
                                            </div>
                                            <div className="truncate text-xs text-gray-500">{entry.Description || "No description provided."}</div>
                                        </div>
                                        <button
                                            onClick={() => openPermissions(entry)}
                                            className={`${ghostBtnClass} shrink-0 px-3 py-2 text-xs`}
                                        >
                                            <Icon icon="material-symbols-light:key-outline" className="h-4 w-4" />
                                            Permissions
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
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
                        <div className="bg-white w-full max-w-lg rounded-2xl border border-red-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {activeTab === "users" ? "Add User" : activeTab === "customers" ? "Add Customer" : "Add Role"}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-sm text-gray-500 hover:text-[#c53030]">Close</button>
                            </div>

                            {activeTab === "roles" ? (
                                <div className="space-y-3">
                                    <input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Role *" className={inputClass} />
                                    <input value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} placeholder="Description" className={inputClass} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" className={inputClass} />
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" className={inputClass} />
                                    <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number *" className={inputClass} />
                                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location *" className={inputClass} />
                                    <select value={idType} onChange={(e) => setIdType(e.target.value)} className={selectClass}>
                                        <option value="">Select ID Type *</option>
                                        {idTypes.map((entry) => (
                                            <option key={String(entry.IdentificationTypeId)} value={String(entry.IdentificationTypeId)}>
                                                {entry.Name}{entry.Code ? ` (${entry.Code})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="ID Number *" className={inputClass} />
                                    <input value={imagePath} onChange={(e) => setImagePath(e.target.value)} placeholder="Image Path (optional)" className={inputClass} />
                                </div>
                            )}

                            <div className="mt-5 flex justify-end gap-2">
                                <button onClick={() => setShowModal(false)} className={ghostBtnClass}>Cancel</button>
                                <button
                                    onClick={handleSave}
                                    disabled={submitting === "role" || submitting === "person"}
                                    className={primaryBtnClass}
                                >
                                    {submitting === "role" || submitting === "person"
                                        ? "Saving..."
                                        : activeTab === "users" ? "Add User" : activeTab === "customers" ? "Add Customer" : "Add Role"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {permissionRole ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white w-full max-w-2xl rounded-2xl border border-red-100 p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Role Permissions</h3>
                                    <p className="text-sm text-gray-500">
                                        Add or remove what <span className="font-semibold text-[#c53030]">{permissionRole.Role}</span> is allowed to do.
                                    </p>
                                </div>
                                <button onClick={closePermissions} className="text-sm text-gray-500 hover:text-[#c53030]">Close</button>
                            </div>

                            <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <Icon icon="material-symbols-light:key-outline" className="h-4 w-4 text-[#c53030]" />
                                    <span className="text-sm font-semibold text-gray-800">Add permission</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <select value={permissionRoleName} onChange={(e) => setPermissionRoleName(e.target.value)} className={selectClass}>
                                        {roles.map((role) => (
                                            <option key={role.RoleId || role.Role} value={role.Role}>
                                                {role.Role}
                                            </option>
                                        ))}
                                        {!roles.some((role) => role.Role === permissionRoleName) ? (
                                            <option value={permissionRoleName}>{permissionRoleName}</option>
                                        ) : null}
                                    </select>
                                    <select value={permissionAction} onChange={(e) => setPermissionAction(e.target.value)} className={selectClass}>
                                        <option value="">Select Action *</option>
                                        {actions.map((entry) => (
                                            <option key={String(entry.ActionId ?? entry.Action)} value={entry.Action}>
                                                {entry.Action}
                                            </option>
                                        ))}
                                    </select>
                                    <input value={permissionCode} onChange={(e) => setPermissionCode(e.target.value)} placeholder="Permission Code *" className={inputClass} />
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={handleAddPermission}
                                        disabled={submitting === "permission"}
                                        className={primaryBtnClass}
                                    >
                                        <Icon icon="material-symbols-light:add-outline" className="h-4 w-4" />
                                        {submitting === "permission" ? "Adding..." : "Add Permission"}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Current permissions ({rolePermissions.length})
                                </p>
                                {rolePermissions.length === 0 ? (
                                    <EmptyState
                                        icon="material-symbols-light:key-off-outline"
                                        title="No permissions for this role yet."
                                        hint="Add one above to grant access."
                                    />
                                ) : (
                                    <div className="max-h-56 space-y-2 overflow-y-auto">
                                        {rolePermissions.map((perm) => (
                                            <div
                                                key={`${perm.Action}-${perm.PermissionCode}`}
                                                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
                                            >
                                                <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[#c53030]">
                                                    {perm.Action}
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{perm.PermissionCode}</span>
                                                <button
                                                    onClick={() => handleRemovePermission(perm)}
                                                    disabled={submitting === `remove-${perm.Action}-${perm.PermissionCode}`}
                                                    className={`${dangerBtnClass} shrink-0 px-3 py-1.5 text-xs`}
                                                >
                                                    {submitting === `remove-${perm.Action}-${perm.PermissionCode}` ? "Removing..." : "Remove"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>);
}

export default UserManagementPage;