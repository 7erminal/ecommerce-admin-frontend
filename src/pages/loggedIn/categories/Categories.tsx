import React, { useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import CategoryRoutes from "./CategoryRoutes";
import { PageBanner } from "../../components/PageUi";

const CategoriesPage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);
    const location = useLocation();

    useEffect(()=>{
        document.title = "Home"
        getCategories();
    }, [])

    const getCategories = async () => {
        await applicationContext!.fetchCategories();
        await applicationContext!.fetchFeatures();
        await applicationContext!.fetchPurposes();
    }

    const tabs = [
        { to: "/admin/categories/categories", icon: "material-symbols-light:category-outline", label: "Categories", description: "Group your products" },
        { to: "/admin/categories/features", icon: "material-symbols-light:auto-awesome-outline", label: "Features", description: "Product attributes" },
        { to: "/admin/categories/purposes", icon: "material-symbols-light:target-outline", label: "Purposes", description: "Why customers buy" },
    ];

    return <div className="flex flex-col gap-4 whitespace-normal p-4 md:p-6">
        <PageBanner
            icon="material-symbols-light:category-outline"
            eyebrow="Catalog"
            title="Categories, Features & Purposes"
            description="The building blocks your items are organised with."
        />

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.to;
                return (
                    <Link
                        key={tab.to}
                        to={tab.to}
                        className={`group flex items-center gap-3 rounded-2xl border p-4 transition ${
                            isActive
                                ? "border-red-200 bg-red-50 shadow-sm"
                                : "border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/50"
                        }`}
                    >
                        <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                                isActive ? "bg-[#c53030] text-white shadow-sm" : "bg-red-50 text-[#c53030] group-hover:bg-white"
                            }`}
                        >
                            <Icon icon={tab.icon} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className={`block text-sm font-semibold ${isActive ? "text-[#c53030]" : "text-gray-800"}`}>
                                {tab.label}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-gray-500">{tab.description}</span>
                        </span>
                    </Link>
                );
            })}
        </section>
        <CategoryRoutes />
    </div>
}

export default CategoriesPage;
