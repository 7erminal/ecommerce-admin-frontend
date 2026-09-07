import React, { useEffect, useState } from "react";

type Tab = "applications" | "themes" | "appearance";

interface Theme {
    ThemeId?: number;
    ThemeCode: string;
    ThemeName: string;
    ThemeConfig?: Record<string, unknown>;
}

interface Application {
    ApplicationId?: number;
    ApplicationCode: string;
    ApplicationName: string;
    ApplicationLogo?: string;
    ApplicationImage?: string;
    ThemeColors?: string[];
    DefaultFontsize?: string;
    ThemeCode: string;
    DateCreated?: string;
    DateModified?: string;
    Active?: number;
}

interface AppearanceSettings {
    themeColors: string[];
    defaultFontSize: string;
    bannerImage: string;
    showBanners: boolean;
    borderRadius: string;
    template: string;
}

const CustomizePage: React.FC = () => {
    // const applicationContext = useContext(ApplicationContext);
    const [activeTab, setActiveTab] = useState<Tab>("applications");
    
    // Applications state
    const [applications, setApplications] = useState<Application[]>([]);
    const [showAddAppModal, setShowAddAppModal] = useState(false);
    const [appFormData, setAppFormData] = useState<Application>({
        ApplicationCode: "",
        ApplicationName: "",
        ApplicationLogo: "",
        ApplicationImage: "",
        ThemeColors: [],
        DefaultFontsize: "14",
        ThemeCode: "",
    });
    const [editingAppId, setEditingAppId] = useState<number | null>(null);

    // Themes state
    const [themes, setThemes] = useState<Theme[]>([]);
    const [showAddThemeModal, setShowAddThemeModal] = useState(false);
    const [themeFormData, setThemeFormData] = useState<Theme>({
        ThemeCode: "",
        ThemeName: "",
        ThemeConfig: {},
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

    useEffect(() => {
        document.title = "Customize";
    }, []);

    // ===== APPLICATION HANDLERS =====
    const handleAddApp = async () => {
        if (!appFormData.ApplicationCode.trim() || !appFormData.ApplicationName.trim() || !appFormData.ThemeCode.trim()) {
            alert("Application Code, Name, and Theme Code are required");
            return;
        }

        // Here you would call your API to add the application
        console.log("Adding application:", appFormData);
        
        // For now, add to local state
        const newApp: Application = {
            ApplicationId: Date.now(),
            ...appFormData,
        };
        setApplications([...applications, newApp]);
        resetAppForm();
        setShowAddAppModal(false);
    };

    const handleUpdateApp = async () => {
        if (!appFormData.ApplicationCode.trim() || !appFormData.ApplicationName.trim() || !appFormData.ThemeCode.trim()) {
            alert("Application Code, Name, and Theme Code are required");
            return;
        }

        console.log("Updating application:", appFormData);

        setApplications(applications.map(app => 
            app.ApplicationId === editingAppId ? { ...appFormData, ApplicationId: editingAppId } : app
        ));
        resetAppForm();
        setEditingAppId(null);
        setShowAddAppModal(false);
    };

    const handleDeleteApp = (appId: number | undefined) => {
        if (!appId) return;
        if (window.confirm("Are you sure you want to delete this application?")) {
            setApplications(applications.filter(app => app.ApplicationId !== appId));
        }
    };

    const resetAppForm = () => {
        setAppFormData({
            ApplicationCode: "",
            ApplicationName: "",
            ApplicationLogo: "",
            ApplicationImage: "",
            ThemeColors: [],
            DefaultFontsize: "14",
            ThemeCode: "",
        });
        setEditingAppId(null);
    };

    const openEditAppModal = (app: Application) => {
        setAppFormData(app);
        setEditingAppId(app.ApplicationId || null);
        setShowAddAppModal(true);
    };

    // ===== THEME HANDLERS =====
    const handleAddTheme = async () => {
        if (!themeFormData.ThemeCode.trim() || !themeFormData.ThemeName.trim()) {
            alert("Theme Code and Theme Name are required");
            return;
        }

        console.log("Adding theme:", themeFormData);

        const newTheme: Theme = {
            ThemeId: Date.now(),
            ...themeFormData,
        };
        setThemes([...themes, newTheme]);
        resetThemeForm();
        setShowAddThemeModal(false);
    };

    const handleUpdateTheme = async () => {
        if (!themeFormData.ThemeCode.trim() || !themeFormData.ThemeName.trim()) {
            alert("Theme Code and Theme Name are required");
            return;
        }

        console.log("Updating theme:", themeFormData);

        setThemes(themes.map(theme =>
            theme.ThemeId === editingThemeId ? { ...themeFormData, ThemeId: editingThemeId } : theme
        ));
        resetThemeForm();
        setEditingThemeId(null);
        setShowAddThemeModal(false);
    };

    const handleDeleteTheme = (themeId: number | undefined) => {
        if (!themeId) return;
        if (window.confirm("Are you sure you want to delete this theme?")) {
            setThemes(themes.filter(theme => theme.ThemeId !== themeId));
        }
    };

    const resetThemeForm = () => {
        setThemeFormData({
            ThemeCode: "",
            ThemeName: "",
            ThemeConfig: {},
        });
        setEditingThemeId(null);
    };

    const openEditThemeModal = (theme: Theme) => {
        setThemeFormData(theme);
        setEditingThemeId(theme.ThemeId || null);
        setShowAddThemeModal(true);
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

                    {applications.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                            No applications available.
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.ApplicationId} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Application Code</p>
                                        <h3 className="text-lg font-semibold text-gray-800">{app.ApplicationCode}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{app.ApplicationName}</p>
                                        <p className="text-xs text-gray-500 mt-1">Theme: {app.ThemeCode}</p>
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

                    {themes.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                            No themes available.
                        </div>
                    ) : (
                        themes.map((theme) => (
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

                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6">
                        {/* Theme Colors */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme Colors</h3>
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
                            <label className="text-sm text-gray-700 block">Banner Image URL</label>
                            <input
                                type="text"
                                value={appearanceSettings.bannerImage}
                                onChange={(e) => handleAppearanceChange("bannerImage", e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="https://example.com/banner.jpg"
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
                                <label className="text-sm text-gray-700">Application Code</label>
                                <input
                                    type="text"
                                    value={appFormData.ApplicationCode}
                                    onChange={(e) => setAppFormData({...appFormData, ApplicationCode: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="e.g., APP001"
                                />
                            </div>

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
                                <label className="text-sm text-gray-700">Application Logo URL</label>
                                <input
                                    type="text"
                                    value={appFormData.ApplicationLogo || ""}
                                    onChange={(e) => setAppFormData({...appFormData, ApplicationLogo: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700">Application Image URL</label>
                                <input
                                    type="text"
                                    value={appFormData.ApplicationImage || ""}
                                    onChange={(e) => setAppFormData({...appFormData, ApplicationImage: e.target.value})}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="https://example.com/image.png"
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
                                    {themes.map((theme) => (
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
        </div>
    );
};

export default CustomizePage;