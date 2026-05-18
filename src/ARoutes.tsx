import React from "react";
import { Route, Routes, Navigate, BrowserRouter as Router } from "react-router-dom";
import { ApplicationProvider } from "../resources/providers/ApplicationProvider.tsx";
import { useTokenExpiry } from './hooks/useAuth';
import Menu from "./pages/loggedIn/Menu.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
// import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from "./pages/SignUpPage.tsx";


const ARoutes: React.FC = () => {
  // const appContext = useContext(ApplicationContext);
  useTokenExpiry();

    return <ApplicationProvider>
              <Router>
                <Routes>
                    {/* <Route path='/' element={<App />} /> */}
                    <Route path='/about' element={<AboutPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/signup' element={<SignUpPage />} />
                    {/* <Route path='/learn/*' element={<ProtectedRoute><Menu /></ProtectedRoute>} /> */}
                    <Route path='/admin/*' element={<Menu />} />
                    <Route path="*" element={<Navigate replace to="/admin/home" />} />
                </Routes>
              </Router>
            </ApplicationProvider>
}

export default ARoutes;