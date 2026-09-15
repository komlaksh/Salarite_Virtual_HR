"use client";

import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "Virtual HR",
    created_by: "Employer",
    priority: "medium"
  });

  const getTasks = async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const res = await api.get("/tasks/");
      setTasks(res.data);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
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

  const createTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/tasks/", form);
      setForm({
        title: "",
        description: "",
        assigned_to: "Virtual HR",
        created_by: "Employer",
        priority: "medium"
      });
      setSuccess("Task assigned successfully.");
      await getTasks();
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        "The task could not be assigned. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleTasks = tasks.filter(
    (task) => filter === "all" || task.status === filter
  );
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const activeTasks = tasks.filter((task) => task.status !== "completed").length;
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length;

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Salarite / Virtual HR
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Keep every hiring task moving.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
              A focused command center for assigning work and tracking your team&apos;s progress.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            <p className="font-semibold">Today&apos;s workspace</p>
            <p className="mt-1 text-emerald-700">{activeTasks} active tasks in motion</p>
          </div>
        </header>

        <section className="grid gap-4 py-7 sm:grid-cols-3" aria-label="Task summary">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Total tasks</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{tasks.length}</p>
            <p className="mt-1 text-sm text-slate-400">Across your workspace</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-700">{completedTasks}</p>
            <p className="mt-1 text-sm text-slate-400">Ready for review</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">High priority</p>
            <p className="mt-3 text-3xl font-semibold text-amber-600">{highPriorityTasks}</p>
            <p className="mt-1 text-sm text-slate-400">Needs close attention</p>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.4fr)]">
          <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300/30 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-300">New assignment</p>
                <h2 className="mt-2 text-2xl font-semibold">Give your team a clear next step.</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">01</span>
            </div>

            <form onSubmit={createTask} className="mt-8 space-y-5">
              <label className="block text-sm font-medium text-slate-300">
                Task title
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  placeholder="e.g. Review candidate pipeline"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-300">
                What needs to happen?
                <textarea
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  placeholder="Add useful context for the person handling this task."
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-300">
                  Assigned to
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    value={form.assigned_to}
                    onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  Priority
                  <select
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Assigning..." : "Assign task"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Live overview</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Task monitoring</h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Filter tasks by status"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-emerald-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={getTasks}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Refresh
                </button>
                <span
                  title="Tasks refresh automatically every 5 seconds"
                  className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-emerald-700"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Auto-refreshing
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {isLoading && <p className="py-8 text-center text-sm text-slate-400">Loading your tasks...</p>}
              {!isLoading && visibleTasks.map((task) => (
                <article key={task.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${task.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"}`}>
                          {task.priority} priority
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{task.description || "No description provided."}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${task.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-xs text-slate-500">
                    <span>Assigned to <strong className="font-medium text-slate-700">{task.assigned_to}</strong></span>
                    <span>#{String(task.id).padStart(3, "0")}</span>
                  </div>
                </article>
              ))}
              {!isLoading && visibleTasks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                  <p className="font-medium text-slate-700">No matching tasks</p>
                  <p className="mt-1 text-sm text-slate-400">Try another filter or assign a new task.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}