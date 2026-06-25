import React from "react";

type PillOptionProps = {
    label: string;
    onClick: () => void;
    isSelected?: boolean;
};

const PillOption: React.FC<PillOptionProps> = ({ label, onClick, isSelected }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full border ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300"} transition duration-200`}
        >
            {label}
        </button>
    );
};

export default PillOption;