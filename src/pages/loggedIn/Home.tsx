import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import ApplicationContext from "../../../resources/providers/ApplicationContext";
import { PageBanner, StatTile, Panel, EmptyState } from "../components/PageUi";

const HomePage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);

    useEffect(()=>{
        document.title = "Home"
        getCategories();
    }, [])

    const getCategories = async () => {
        await applicationContext!.fetchCategories();
    }

    const categories = applicationContext?.categories ?? [];

    const quickLinks = [
        { to: "/admin/categories", icon: "material-symbols-light:category-outline", label: "Categories", description: "Categories, features & purposes" },
        { to: "/admin/items", icon: "material-symbols-light:inventory-2-outline", label: "Items", description: "Products, pricing & stock" },
        { to: "/admin/orders", icon: "material-symbols-light:receipt-long-outline", label: "Orders", description: "Create and review orders" },
    ];

    return <div className="flex flex-col gap-4 whitespace-normal p-4 md:p-6">
        <PageBanner
            icon="material-symbols-light:home-outline"
            eyebrow="Dashboard"
            title="Welcome back"
            description="Jump into categories, items and orders — everything is one click away."
            aside={
                <StatTile
                    icon="material-symbols-light:category-outline"
                    label="Categories"
                    value={categories.length}
                />
            }
        />

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
                <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#c53030] transition group-hover:bg-[#c53030] group-hover:text-white">
                        <Icon icon={link.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-gray-800">{link.label}</span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500">{link.description}</span>
                    </span>
                    <Icon icon="material-symbols-light:arrow-forward-outline" className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-[#c53030]" />
                </Link>
            ))}
        </section>

        <Panel title="Categories" description="A quick look at the categories you have set up." scroll>
            {categories.length === 0 ? (
                <EmptyState
                    icon="material-symbols-light:category-outline"
                    title="No categories found."
                    hint="Create your first category from the Categories page."
                />
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {categories.map((category, index) => (
                        <div
                            key={(category.CategoryId ?? index).toString()}
                            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition hover:border-red-200 hover:bg-red-50/30"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-red-50 text-sm font-semibold text-[#c53030]">
                                {category.ImagePath ? (
                                    <img src={category.ImagePath} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    (category.CategoryName || "?").charAt(0).toUpperCase()
                                )}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-800">{category.CategoryName}</p>
                                <p className="truncate text-xs text-gray-500">{category.Description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Panel>
        <section></section>
    </div>
}

export default HomePage;
