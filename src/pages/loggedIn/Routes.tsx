import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ApplicationContext from "../../../resources/providers/ApplicationContext";
import AuthContext from "../../../resources/providers/AuthContext";
import HomePage from "./Home";
import LoadingOverlay from "../../components/LoadingOverlay";
import CategoriesPage from "./categories/Categories";
import ItemsPage from "./Items";
import CustomizePage from "./Customize";
// import ActivityTracker from "./resources/ActivityTracker.tsx";
// import ApplicationContext from './resources/contexts/ApplicationContext';
// import NotififcationModal from "./components/NotificationModal.tsx";
// import Loading from "./widgets/Loading.tsx";



const CustomRoutes: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authContext?.isAuthenticated) {
            navigate('/login', { replace: true });
            return;
        }

        if (authContext.isAuthenticated && authContext.refreshToken && authContext.accessToken) {
            const refreshTimer = setInterval(() => {
                if (authContext.isAuthenticated && authContext.refreshToken) {
                    if (authContext.refreshToken && authContext.accessToken) {
                        if (authContext.refreshToken && authContext.refreshSession) {
                            void authContext.refreshSession();
                        }
                    }
                }
            }, 30000);

            return () => clearInterval(refreshTimer);
        }
    }, [authContext, navigate]);

    if (!authContext?.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>
            <Routes>
                {/* <Route path="*" element={<NotFoundPage />} /> */}
                {/* <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} /> */}
                <Route path='/home' element={<HomePage />} />
                <Route path='/categories/*' element={<CategoriesPage />} />
                <Route path='/items' element={<ItemsPage />} />
                <Route path='/customize' element={<CustomizePage />} />
                <Route path="/" element={<Navigate replace to="/admin/home" />} />
                {/* <Route path="*" element={<Navigate replace to="/" />} /> */}
            </Routes>
            {/* <Invoice showModal={showInvoice} handleClose={handleShowInvoiceModalClose} invoice={selectedInvoice} />
            <NotififcationModal notificationProps={appContext!.notificationProps!} />
            <Loading show={systemContext?.loading} handleClose={appContext!.handleLoadingClose} /> */}
            {applicationContext?.loading ? <LoadingOverlay /> : null}
        </>
            
}

export default CustomRoutes;