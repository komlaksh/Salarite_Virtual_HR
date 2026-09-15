"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const path = usePathname();

    const links = [
        { name: "Employer Dashboard", href: "/" },
        { name: "Virtual HR", href: "/virtual_hr" },
        { name: "Interviews", href: "/interviews" }
    ];

    return (
        <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
            <div className="flex h-full flex-col">

                <div className="border-b border-slate-100 px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-emerald-400">
                            S
                        </div>

                        <div>
                            <h1 className="font-semibold text-slate-950">
                                Salarite
                            </h1>
                            <p className="text-xs text-slate-400">
                                Virtual HR
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex gap-2 overflow-x-auto p-4 lg:flex-col">
                    {links.map((link) => {
                        const active = path === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition ${active
                                        ? "bg-slate-950 text-white"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto hidden border-t border-slate-100 p-5 lg:block">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Workspace
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                        Employer & Virtual HR
                    </p>
                </div>

            </div>
        </aside>
    );
}
