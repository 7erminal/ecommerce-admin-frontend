import React from "react";
import { Icon } from "@iconify/react";

/**
 * Presentation-only building blocks shared by the admin pages.
 * These exports contain no business logic - just styling helpers and markup
 * so every page keeps the same template theme and theme color (#c53030).
 */

export const primaryBtnClass =
    "inline-flex items-center gap-2 rounded-xl bg-[#c53030] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9b2226] focus:outline-none focus:ring-2 focus:ring-red-200";

export const ghostBtnClass =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:text-[#c53030] hover:bg-red-50";

export const dangerBtnClass =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50";

export const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 transition placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100";

export const selectClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 transition focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100";

export const Eyebrow: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c53030]">
        <Icon icon={icon} className="h-3.5 w-3.5" />
        {children}
    </span>
);

export const StatTile: React.FC<{ icon: string; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 px-4 py-2.5 shadow-sm">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#c53030]">
            <Icon icon={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
            <p className="text-lg font-semibold leading-none text-gray-800">{value}</p>
            <p className="mt-1 truncate text-xs text-gray-500">{label}</p>
        </div>
    </div>
);

export const PageBanner: React.FC<{
    icon: string;
    eyebrow: string;
    title: string;
    description?: string;
    actions?: React.ReactNode;
    aside?: React.ReactNode;
}> = ({ icon, eyebrow, title, description, actions, aside }) => (
    <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-white p-5">
        <div className="pointer-events-none absolute -top-24 -right-16 h-52 w-52 rounded-full bg-red-50" />
        <div className="pointer-events-none absolute -bottom-28 right-32 h-44 w-44 rounded-full bg-red-100/40" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
                <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
                <h2 className="mt-2 text-xl font-semibold text-gray-800">{title}</h2>
                {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
                {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
            </div>
            {aside ? <div className="flex flex-wrap gap-2 sm:gap-3">{aside}</div> : null}
        </div>
    </div>
);

export const Panel: React.FC<{
    title: string;
    description?: string;
    action?: React.ReactNode;
    scroll?: boolean;
    children: React.ReactNode;
}> = ({ title, description, action, scroll = false, children }) => (
    <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {description ? <p className="text-sm text-gray-500">{description}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        <div className={scroll ? "max-h-[58vh] overflow-y-auto p-5" : "p-5"}>{children}</div>
    </div>
);

export const EmptyState: React.FC<{ icon: string; title: string; hint?: string }> = ({ icon, title, hint }) => (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-red-200 bg-red-50/40 px-4 py-10 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#c53030] shadow-sm">
            <Icon icon={icon} className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
    </div>
);

export const SwitchCard: React.FC<{
    icon: string;
    label: string;
    description?: string;
    count?: number;
    isActive: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}> = ({ icon, label, description, count, isActive, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
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
            <Icon icon={icon} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
            <span className={`block text-sm font-semibold ${isActive ? "text-[#c53030]" : "text-gray-800"}`}>{label}</span>
            {description ? <span className="mt-0.5 block truncate text-xs text-gray-500">{description}</span> : null}
        </span>
        {typeof count === "number" ? (
            <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold transition ${
                    isActive ? "bg-[#c53030] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-[#c53030]"
                }`}
            >
                {count}
            </span>
        ) : null}
        {children}
    </button>
);
