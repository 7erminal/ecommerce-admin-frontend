import React, { useEffect, useState, useContext } from "react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import AuthContext from "../../../../resources/providers/AuthContext";
import type { AddApplication, AddTheme, ApplicationCustomizeFormData, ApplicationResp, BranchRequestDTO, ShopRequestDTO, ThemeFormData, ThemeResp, UpdateApplication } from "../../../../resources/types/applicationTypes";

type Tab = "applications" | "themes" | "appearance";

interface AppearanceSettings {
    themeColors: string[];
    defaultFontSize: string;
    bannerImage: string;
    showBanners: boolean;
    borderRadius: string;
    template: string;
}

const CustomizePage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);
    const authContext = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<Tab>("applications");

    const [error, setError] = useState<string>("");
    // const [success, setSuccess] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    // const [showSuccess, setShowSuccess] = useState<boolean>(false);
    
    // Applications state
    const [showAddAppModal, setShowAddAppModal] = useState(false);
    const [appFormData, setAppFormData] = useState<ApplicationCustomizeFormData>({
        ApplicationName: "",
        ApplicationLogo: "",
        ApplicationImage: "",
        ThemeColors: [],
        DefaultFontsize: "14",
        ThemeCode: "",
    });
    const [editingAppId, setEditingAppId] = useState<string | null>(null);
    const [expandedShopId, setExpandedShopId] = useState<string | null>(null);
    const [shopBranchSelection, setShopBranchSelection] = useState<Record<string, string>>({});
    const [shopFormData, setShopFormData] = useState<ShopRequestDTO>({
        ShopId: "",
        ShopName: "",
        ShopDescription: "",
        ShopAssistantName: "",
        ShopAssistantNumber: "",
        ShopLocation: "",
        PhoneNumber: "",
        Email: "",
        Image: "",
    });
    const [editingShopId, setEditingShopId] = useState<string | null>(null);
    const [showShopModal, setShowShopModal] = useState(false);
    const [branchFormData, setBranchFormData] = useState<BranchRequestDTO>({
        Branch: "",
        CountryCode: "",
        PhoneNumber: "",
        Location: "",
        BranchManager: 0,
    });
    const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
    const [showBranchModal, setShowBranchModal] = useState(false);
    const [appShopFormData, setAppShopFormData] = useState<{ ApplicationId: string; ShopId: string }>({
        ApplicationId: "",
        ShopId: "",
    });

    // Themes state
    const [themes, setThemes] = useState<ThemeFormData[]>([]);
    const [showAddThemeModal, setShowAddThemeModal] = useState(false);
    const [themeFormData, setThemeFormData] = useState<ThemeFormData>({
        ThemeCode: "",
        ThemeName: "",
        ThemeConfig: [],
    });
    const [editingThemeId, setEditingThemeId] = useState<number | null>(null);

    // Appearance state
    const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
        themeColors: [],
        defaultFontSize: "14",
        bannerImage: "",
        showBanners: true,
        borderRadius: "8",
        template: "modern",
    });
    const [appearanceModified, setAppearanceModified] = useState(false);
    const [appFormImages, setAppFormImages] = useState<{ ApplicationLogo?: File; ApplicationImage?: File }>({
        ApplicationLogo: undefined,
        ApplicationImage: undefined,
    });

    const isSuperAdmin = (authContext?.currentUser?.role ?? "").toUpperCase() === "SUPER_ADMIN";
    const selectedAppearanceApplication = applicationContext?.selectedApplication ?? null;

    useEffect(() => {
        document.title = "Customize";
    }, []);

    useEffect(() => {
        applicationContext?.fetchApplications();
        applicationContext?.fetchThemes();
        applicationContext?.fetchShops();
        applicationContext?.fetchBranches();
    }, []);

    useEffect(() => {
        const apps = applicationContext?.applications ?? [];
        if (apps.length === 0) {
            applicationContext?.setSelectedApplication(null);
            return;
        }

        const selectedId = applicationContext?.selectedApplication?.ApplicationId;
        const selectedExists = apps.some((app) => app.ApplicationId === selectedId);

        if (!selectedExists) {
            applicationContext?.setSelectedApplication(apps[0]);
        }
    }, [applicationContext?.applications, applicationContext?.selectedApplication?.ApplicationId]);

    const handleSelectAppearanceApplication = (applicationId: string) => {
        if (!isSuperAdmin) {
            return;
        }

        const selectedApp = (applicationContext?.applications ?? []).find(
            (app) => String(app.ApplicationId) === applicationId,
        );

        applicationContext?.setSelectedApplication(selectedApp ?? null);
    };

    useEffect(() => {
        if (!selectedAppearanceApplication) {
            return;
        }

        const themeColors = selectedAppearanceApplication.ThemeColors
            ? selectedAppearanceApplication.ThemeColors.split(",").map((color) => color.trim()).filter(Boolean)
            : [];

        setAppearanceSettings((prev) => ({
            ...prev,
            themeColors,
            defaultFontSize: selectedAppearanceApplication.DefaultFontsize?.toString() ?? "14",
            showBanners: selectedAppearanceApplication.Theme?.ThemeConfig?.[0]?.ShowBanner ?? true,
            borderRadius: selectedAppearanceApplication.Theme?.ThemeConfig?.[0]?.BorderRadius?.toString() ?? "8",
        }));
        setAppearanceModified(false);
    }, [selectedAppearanceApplication?.ApplicationId]);


    // ===== APPLICATION HANDLERS =====
    const handleAddApp = async () => {
        if (!appFormData.ApplicationName.trim() || !appFormData.ThemeCode.trim()) {
            alert("Application Name and Theme Code are required");
            return;
        }

        let uploadedApplicationImage = appFormData.ApplicationImage ?? "";
        let uploadedApplicationLogo = appFormData.ApplicationLogo ?? "";

        if (appFormImages.ApplicationImage) {
            const imageResp = await applicationContext?.uploadSystemImage(appFormImages.ApplicationImage, "brand");
            if (!imageResp?.Success || !imageResp.Result) {
                setError(imageResp?.StatusDesc ?? "Failed to upload application image");
                setShowError(true);
                return;
            }
            uploadedApplicationImage = imageResp.Result;
        }

        if (appFormImages.ApplicationLogo) {
            const logoResp = await applicationContext?.uploadSystemImage(appFormImages.ApplicationLogo, "brand");
            if (!logoResp?.Success || !logoResp.Result) {
                setError(logoResp?.StatusDesc ?? "Failed to upload application logo");
                setShowError(true);
                return;
            }
            uploadedApplicationLogo = logoResp.Result;
        }

        const payload: AddApplication = {
            ApplicationName: appFormData.ApplicationName,
            ApplicationLogo: uploadedApplicationLogo,
            ApplicationImage: uploadedApplicationImage,
            ThemeColors: (appFormData.ThemeColors ?? []).join(","),
            DefaultFontsize: appFormData.DefaultFontsize ?? "14",
            ThemeCode: appFormData.ThemeCode,
        };
        
        const addAppResp = await applicationContext?.addApplication(payload);
        console.log("Resposne from adding application:", addAppResp);
        if(addAppResp?.Success) {
            setError("");
            setShowError(false);
        } else {
            setError(addAppResp?.StatusDesc ?? "Failed to add application");
            setShowError(true);
        }
       
        resetAppForm();
        setShowAddAppModal(false);
    };

    const handleUpdateApp = async () => {
        if (!appFormData.ApplicationName.trim() || !appFormData.ThemeCode.trim()) {
            alert("Application Name and Theme Code are required");
            return;
        }

        if (!editingAppId) {
            return;
        }

        let uploadedApplicationImage = appFormData.ApplicationImage ?? "";
        let uploadedApplicationLogo = appFormData.ApplicationLogo ?? "";

        if (appFormImages.ApplicationImage) {
            const imageResp = await applicationContext?.uploadSystemImage(appFormImages.ApplicationImage, "brand");
            if (!imageResp?.Success || !imageResp.Result) {
                setError(imageResp?.StatusDesc ?? "Failed to upload application image");
                setShowError(true);
                return;
            }
            uploadedApplicationImage = imageResp.Result;
        }

        if (appFormImages.ApplicationLogo) {
            const logoResp = await applicationContext?.uploadSystemImage(appFormImages.ApplicationLogo, "brand");
            if (!logoResp?.Success || !logoResp.Result) {
                setError(logoResp?.StatusDesc ?? "Failed to upload application logo");
                setShowError(true);
                return;
            }
            uploadedApplicationLogo = logoResp.Result;
        }

        const payload: UpdateApplication = {
            ApplicationName: appFormData.ApplicationName,
            ApplicationLogo: uploadedApplicationLogo,
            ApplicationImage: uploadedApplicationImage,
            ThemeColors: (appFormData.ThemeColors ?? []).join(","),
            DefaultFontsize: appFormData.DefaultFontsize ?? "14",
            ThemeCode: appFormData.ThemeCode,
            UpdatedBy: 0,
        };

        const updateResp = await applicationContext?.updateApplication(editingAppId, payload);
        if (!updateResp?.Success) {
            setError(updateResp?.StatusDesc ?? "Failed to update application");
            setShowError(true);
            return;
        }

        const updateThemeResp = await applicationContext?.updateApplicationTheme(editingAppId, {
            ThemeCode: appFormData.ThemeCode,
        });

        if (!updateThemeResp?.Success) {
            setError(updateThemeResp?.StatusDesc ?? "Failed to update application theme");
            setShowError(true);
            return;
        }

        setError("");
        setShowError(false);
        resetAppForm();
        setEditingAppId(null);
        setShowAddAppModal(false);
    };

    const handleDeleteApp = async (appId: string | undefined) => {
        if (!appId) return;
        if (window.confirm("Are you sure you want to delete this application?")) {
            const resp = await applicationContext?.deleteApplication(appId);
            if (!resp?.Success) {
                setError(resp?.StatusDesc ?? "Failed to delete application");
                setShowError(true);
            }
        }
    };

    const resetAppForm = () => {
        setAppFormData({
            ApplicationName: "",
            ApplicationLogo: undefined,
            ApplicationImage: undefined,
            ThemeColors: [],
            DefaultFontsize: "14",
            ThemeCode: "",
        });
        setEditingAppId(null);
    };

    const openEditAppModal = (app: ApplicationResp) => {
        console.log("Opening edit modal for application:", app);
        const appData: ApplicationCustomizeFormData = {
            ApplicationName: app.ApplicationName || "",
            ApplicationLogo: app.ApplicationLogo,
            ApplicationImage: app.ApplicationImage,
            ThemeColors: typeof app.ThemeColors === 'string' ? app.ThemeColors.split(',').map(c => c.trim()) : (app.ThemeColors || []),
            DefaultFontsize: app.DefaultFontsize || "14",
            ThemeCode: app.Theme?.ThemeCode || "",
        };
        setAppFormData(appData);
        setEditingAppId(app.ApplicationId || null);
        setShowAddAppModal(true);
    };

    // ===== THEME HANDLERS =====
    const handleAddTheme = async () => {
        if (!themeFormData.ThemeCode.trim() || !themeFormData.ThemeName.trim()) {
            alert("Theme Code and Theme Name are required");
            return;
        }

        const payload: AddTheme = {
            ThemeCode: themeFormData.ThemeCode,
            ThemeName: themeFormData.ThemeName,
        };

        const resp = await applicationContext?.addTheme(payload);
        if (!resp?.Success) {
            setError(resp?.StatusDesc ?? "Failed to add theme");
            setShowError(true);
            return;
        }

        const createdThemeId = resp.Result?.ThemeId;
        const hasThemeConfig = Boolean(themeFormData.ThemeConfig && Object.keys(themeFormData.ThemeConfig).length > 0);

        if (createdThemeId && hasThemeConfig) {
            const configResp = await applicationContext?.addThemeConfig(String(createdThemeId), {
                Config: JSON.stringify(themeFormData.ThemeConfig),
            });

            if (!configResp?.Success) {
                setError(configResp?.StatusDesc ?? "Theme added but failed to add theme config");
                setShowError(true);
                return;
            }
        }

        setError("");
        setShowError(false);
        resetThemeForm();
        setShowAddThemeModal(false);
    };

    const handleUpdateTheme = async () => {
        if (!themeFormData.ThemeCode.trim() || !themeFormData.ThemeName.trim()) {
            alert("Theme Code and Theme Name are required");
            return;
        }

        setThemes(themes.map(theme =>
            theme.ThemeId === editingThemeId ? { ...themeFormData, ThemeId: editingThemeId ?? undefined } : theme
        ));
        resetThemeForm();
        setEditingThemeId(null);
        setShowAddThemeModal(false);
    };

    const handleDeleteTheme = async (themeId: number | undefined) => {
        if (!themeId) return;
        if (window.confirm("Are you sure you want to delete this theme?")) {
            const resp = await applicationContext?.removeTheme(String(themeId));
            if (resp?.Success) {
                setThemes(themes.filter(theme => theme.ThemeId !== themeId));
                setError("");
                setShowError(false);
            } else {
                setError(resp?.StatusDesc ?? "Failed to remove theme");
                setShowError(true);
            }
        }
    };

    const resetThemeForm = () => {
        setThemeFormData({
            ThemeCode: "",
            ThemeName: "",
            ThemeConfig: [],
        });
        setEditingThemeId(null);
    };

    const openEditThemeModal = (theme: ThemeResp) => {

        const newThemeFormData: ThemeFormData = {
            ThemeCode: theme.ThemeCode || "",
            ThemeName: theme.ThemeName || "",
            ThemeConfig: theme.ThemeConfig || [],
        };
        setThemeFormData(newThemeFormData);
        setEditingThemeId(theme.ThemeId || null);
        setShowAddThemeModal(true);
    };

    // ===== SHOP & BRANCH HANDLERS =====
    const resetShopForm = () => {
        setShopFormData({
            ShopId: "",
            ShopName: "",
            ShopDescription: "",
            ShopAssistantName: "",
            ShopAssistantNumber: "",
            ShopLocation: "",
            PhoneNumber: "",
            Email: "",
            Image: "",
        });
        setEditingShopId(null);
    };

    const openEditShopModal = (shopId: string) => {
        const selectedShop = (applicationContext?.shops ?? []).find((shop) => shop.ShopId === shopId);
        if (!selectedShop) {
            return;
        }
        setShopFormData({
            ShopId: selectedShop.ShopId,
            ShopName: selectedShop.ShopName,
            ShopDescription: selectedShop.ShopDescription,
            ShopAssistantName: selectedShop.ShopAssistantName,
            ShopAssistantNumber: selectedShop.ShopAssistantNumber,
            ShopLocation: selectedShop.ShopLocation,
            PhoneNumber: selectedShop.PhoneNumber,
            Email: selectedShop.Email,
            Image: selectedShop.Image,
        });
        setEditingShopId(selectedShop.ShopId);
        setShowShopModal(true);
    };

    const handleAddShop = async () => {
        if (!shopFormData.ShopName.trim()) {
            setError("Shop name is required");
            setShowError(true);
            return;
        }
        const response = await applicationContext?.addShop(shopFormData);
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to add shop");
            setShowError(true);
            return;
        }
        setError("");
        setShowError(false);
        resetShopForm();
        setShowShopModal(false);
    };

    const handleUpdateShop = async () => {
        if (!editingShopId) {
            return;
        }
        const payload: ShopRequestDTO = {
            ...shopFormData,
            ShopId: editingShopId,
        };
        const response = await applicationContext?.updateShop(payload);
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to update shop");
            setShowError(true);
            return;
        }
        setError("");
        setShowError(false);
        resetShopForm();
        setShowShopModal(false);
    };

    const handleDeleteShop = async (shopId: string) => {
        if (!window.confirm("Are you sure you want to delete this shop?")) {
            return;
        }
        const response = await applicationContext?.deleteShop({ ShopId: shopId });
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to delete shop");
            setShowError(true);
            return;
        }
        setError("");
        setShowError(false);
    };

    const resetBranchForm = () => {
        setBranchFormData({
            Branch: "",
            CountryCode: "",
            PhoneNumber: "",
            Location: "",
            BranchManager: 0,
        });
        setEditingBranchId(null);
    };

    const openEditBranchModal = (branchId: string) => {
        const selectedBranch = (applicationContext?.branches ?? []).find((branch) => String(branch.BranchId) === branchId);
        if (!selectedBranch) {
            return;
        }
        setBranchFormData({
            Branch: selectedBranch.Branch,
            CountryCode: "",
            PhoneNumber: selectedBranch.PhoneNumber,
            Location: selectedBranch.Location,
            BranchManager: 0,
        });
        setEditingBranchId(branchId);
        setShowBranchModal(true);
    };

    const handleAddBranch = async () => {
        const userId = authContext?.user?.id;
        setBranchFormData((prev) => ({ ...prev, BranchManager: Number(userId) || 0 }))
        if (!branchFormData.Branch.trim() || !branchFormData.CountryCode.trim()) {
            setError("Branch name and country code are required");
            setShowError(true);
            return;
        }
        const response = await applicationContext?.addBranch(branchFormData);
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to add branch");
            setShowError(true);
            return;
        }
        setError("");
        setShowError(false);
        resetBranchForm();
        setShowBranchModal(false);
    };

    const handleUpdateBranch = async () => {
        if (!editingBranchId) {
            return;
        }
        const response = await applicationContext?.updateBranch(editingBranchId, branchFormData);
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to update branch");
            setShowError(true);
            return;
        }
        setError("");
        setShowError(false);
        resetBranchForm();
        setShowBranchModal(false);
    };

    const handleDeleteBranch = async (branchId: string) => {
        if (!window.confirm("Are you sure you want to delete this branch?")) {
            return;
        }
        const response = await applicationContext?.deleteBranch(branchId);
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to delete branch");
            setShowError(true);
            return;
        }
        setError("");
        setShowError(false);
    };

    const handleAddBranchToShop = async (shopId: string) => {
        const branchId = shopBranchSelection[shopId];
        if (!branchId) {
            setError("Select a branch to add");
            setShowError(true);
            return;
        }

        const response = await applicationContext?.addShopBranch({ ShopId: shopId, BranchId: branchId });
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to add branch to shop");
            setShowError(true);
            return;
        }

        setShopBranchSelection((prev) => ({ ...prev, [shopId]: "" }));
        setError("");
        setShowError(false);
    };

    const handleRemoveBranchFromShop = async (shopId: string, branchId: string) => {
        const response = await applicationContext?.removeShopBranch({ ShopId: shopId, BranchId: branchId });
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to remove branch from shop");
            setShowError(true);
            return;
        }
        setError("");
        setShowError(false);
    };

    const handleAddShopToApplication = async () => {
        if (!appShopFormData.ApplicationId || !appShopFormData.ShopId) {
            setError("Application and shop are required");
            setShowError(true);
            return;
        }

        const response = await applicationContext?.addApplicationShop(appShopFormData);
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to add shop to application");
            setShowError(true);
            return;
        }

        setError("");
        setShowError(false);
    };

    const handleRemoveShopFromApplication = async () => {
        if (!appShopFormData.ApplicationId || !appShopFormData.ShopId) {
            setError("Application and shop are required");
            setShowError(true);
            return;
        }

        const response = await applicationContext?.removeApplicationShop(appShopFormData);
        if (!response?.Success) {
            setError(response?.StatusDesc ?? "Failed to remove shop from application");
            setShowError(true);
            return;
        }

        setError("");
        setShowError(false);
    };

    // ===== APPEARANCE HANDLERS =====
    const handleAppearanceChange = (key: keyof AppearanceSettings, value: unknown) => {
        setAppearanceSettings(prev => ({
            ...prev,
            [key]: value,
        }));
        setAppearanceModified(true);
    };

    const handleThemeColorChange = (index: number, value: string) => {
        const newColors = [...appearanceSettings.themeColors];
        newColors[index] = value;
        handleAppearanceChange("themeColors", newColors);
    };

    const addThemeColor = () => {
        if (appearanceSettings.themeColors.length < 2) {
            handleAppearanceChange("themeColors", [...appearanceSettings.themeColors, "#000000"]);
        }
    };

    const removeThemeColor = (index: number) => {
        const newColors = appearanceSettings.themeColors.filter((_, i) => i !== index);
        handleAppearanceChange("themeColors", newColors);
    };

    const handleSaveAppearance = async () => {
        console.log("Saving appearance settings:", appearanceSettings);
        // Call API to save appearance settings
        setAppearanceModified(false);
    };

    // ===== RENDER =====
    return (
        <div className="flex flex-col whitespace-normal p-4">
            {showError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Tabs Navigation */}
            <section className="mb-6">
                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`px-4 py-2 font-medium text-sm transition ${
                            activeTab === "applications"
                                ? "border-b-2 border-red-600 text-red-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Applications
                    </button>
                    <button
                        onClick={() => setActiveTab("themes")}
                        className={`px-4 py-2 font-medium text-sm transition ${
                            activeTab === "themes"
                                ? "border-b-2 border-red-600 text-red-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Themes
                    </button>
                    <button
                        onClick={() => setActiveTab("appearance")}
                        className={`px-4 py-2 font-medium text-sm transition ${
                            activeTab === "appearance"
                                ? "border-b-2 border-red-600 text-red-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Appearance
                    </button>
                </div>
            </section>

            {/* APPLICATIONS TAB */}
            {activeTab === "applications" && (
                <section className="space-y-4">
                    <div className="bg-white border border-red-100 rounded-xl p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Applications</h2>
                                <p className="text-sm text-gray-500 mt-1">Create and manage your applications.</p>
                            </div>
                            <button
                                onClick={() => {
                                    resetAppForm();
                                    setShowAddAppModal(true);
                                }}
                                style={{
                                    background: "#c53030",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    border: "2px solid #c53030",
                                }}
                            >
                                Add Application
                            </button>
                        </div>
                    </div>

                    {applicationContext?.applications.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                            No applications available.
                        </div>
                    ) : (
                        applicationContext?.applications.map((app) => (
                            <div key={app.ApplicationId} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Application Code</p>
                                        <h3 className="text-lg font-semibold text-gray-800">{app.ApplicationCode}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{app.ApplicationName}</p>
                                        <p className="text-xs text-gray-500 mt-1">Theme: {app.Theme?.ThemeCode}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditAppModal(app)}
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteApp(app.ApplicationId)}
                                            className="px-4 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800">Application Shops</h3>
                        <p className="text-sm text-gray-500">Add or remove a shop from an application.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <select
                                value={appShopFormData.ApplicationId}
                                onChange={(e) => setAppShopFormData((prev) => ({ ...prev, ApplicationId: e.target.value }))}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                            >
                                <option value="">Select Application</option>
                                {(applicationContext?.applications ?? []).map((app) => (
                                    <option key={app.ApplicationId} value={String(app.ApplicationId)}>
                                        {app.ApplicationName}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={appShopFormData.ShopId}
                                onChange={(e) => setAppShopFormData((prev) => ({ ...prev, ShopId: e.target.value }))}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                            >
                                <option value="">Select Shop</option>
                                {(applicationContext?.shops ?? []).map((shop) => (
                                    <option key={shop.ShopId} value={shop.ShopId}>
                                        {shop.ShopName}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddShopToApplication}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Add Shop
                                </button>
                                <button
                                    onClick={handleRemoveShopFromApplication}
                                    className="px-4 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    Remove Shop
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Branches</h3>
                                <p className="text-sm text-gray-500">Create, update and delete branches.</p>
                            </div>
                            <button
                                onClick={() => {
                                    resetBranchForm();
                                    setShowBranchModal(true);
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ backgroundColor: "#c53030" }}
                            >
                                Add Branch
                            </button>
                        </div>
                        {(applicationContext?.branches ?? []).length === 0 ? (
                            <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-500">No branches found.</div>
                        ) : (
                            (applicationContext?.branches ?? []).map((branch) => (
                                <div key={branch.BranchId} className="rounded-lg border border-gray-200 p-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-gray-800">{branch.Branch}</p>
                                        <p className="text-xs text-gray-500">{branch.Location} • {branch.PhoneNumber}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditBranchModal(String(branch.BranchId))}
                                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBranch(String(branch.BranchId))}
                                            className="px-3 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Shops</h3>
                                <p className="text-sm text-gray-500">Select a shop to expand and manage its branches.</p>
                            </div>
                            <button
                                onClick={() => {
                                    resetShopForm();
                                    setShowShopModal(true);
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ backgroundColor: "#c53030" }}
                            >
                                Add Shop
                            </button>
                        </div>

                        {(applicationContext?.shops ?? []).length === 0 ? (
                            <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-500">No shops found.</div>
                        ) : (
                            (applicationContext?.shops ?? []).map((shop) => {
                                const isExpanded = expandedShopId === shop.ShopId;
                                return (
                                    <div key={shop.ShopId} className="rounded-lg border border-gray-200">
                                        <button
                                            onClick={() => setExpandedShopId(isExpanded ? null : shop.ShopId)}
                                            className="w-full text-left p-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-800">{shop.ShopName}</p>
                                                <p className="text-xs text-gray-500">{shop.ShopLocation} • {shop.PhoneNumber}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{isExpanded ? "Hide" : "Show"}</span>
                                        </button>
                                        {isExpanded && (
                                            <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
                                                <div className="pt-3 flex gap-2">
                                                    <button
                                                        onClick={() => openEditShopModal(shop.ShopId)}
                                                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Edit Shop
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteShop(shop.ShopId)}
                                                        className="px-3 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                                                    >
                                                        Delete Shop
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                                                    <select
                                                        value={shopBranchSelection[shop.ShopId] ?? ""}
                                                        onChange={(e) => setShopBranchSelection((prev) => ({ ...prev, [shop.ShopId]: e.target.value }))}
                                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                                                    >
                                                        <option value="">Select branch</option>
                                                        {(applicationContext?.branches ?? []).map((branch) => (
                                                            <option key={branch.BranchId} value={String(branch.BranchId)}>
                                                                {branch.Branch}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleAddBranchToShop(shop.ShopId)}
                                                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Add Branch To Shop
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs text-gray-500">Assigned branches</p>
                                                    {(shop.ShopBranches ?? []).length === 0 ? (
                                                        <p className="text-sm text-gray-500">No branches assigned to this shop.</p>
                                                    ) : (
                                                        (shop.ShopBranches ?? []).map((shopBranch) => (
                                                            <div key={`${shop.ShopId}-${shopBranch.BranchId}`} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                                                <span className="text-sm text-gray-700">{shopBranch.ShopBranch?.Branch ?? `Branch ${shopBranch.BranchId}`}</span>
                                                                <button
                                                                    onClick={() => handleRemoveBranchFromShop(shop.ShopId, shopBranch.BranchId)}
                                                                    className="px-3 py-1 rounded-lg border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            )}

            {/* THEMES TAB */}
            {activeTab === "themes" && (
                <section className="space-y-4">
                    <div className="bg-white border border-red-100 rounded-xl p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Themes</h2>
                                <p className="text-sm text-gray-500 mt-1">Create and manage your application themes.</p>
                            </div>
                            <button
                                onClick={() => {
                                    resetThemeForm();
                                    setShowAddThemeModal(true);
                                }}
                                style={{
                                    background: "#c53030",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    border: "2px solid #c53030",
                                }}
                            >
                                Add Theme
                            </button>
                        </div>
                    </div>

                    {applicationContext?.themes.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                            No themes available.
                        </div>
                    ) : (
                        applicationContext?.themes.map((theme) => (
                            <div key={theme.ThemeId} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Theme Code</p>
                                        <h3 className="text-lg font-semibold text-gray-800">{theme.ThemeCode}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{theme.ThemeName}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditThemeModal(theme)}
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTheme(theme.ThemeId)}
                                            className="px-4 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === "appearance" && (
                <section className="space-y-4">
                    <div className="bg-white border border-red-100 rounded-xl p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Appearance</h2>
                                <p className="text-sm text-gray-500 mt-1">Customize your application's visual appearance.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Application</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {isSuperAdmin
                                    ? "Select an application to configure appearance settings."
                                    : "Your application is selected by default. Only SUPER_ADMIN can change it."}
                            </p>
                        </div>
                        <select
                            value={selectedAppearanceApplication?.ApplicationId ?? ""}
                            onChange={(e) => handleSelectAppearanceApplication(e.target.value)}
                            disabled={!isSuperAdmin}
                            className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        >
                            <option value="">Select an application</option>
                            {(applicationContext?.applications ?? []).map((app) => (
                                <option key={app.ApplicationId} value={app.ApplicationId}>
                                    {app.ApplicationName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!selectedAppearanceApplication && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                            Select an application to view and edit appearance settings.
                        </div>
                    )}

                    {selectedAppearanceApplication && (
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6">
                        {/* Theme Colors */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme Colors</h3>
                            <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-2">Current saved colors</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAppearanceApplication.ThemeColors.split(",").map((color, index) => {
                                        const trimmedColor = color.trim();
                                        return (
                                            <span
                                                key={`saved-color-${index}`}
                                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                                            >
                                                <span className="inline-block h-3 w-3 rounded-full border border-gray-300" style={{ backgroundColor: trimmedColor }} />
                                                {trimmedColor}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Edit colors (preview before save)</p>
                            <div className="space-y-3">
                                {appearanceSettings.themeColors.map((color, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 flex-1">
                                            <label className="text-sm text-gray-700">Color {index + 1}</label>
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => handleThemeColorChange(index, e.target.value)}
                                                className="w-12 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => handleThemeColorChange(index, e.target.value)}
                                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                                placeholder="#000000"
                                            />
                                        </div>
                                        {appearanceSettings.themeColors.length > 1 && (
                                            <button
                                                onClick={() => removeThemeColor(index)}
                                                className="px-3 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {appearanceSettings.themeColors.length < 2 && (
                                    <button
                                        onClick={addThemeColor}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Add Color
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="text-sm text-gray-700 block">Default Font Size (px)</label>
                            <input
                                type="number"
                                min={10}
                                max={32}
                                value={appearanceSettings.defaultFontSize}
                                onChange={(e) => handleAppearanceChange("defaultFontSize", e.target.value)}
                                className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Banner Image */}
                        <div>
                            <label className="text-sm text-gray-700 block">Banner Image(s)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleAppearanceChange("bannerImage", e.target.files ?? [])}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Show Banners Toggle */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-700">Show Banners</label>
                            <input
                                type="checkbox"
                                checked={appearanceSettings.showBanners}
                                onChange={(e) => handleAppearanceChange("showBanners", e.target.checked)}
                                className="w-5 h-5 rounded cursor-pointer"
                            />
                        </div>

                        {/* Border Radius */}
                        <div>
                            <label className="text-sm text-gray-700 block">Border Radius (px)</label>
                            <input
                                type="number"
                                min={0}
                                max={50}
                                value={appearanceSettings.borderRadius}
                                onChange={(e) => handleAppearanceChange("borderRadius", e.target.value)}
                                className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Template Selection */}
                        <div>
                            <label className="text-sm text-gray-700 block">Template</label>
                            <select
                                value={appearanceSettings.template}
                                onChange={(e) => handleAppearanceChange("template", e.target.value)}
                                className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                            >
                                <option value="modern">Modern</option>
                                <option value="classic">Classic</option>
                                <option value="minimal">Minimal</option>
                                <option value="bold">Bold</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleSaveAppearance}
                                disabled={!appearanceModified}
                                style={{
                                    background: appearanceModified ? "#c53030" : "#ccc",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    border: "2px solid",
                                    borderColor: appearanceModified ? "#c53030" : "#ccc",
                                    cursor: appearanceModified ? "pointer" : "not-allowed",
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                    )}
                </section>
            )}

            {/* ADD/EDIT APPLICATION MODAL */}
            {showAddAppModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl border border-red-100 p-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingAppId ? "Edit Application" : "Add Application"}
                            </h3>
                            <button onClick={() => setShowAddAppModal(false)} className="text-sm text-gray-500">Close</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="text-sm text-gray-700">Application Name</label>
                                <input
                                    type="text"
                                    value={appFormData.ApplicationName}
                                    onChange={(e) => setAppFormData({...appFormData, ApplicationName: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="e.g., My App"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Application Logo</label>
                                {appFormData.ApplicationLogo && (
                                    <img src={appFormData.ApplicationLogo} alt="Application Logo" className="mb-2 w-20 h-20 object-cover rounded" />
                                )}
                                <input
                                    type="file"
                                    onChange={(e) => setAppFormImages({...appFormImages, ApplicationLogo: e.target.files?.[0] || appFormImages.ApplicationLogo})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    accept="image/*"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Application Image</label>
                                {appFormData.ApplicationImage && (
                                    <img src={appFormData.ApplicationImage} alt="Application Image" className="mb-2 w-20 h-20 object-cover rounded" />
                                )}
                                <input
                                    type="file"
                                    onChange={(e) => setAppFormImages({...appFormImages, ApplicationImage: e.target.files?.[0] || appFormImages.ApplicationImage})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    accept="image/*"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Default Font Size (px)</label>
                                <input
                                    type="number"
                                    value={appFormData.DefaultFontsize}
                                    onChange={(e) => setAppFormData({...appFormData, DefaultFontsize: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="14"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Theme Code</label>
                                <select
                                    value={appFormData.ThemeCode}
                                    onChange={(e) => setAppFormData({...appFormData, ThemeCode: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                                >
                                    <option value="">Select a theme</option>
                                    { applicationContext?.themes.map((theme) => (
                                        <option key={theme.ThemeId} value={theme.ThemeCode}>
                                            {theme.ThemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-700">Theme Colors</label>
                                <div className="mt-1 space-y-2">
                                    {(appFormData.ThemeColors || []).map((color, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => {
                                                    const newColors = [...(appFormData.ThemeColors || [])];
                                                    newColors[index] = e.target.value;
                                                    setAppFormData({...appFormData, ThemeColors: newColors});
                                                }}
                                                className="w-12 h-10 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => {
                                                    const newColors = [...(appFormData.ThemeColors || [])];
                                                    newColors[index] = e.target.value;
                                                    setAppFormData({...appFormData, ThemeColors: newColors});
                                                }}
                                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                                placeholder="#000000"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newColors = appFormData.ThemeColors?.filter((_, i) => i !== index);
                                                    setAppFormData({...appFormData, ThemeColors: newColors});
                                                }}
                                                className="px-3 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newColors = [...(appFormData.ThemeColors || []), "#000000"];
                                            setAppFormData({...appFormData, ThemeColors: newColors});
                                        }}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Add Color
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowAddAppModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingAppId ? handleUpdateApp : handleAddApp}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ backgroundColor: "#c53030" }}
                            >
                                {editingAppId ? "Update" : "Add"} Application
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD/EDIT THEME MODAL */}
            {showAddThemeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-md rounded-xl border border-red-100 p-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingThemeId ? "Edit Theme" : "Add Theme"}
                            </h3>
                            <button onClick={() => setShowAddThemeModal(false)} className="text-sm text-gray-500">Close</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-700">Theme Code</label>
                                <input
                                    type="text"
                                    value={themeFormData.ThemeCode}
                                    onChange={(e) => setThemeFormData({...themeFormData, ThemeCode: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="e.g., THEME001"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Theme Name</label>
                                <input
                                    type="text"
                                    value={themeFormData.ThemeName}
                                    onChange={(e) => setThemeFormData({...themeFormData, ThemeName: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="e.g., Modern Dark"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Theme Config (JSON)</label>
                                <textarea
                                    value={JSON.stringify(themeFormData.ThemeConfig, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            setThemeFormData({...themeFormData, ThemeConfig: JSON.parse(e.target.value)});
                                        } catch {
                                            // Keep current value on parse error
                                        }
                                    }}
                                    className="mt-1 w-full h-32 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                                    placeholder='{"key": "value"}'
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowAddThemeModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingThemeId ? handleUpdateTheme : handleAddTheme}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ backgroundColor: "#c53030" }}
                            >
                                {editingThemeId ? "Update" : "Add"} Theme
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD/EDIT SHOP MODAL */}
            {showShopModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl border border-red-100 p-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingShopId ? "Edit Shop" : "Add Shop"}
                            </h3>
                            <button onClick={() => setShowShopModal(false)} className="text-sm text-gray-500">Close</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-700">Shop Name</label>
                                <input
                                    type="text"
                                    value={shopFormData.ShopName}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, ShopName: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Email</label>
                                <input
                                    type="text"
                                    value={shopFormData.Email}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, Email: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    value={shopFormData.PhoneNumber}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, PhoneNumber: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Location</label>
                                <input
                                    type="text"
                                    value={shopFormData.ShopLocation}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, ShopLocation: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Assistant Name</label>
                                <input
                                    type="text"
                                    value={shopFormData.ShopAssistantName}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, ShopAssistantName: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Assistant Number</label>
                                <input
                                    type="text"
                                    value={shopFormData.ShopAssistantNumber}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, ShopAssistantNumber: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-700">Description</label>
                                <textarea
                                    value={shopFormData.ShopDescription}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, ShopDescription: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    value={shopFormData.Image}
                                    onChange={(e) => setShopFormData((prev) => ({ ...prev, Image: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowShopModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingShopId ? handleUpdateShop : handleAddShop}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ backgroundColor: "#c53030" }}
                            >
                                {editingShopId ? "Update" : "Add"} Shop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD/EDIT BRANCH MODAL */}
            {showBranchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl border border-red-100 p-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingBranchId ? "Edit Branch" : "Add Branch"}
                            </h3>
                            <button onClick={() => setShowBranchModal(false)} className="text-sm text-gray-500">Close</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-700">Branch Name</label>
                                <input
                                    type="text"
                                    value={branchFormData.Branch}
                                    onChange={(e) => setBranchFormData((prev) => ({ ...prev, Branch: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Country Code</label>
                                <input
                                    type="text"
                                    value={branchFormData.CountryCode}
                                    onChange={(e) => setBranchFormData((prev) => ({ ...prev, CountryCode: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    value={branchFormData.PhoneNumber}
                                    onChange={(e) => setBranchFormData((prev) => ({ ...prev, PhoneNumber: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">Location</label>
                                <input
                                    type="text"
                                    value={branchFormData.Location}
                                    onChange={(e) => setBranchFormData((prev) => ({ ...prev, Location: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            {/* <div>
                                <label className="text-sm text-gray-700">Branch Manager User ID</label>
                                <input
                                    type="number"
                                    value={branchFormData.BranchManager}
                                    onChange={(e) => setBranchFormData((prev) => ({ ...prev, BranchManager: Number(e.target.value) || 0 }))}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </div> */}
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowBranchModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingBranchId ? handleUpdateBranch : handleAddBranch}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ backgroundColor: "#c53030" }}
                            >
                                {editingBranchId ? "Update" : "Add"} Branch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomizePage;