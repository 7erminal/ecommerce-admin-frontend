import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ApplicationContext from "../../../../resources/providers/ApplicationContext";
import HomePage from "../Home";
import LoadingOverlay from "../../../components/LoadingOverlay";
import CategoriesPage from "../categories/Categories";
import ItemsPage from "../Items";
import CustomizePage from "../Customize";
import CategoriesSection from "./CategoriesSection";
import FeaturesSection from "./FeaturesSection";
import PurposesSection from "./PurposesSection";
// import ActivityTracker from "./resources/ActivityTracker.tsx";
// import ApplicationContext from './resources/contexts/ApplicationContext';
// import NotififcationModal from "./components/NotificationModal.tsx";
// import Loading from "./widgets/Loading.tsx";



const CategoryRoutes: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);

    return <>
            <Routes>
                {/* <Route path="*" element={<NotFoundPage />} /> */}
                {/* <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} /> */}
                <Route path='/categories' element={<CategoriesSection />} />
                <Route path='/features' element={<FeaturesSection />} />
                <Route path='/purposes' element={<PurposesSection />} />
                {/* <Route path="/" element={<Navigate replace to="/admin/categories/categories" />} /> */}
                {/* <Route path="*" element={<Navigate replace to="/" />} /> */}
            </Routes>
            {/* <Invoice showModal={showInvoice} handleClose={handleShowInvoiceModalClose} invoice={selectedInvoice} />
            <NotififcationModal notificationProps={appContext!.notificationProps!} />
            <Loading show={systemContext?.loading} handleClose={appContext!.handleLoadingClose} /> */}
            {applicationContext?.loading ? <LoadingOverlay /> : null}
        </>
            
}

export default CategoryRoutes;