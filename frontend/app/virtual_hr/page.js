"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function VirtualHR() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState("");

    const getTasks = async (showLoading = false) => {
        if (showLoading) {
            setIsLoading(true);
        }

        try {
            const res = await api.get("/tasks/");
            setTasks(res.data);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load tasks. Check that the backend is running."
            );
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getTasks(true);

        const t = setInterval(() => {
            getTasks();
        }, 5000);

        return () => clearInterval(t);
    }, []);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        setError("");

        try {
            await api.put(`/tasks/${id}`, { status });
            await getTasks();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to update task status."
            );
        } finally {
            setUpdating(null);
        }
    };

    const completed = tasks.filter(
        (task) => task.status === "completed"
    ).length;

    const active = tasks.filter(
        (task) => task.status !== "completed"
    ).length;

    return (
        <main className="min-h-screen bg-[#f4f7f6] text-slate-900">
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">

                <header className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            Salarite / Virtual HR
                        </div>

                        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            Your HR task queue.
                        </h1>

                        <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                            Manage assigned hiring tasks and keep the employer updated in real time.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Live
                        </div>

                        <p className="mt-1 text-sm text-emerald-700">
                            Updates every 5 seconds
                        </p>
                    </div>
                </header>

                {error && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="grid gap-4 py-7 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="text-sm font-medium text-slate-500">
                            Assigned tasks
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-slate-950">
                            {tasks.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="text-sm font-medium text-slate-500">
                            Active
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-blue-600">
                            {active}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="text-sm font-medium text-slate-500">
                            Completed
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-emerald-700">
                            {completed}
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">
                                Assigned work
                            </p>

                            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                                Task management
                            </h2>
                        </div>

                        <button
                            onClick={() => getTasks()}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="mt-6 space-y-4">

                        {isLoading && (
                            <p className="py-10 text-center text-sm text-slate-400">
                                Loading assigned tasks...
                            </p>
                        )}

                        {!isLoading && tasks.map((task) => (
                            <article
                                key={task.id}
                                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {task.title}
                                            </h3>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${task.priority === "high"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : task.priority === "medium"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-slate-200 text-slate-600"
                                                    }`}
                                            >
                                                {task.priority} priority
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {task.description || "No description provided."}
                                        </p>

                                        <p className="mt-3 text-xs text-slate-400">
                                            Task #{String(task.id).padStart(3, "0")}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${task.status === "completed"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : task.status === "in_progress"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-slate-200 text-slate-600"
                                            }`}
                                    >
                                        {task.status.replace("_", " ")}
                                    </span>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-200/70 pt-4">

                                    <button
                                        disabled={updating === task.id}
                                        onClick={() =>
                                            updateStatus(task.id, "pending")
                                        }
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Pending
                                    </button>

                                    <button
                                        disabled={updating === task.id}
                                        onClick={() =>
                                            updateStatus(task.id, "in_progress")
                                        }
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        In Progress
                                    </button>

                                    <button
                                        disabled={updating === task.id}
                                        onClick={() =>
                                            updateStatus(task.id, "completed")
                                        }
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Completed
                                    </button>

                                </div>
                            </article>
                        ))}

                        {!isLoading && tasks.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                                <p className="font-medium text-slate-700">
                                    No assigned tasks
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    New tasks assigned by the employer will appear here.
                                </p>
                            </div>
                        )}

                    </div>
                </section>
            </div>
        </main>
    );
};