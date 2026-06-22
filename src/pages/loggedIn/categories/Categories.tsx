import React, { useEffect, useContext } from "react";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import CategoryRoutes from "./CategoryRoutes";
import { Link } from "react-router-dom";

const CategoriesPage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);

    useEffect(()=>{
        document.title = "Home"
        getCategories();
    }, [])

    const getCategories = async () => {
        await applicationContext!.fetchCategories();
        await applicationContext!.fetchFeatures();
        await applicationContext!.fetchPurposes();
    }

    return <div className="flex flex-col whitespace-normal p-4">
        <section className="mb-6">
            <div className="grid grid-cols-3 gap-4">
                <Link to="/admin/categories/categories" className="text-white font-semibold py-8 px-4 rounded-lg transition duration-200" style={{backgroundColor: "#c53030"}}>
                    Categories
                </Link>
                <Link to="/admin/categories/features" className="text-white font-semibold py-8 px-4 rounded-lg transition duration-200" style={{backgroundColor: "#c53030"}}>
                    Features
                </Link>
                <Link to="/admin/categories/purposes" className="text-white font-semibold py-8 px-4 rounded-lg transition duration-200" style={{backgroundColor: "#c53030"}}>
                    Purposes
                </Link>
            </div>
        </section>
        <CategoryRoutes />
    </div>
}

export default CategoriesPage;