import React, { useContext } from "react";
import CustomRoutes from "./Routes";
import { Link } from 'react-router-dom';
import CustomNav from "../../components/CustomNav";
import { Icon } from "@iconify/react";
import ApplicationContext from "../../../resources/providers/ApplicationContext";

const Menu: React.FC = () => {
  const appContext = useContext(ApplicationContext);
    const adminMenuLinks = [
        { label: "Categories", to: "/admin/categories", menuKey: "categories" },
        { label: "Items", to: "/admin/items", menuKey: "items" },
        { label: "Customize", to: "/admin/customize", menuKey: "customize" },
    ];

    return (
    <div className='bg-white h-full w-full'>
                    <div className="bg-white text-gray-800 font-sans">
                        <div className="flex h-screen overflow-hidden">
                                                        <div className="hidden md:block md:w-1/5 relative">
                                <div className="absolute right-0 top-50 bottom-50 w-px bg-gray-300"></div>
                                
                                <div className="h-full p-6 pr-8 overflow-y-auto flex flex-col">
                                    {/* <h1 className="text-2xl font-bold mb-8 text-gray-800">Dashboard</h1> */}
                                    
                                    <nav className="space-y-2 flex flex-col gap-2 justify-center items-left flex-1">
                                        <Link to="/admin/categories" onClick={()=>{ appContext?.setActiveMenu("categories") }} className={"flex items-center p-3"+ (appContext?.activeMenuItem === "categories" ? " bg-gray-100" : " text-gray-800 hover:bg-gray-100") + " rounded-lg transition-colors duration-200"}>
                                            <Icon icon="material-symbols-light:category-outline" className="mx-4" style={{ color: "#c53030", fontSize: '20px' }} />
                                            Categories
                                        </Link>
                                        
                                        <Link to="/admin/items" onClick={()=>{ appContext?.setActiveMenu("items") }} className={"flex items-center p-3"+ (appContext?.activeMenuItem === "items" ? " bg-gray-100" : " text-gray-800 hover:bg-gray-100") + " rounded-lg transition-colors duration-200"}>
                                            <Icon icon="qlementine-icons:items-grid-24" className="mx-4" style={{ color: "#c53030", fontSize: '20px' }} />
                                            Items
                                        </Link>
                                        
                                         <Link to="/admin/customize" onClick={()=>{ appContext?.setActiveMenu("customize") }} className={"flex items-center p-3"+ (appContext?.activeMenuItem === "customize" ? " bg-gray-100" : " text-gray-800 hover:bg-gray-100") + " rounded-lg transition-colors duration-200"}>
                                            <Icon icon="material-symbols-light:inbox-customize-rounded" className="mx-4" style={{ color: "#c53030", fontSize: '20px' }} />
                                            Customize
                                        </Link>
                                        
                                        {/* <a href="#" className="flex items-center p-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            User Management
                                        </a>
                                        
                                        <a href="#" className="flex items-center p-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            Settings
                                        </a> */}
                                    </nav>
                                    
                                    {/* <div className="mt-12">
                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Activity</h2>
                                        <div className="space-y-3">
                                            <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                                <span className="font-medium">Video uploaded</span> - 2 hours ago
                                            </div>
                                            <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                                <span className="font-medium">Category added</span> - 1 day ago
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            
                                                        <div className="w-full md:w-4/5">
                                <div className="h-full custom-scrollbar overflow-y-auto">
                                                                        <header className="sticky top-0 z-10 bg-white px-4 md:px-8 py-4">
                                                                                <CustomNav
                                                                                    mobileAdminLinks={adminMenuLinks}
                                                                                    onMobileAdminLinkClick={(menuKey) => {
                                                                                        appContext?.setActiveMenu(menuKey);
                                                                                    }}
                                                                                />
                                    </header>
                                    
                                    <CustomRoutes />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            
}

export default Menu;