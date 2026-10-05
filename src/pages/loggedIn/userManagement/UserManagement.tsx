import React, { useContext, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import type { AddCustomer, AddUser, AddRole, Role, RolePermission, RolePermissionAction, UpdateRolePermissionRequest } from "../../../../resources/types/applicationTypes";
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

    // Role permissions state (mirrors UpdateRolePermissionRequest)
    const [permissionRoleName, setPermissionRoleName] = useState("");
    const [permissionActionCode, setPermissionActionCode] = useState("");
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
    /** The role whose permissions are open - always taken from the latest roles list. */
    const permissionRole = useMemo(
        () => roles.find((entry) => entry.Role === permissionRoleName) ?? null,
        [roles, permissionRoleName]
    );
    const rolePermissions = useMemo<Array<RolePermission>>(
        () => (permissionRole && Array.isArray(permissionRole.RolePermissions) ? permissionRole.RolePermissions : []),
        [permissionRole]
    );
    /** Maps a role permission's action name back to its action code/value. */
    const actionCodeFor = (actionName?: string) => {
        const matched = actions.find((entry) => entry.Action === actionName);
        return matched?.Action ?? "";
    };

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
        setPermissionRoleName(role.Role);
        setPermissionActionCode("");
        setPermissionCode("");
    }

    const closePermissions = () => {
        setPermissionRoleName("");
        setPermissionActionCode("");
        setPermissionCode("");
    }

    /** Adds or removes a role permission. The verb is implied by the flow, never chosen. */
    const submitRolePermission = async (verb: RolePermissionAction) => {
        if (!applicationContext) {
            return;
        }

        if (!permissionRoleName.trim() || !permissionCode.trim()) {
            return;
        }

        setSubmitting(verb === "REMOVE" ? "permission-remove" : "permission-add");

        const payload: UpdateRolePermissionRequest = {
            Role: permissionRoleName.trim(),
            Action: verb,
            PermissionCode: permissionCode.trim(),
            ActionCode: permissionActionCode.trim(),
        };

        const resp = await applicationContext.updateRolePermission(payload);
        if (resp.Success) {
            // Roles carry their permissions, so always reload them.
            await getRoles();
            setPermissionActionCode("");
            setPermissionCode("");
        }

        setSubmitting("");
    }

    const handleAddPermission = async () => {
        await submitRolePermission("ADD");
    }

    const handleRemovePermission = async (entry: RolePermission) => {
        if (!applicationContext) {
            return;
        }

        const permCode = entry.Permission?.PermissionCode ?? "";
        const removeKey = `remove-${permCode}-${entry.Action?.Action ?? ""}`;

        setSubmitting(removeKey);

        const payload: UpdateRolePermissionRequest = {
            Role: entry.Role?.Role ?? permissionRole?.Role ?? permissionRoleName,
            Action: "REMOVE",
            PermissionCode: permCode,
            ActionCode: actionCodeFor(entry.Action?.Action),
        };

        const resp = await applicationContext.updateRolePermission(payload);
        if (resp.Success) {
            // Roles carry their permissions, so always reload them.
            await getRoles();
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
                                const rolePermissionCount = Array.isArray(entry.RolePermissions) ? entry.RolePermissions.length : 0;
                                return (
                                    <div
                                        key={entry.RoleId}
                                        className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/30"
                                    >
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#c53030]">
                                            <Icon icon="material-symbols-light:shield-person-outline" className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="truncate text-sm font-semibold text-gray-800">{entry.Role}</div>
                                                <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[#c53030]">
                                                    {rolePermissionCount} permission{rolePermissionCount === 1 ? "" : "s"}
                                                </span>
                                                {entry.Active ? null : (
                                                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                                                        Inactive
                                                    </span>
                                                )}
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
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-gray-500">Role</label>
                                        <select value={roles.find((role) => role.Role === permissionRoleName)?.RoleId ?? ""} onChange={(e) => setPermissionRoleName(e.target.value)} className={selectClass}>
                                            {roles.map((role) => (
                                                <option key={role.RoleId} value={role.RoleId}>
                                                    {role.Role}
                                                </option>
                                            ))}
                                            {!roles.some((role) => role.Role === permissionRoleName) ? (
                                                <option value={roles.find((role) => role.Role === permissionRoleName)?.RoleId ?? ""}>{permissionRoleName}</option>
                                            ) : null}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-gray-500">Permission</label>
                                        <select
                                            value={permissionCode}
                                            onChange={(e) => setPermissionCode(e.target.value)}
                                            className={selectClass}
                                        >
                                            <option value="">Select Permission *</option>
                                            {permissions.map((entry) => (
                                                <option key={entry.PermissionId} value={entry.PermissionCode}>
                                                    {entry.Permission}{entry.PermissionDescription ? ` — ${entry.PermissionDescription}` : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-gray-500">Action Code</label>
                                        <select
                                            value={permissionActionCode}
                                            onChange={(e) => setPermissionActionCode(e.target.value)}
                                            className={selectClass}
                                        >
                                            <option value="">No action</option>
                                            {actions.map((entry) => {
                                                const actionValue = entry.Action || "";
                                                const actionDescription = entry.Description || "";
                                                return (
                                                    <option key={entry.ActionId} value={actionValue}>
                                                        {entry.Action}{actionDescription ? ` — ${actionDescription}` : ""}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={handleAddPermission}
                                        disabled={submitting === "permission-add"}
                                        className={primaryBtnClass}
                                    >
                                        <Icon icon="material-symbols-light:add-outline" className="h-4 w-4" />
                                        {submitting === "permission-add" ? "Adding..." : "Add Permission"}
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
                                        {rolePermissions.map((perm) => {
                                            const permCode = perm.Permission?.PermissionCode ?? "";
                                            const removeKey = `remove-${permCode}-${perm.Action?.Action ?? ""}`;
                                            return (
                                                <div
                                                    key={perm.RolePermissionId}
                                                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
                                                >
                                                    <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[#c53030]">
                                                        {perm.Action?.Action || "Any"}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-sm text-gray-700">
                                                            {perm.Permission?.Permission || permCode}
                                                        </div>
                                                        <div className="truncate text-xs text-gray-400">
                                                            {permCode}{perm.Permission?.PermissionDescription ? ` • ${perm.Permission.PermissionDescription}` : ""}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemovePermission(perm)}
                                                        disabled={submitting === removeKey}
                                                        className={`${dangerBtnClass} shrink-0 px-3 py-1.5 text-xs`}
                                                    >
                                                        {submitting === removeKey ? "Removing..." : "Remove"}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>);
}

export default UserManagementPage;