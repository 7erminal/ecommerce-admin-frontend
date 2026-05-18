import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-teal-800 text-white py-8 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <p className="mb-4">&copy; 2026 SkillBuilder. All rights reserved.</p>
                <div className="flex justify-center space-x-6">
                    <a href="#" className="hover:text-teal-200 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-teal-200 transition">Terms of Service</a>
                    <a href="#" className="hover:text-teal-200 transition">Contact Us</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;