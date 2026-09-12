import React, { useState, useEffect } from 'react';
import { applicationService } from '../../../services/applicationService';
import type { ApplicationResp, AddApplication, UpdateApplication, ApplicationFormData } from '../../../../resources/types/applicationTypes';
import axios from 'axios';

const Application: React.FC = () => {
    const [applications, setApplications] = useState<ApplicationResp[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAppId, setEditingAppId] = useState<string | null>(null);

    const [formData, setFormData] = useState<ApplicationFormData>({
        ApplicationCode: "",
        ApplicationName: "",
        ApplicationLogo: "",
        ApplicationImage: "",
        ThemeColors: "",
        DefaultFontsize: "14",
        ThemeCode: "",
    });

    useEffect(() => {
        document.title = "Applications";
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await applicationService.fetchApplications();
            console.log('[Application.tsx fetchApplications] Response:', response);
            
            if (response.Success && response.Result?.Data) {
                setApplications(response.Result.Data);
            }
            setError(null);
        } catch (err) {
            console.error('[Application.tsx fetchApplications] Error:', err);
            setError('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleAddApplication = async () => {
        if (!formData.ApplicationCode.trim() || !formData.ApplicationName.trim() || !formData.ThemeCode.trim()) {
            alert("Application Code, Name, and Theme Code are required");
            return;
        }

        try {
            const payload: AddApplication = {
                application_name: formData.ApplicationName,
                application_logo: formData.ApplicationLogo || "",
                application_image: formData.ApplicationImage || "",
                theme_colors: Array.isArray(formData.ThemeColors) ? formData.ThemeColors.join(',') : formData.ThemeColors || "",
                default_fontsize: formData.DefaultFontsize || "14",
                theme_code: formData.ThemeCode,
            };

            const response = await applicationService.addApplication(payload);
            console.log('[handleAddApplication] Response:', response);

            if (response.Success) {
                fetchApplications();
                resetForm();
                setShowAddModal(false);
            } else {
                setError(response.StatusDesc || 'Failed to add application');
            }
        } catch (err) {
            console.error('[handleAddApplication] Error:', err);
            setError('Failed to add application');
        }
    };

    const handleUpdateApplication = async () => {
        if (!formData.ApplicationName.trim() || !formData.ThemeCode.trim()) {
            alert("Application Name and Theme Code are required");
            return;
        }

        try {
            const payload: UpdateApplication = {
                application_name: formData.ApplicationName,
                application_logo: formData.ApplicationLogo || "",
                application_image: formData.ApplicationImage || "",
                theme_colors: Array.isArray(formData.ThemeColors) ? formData.ThemeColors.join(',') : formData.ThemeColors || "",
                default_fontsize: formData.DefaultFontsize || "14",
                theme_code: formData.ThemeCode,
                updated_by: parseInt(sessionStorage.getItem('userId') || '0'),
            };

            const response = await applicationService.updateApplication(editingAppId || '', payload);
            console.log('[handleUpdateApplication] Response:', response);

            if (response.Success) {
                fetchApplications();
                resetForm();
                setShowAddModal(false);
                setEditingAppId(null);
            } else {
                setError(response.StatusDesc || 'Failed to update application');
            }
        } catch (err) {
            console.error('[handleUpdateApplication] Error:', err);
            setError('Failed to update application');
        }
    };

    const handleDeleteApplication = async (appId: string | undefined) => {
        if (!appId) return;

        if (!window.confirm("Are you sure you want to delete this application?")) return;

        try {
            const response = await applicationService.deleteApplication(appId);
            console.log('[handleDeleteApplication] Response:', response);

            if (response.Success) {
                fetchApplications();
            } else {
                setError(response.StatusDesc || 'Failed to delete application');
            }
        } catch (err) {
            console.error('[handleDeleteApplication] Error:', err);
            setError('Failed to delete application');
        }
    };

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem('token');
            // Call logout API to cancel refresh token
            await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/logout`,
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                }
            );
            console.log('[handleLogout] Logout successful');
        } catch (err) {
            console.error('[handleLogout] Error:', err);
        } finally {
            // Clear tokens regardless of API response
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('applicationCode');
            
            // Redirect to login
            window.location.href = '/login';
        }
    };

    const resetForm = () => {
        setFormData({
            ApplicationCode: "",
            ApplicationName: "",
            ApplicationLogo: "",
            ApplicationImage: "",
            ThemeColors: "",
            DefaultFontsize: "14",
            ThemeCode: "",
        });
        setEditingAppId(null);
    };

    const openEditModal = (app: ApplicationResp) => {
        setFormData({
            ApplicationCode: app.ApplicationCode,
            ApplicationName: app.ApplicationName,
            ApplicationLogo: app.ApplicationLogo,
            ApplicationImage: app.ApplicationImage,
            ThemeColors: app.ThemeColors,
            DefaultFontsize: app.DefaultFontsize,
            ThemeCode: app.Theme?.ThemeCode || "",
        });
        setEditingAppId(app.ApplicationId || null);
        setShowAddModal(true);
    };

    const openAddModal = () => {
        resetForm();
        setEditingAppId(null);
        setShowAddModal(true);
    };

    const handleThemeColorChange = (index: number, value: string) => {
        const colors = formData.ThemeColors ? formData.ThemeColors.split(',').map(c => c.trim()) : [];
        colors[index] = value;
        setFormData({ ...formData, ThemeColors: colors.join(',') });
    };

    const addThemeColor = () => {
        const colors = formData.ThemeColors ? formData.ThemeColors.split(',').map(c => c.trim()) : [];
        if (colors.length < 2) {
            colors.push("#000000");
            setFormData({ ...formData, ThemeColors: colors.join(',') });
        }
    };

    const removeThemeColor = (index: number) => {
        const colors = formData.ThemeColors ? formData.ThemeColors.split(',').map(c => c.trim()) : [];
        colors.splice(index, 1);
        setFormData({ ...formData, ThemeColors: colors.join(',') });
    };

    return (
        <div className="flex flex-col whitespace-normal p-4">
            {/* Header with Settings */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    {showSettings && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    handleLogout();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-4 font-bold hover:text-red-900"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Add Button */}
            <div className="mb-6">
                <button
                    onClick={openAddModal}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                    + Add Application
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8 text-gray-500">
                    Loading applications...
                </div>
            )}

            {/* Applications List */}
            {!loading && applications.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                    No applications available. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {applications.map((app) => (
                        <div
                            key={app.ApplicationId}
                            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{app.ApplicationName}</h3>
                                    <p className="text-sm text-gray-600">Code: {app.ApplicationCode}</p>
                                    {app.Theme?.ThemeCode && (
                                        <p className="text-sm text-gray-600">Theme: {app.Theme?.ThemeCode}</p>
                                    )}
                                    {app.DefaultFontsize && (
                                        <p className="text-sm text-gray-600">Font Size: {app.DefaultFontsize}px</p>
                                    )}
                                </div>
                                <div className="flex gap-2 md:flex-row flex-col">
                                    <button
                                        onClick={() => openEditModal(app)}
                                        className="px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg text-sm font-medium transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteApplication(app.ApplicationId)}
                                        className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-medium transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl border border-red-100 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editingAppId ? 'Edit Application' : 'Add New Application'}
                        </h2>

                        <div className="space-y-4">
                            {/* Application Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Application Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.ApplicationCode}
                                    onChange={(e) => setFormData({ ...formData, ApplicationCode: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g., APP001"
                                />
                            </div>

                            {/* Application Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Application Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.ApplicationName}
                                    onChange={(e) => setFormData({ ...formData, ApplicationName: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g., My Application"
                                />
                            </div>

                            {/* Theme Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Theme Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.ThemeCode}
                                    onChange={(e) => setFormData({ ...formData, ThemeCode: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g., THEME001"
                                />
                            </div>

                            {/* Application Logo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Application Logo (URL)
                                </label>
                                <input
                                    type="text"
                                    value={formData.ApplicationLogo || ""}
                                    onChange={(e) => setFormData({ ...formData, ApplicationLogo: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            {/* Application Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Application Image (URL)
                                </label>
                                <input
                                    type="text"
                                    value={formData.ApplicationImage || ""}
                                    onChange={(e) => setFormData({ ...formData, ApplicationImage: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="https://example.com/image.png"
                                />
                            </div>

                            {/* Default Font Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Default Font Size (px)
                                </label>
                                <input
                                    type="number"
                                    min={10}
                                    max={32}
                                    value={formData.DefaultFontsize || "14"}
                                    onChange={(e) => setFormData({ ...formData, DefaultFontsize: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Theme Colors */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Theme Colors
                                </label>
                                <div className="space-y-2">
                                    {(formData.ThemeColors ? formData.ThemeColors.split(',').map(c => c.trim()) : []).map((color, index) => (
                                        <div key={index} className="flex gap-2 items-center">
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
                                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="#000000"
                                            />
                                            <button
                                                onClick={() => removeThemeColor(index)}
                                                className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded text-sm font-medium transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {(formData.ThemeColors ? formData.ThemeColors.split(',').map(c => c.trim()).length : 0) < 2 && (
                                    <button
                                        onClick={addThemeColor}
                                        className="mt-3 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                                    >
                                        + Add Color
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Modal Buttons */}
                        <div className="mt-8 flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(false);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingAppId ? handleUpdateApplication : handleAddApplication}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                            >
                                {editingAppId ? 'Update Application' : 'Add Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Application;