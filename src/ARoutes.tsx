import React from "react";
import { Route, Routes, Navigate, BrowserRouter as Router } from "react-router-dom";
import { ApplicationProvider } from "../resources/providers/ApplicationProvider";
import { AuthProvider } from "../resources/providers/AuthProvider";
import Menu from "./pages/loggedIn/Menu";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
// import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";


const ARoutes: React.FC = () => {
  // const appContext = useContext(ApplicationContext);

    return <Router>
              <ApplicationProvider>
              <AuthProvider>
                <Routes>
                    {/* <Route path='/' element={<App />} /> */}
                    <Route path='/about' element={<AboutPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/signup' element={<SignUpPage />} />
                    <Route path='/admin/*' element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate replace to="/admin/home" />} />
                </Routes>
              </AuthProvider>
              </ApplicationProvider>
            </Router>
}

export default ARoutes;