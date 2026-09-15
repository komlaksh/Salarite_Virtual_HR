"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api.js";

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        candidate_name: "",
        task_id: "",
        mode: "video",
        meeting_link: "",
        interview_date: "",
        interview_time: ""
    });

    const getData = async (showLoading = false) => {
        if (showLoading) {
            setIsLoading(true);
        }

        try {
            const [interviewRes, taskRes] = await Promise.all([
                api.get("/interviews/"),
                api.get("/tasks/")
            ]);

            setInterviews(interviewRes.data);
            setTasks(taskRes.data);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load interview data."
            );
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getData(true);

        const t = setInterval(() => {
            getData();
        }, 5000);

        return () => clearInterval(t);
    }, []);

    const scheduleInterview = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            await api.post("/interviews/", {
                ...form,
                task_id: form.task_id ? Number(form.task_id) : null
            });

            setForm({
                candidate_name: "",
                task_id: "",
                mode: "video",
                meeting_link: "",
                interview_date: "",
                interview_time: ""
            });

            setSuccess("Interview scheduled successfully.");
            await getData();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to schedule interview."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            Schedule candidate interviews.
                        </h1>

                        <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                            Coordinate voice, video and chat interviews from one place.
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

                {success && (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <div className="mt-8 grid items-start gap-6 lg:grid-cols-[0.8fr_1.4fr]">

                    <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300/30 sm:p-8">
                        <p className="text-sm font-medium text-emerald-300">
                            New interview
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold">
                            Set up the next conversation.
                        </h2>

                        <form
                            onSubmit={scheduleInterview}
                            className="mt-8 space-y-5"
                        >
                            <label className="block text-sm font-medium text-slate-300">
                                Candidate name

                                <input
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    placeholder="e.g. Rahul Sharma"
                                    value={form.candidate_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            candidate_name: e.target.value
                                        })
                                    }
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-300">
                                Related task

                                <select
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    value={form.task_id}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            task_id: e.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        No related task
                                    </option>

                                    {tasks.map((task) => (
                                        <option
                                            key={task.id}
                                            value={task.id}
                                        >
                                            #{task.id} - {task.title}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-300">
                                Interview mode

                                <select
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    value={form.mode}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            mode: e.target.value
                                        })
                                    }
                                >
                                    <option value="video">Video</option>
                                    <option value="voice">Voice</option>
                                    <option value="chat">Chat</option>
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-300">
                                Meeting link

                                <input
                                    type="url"
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    placeholder="https://meet.google.com/..."
                                    value={form.meeting_link}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            meeting_link: e.target.value
                                        })
                                    }
                                    required
                                />
                                <span className="mt-2 block text-xs font-normal text-slate-500">
                                    Paste the video, voice, or chat room link.
                                </span>
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-medium text-slate-300">
                                    Date

                                    <input
                                        type="date"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        value={form.interview_date}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                interview_date: e.target.value
                                            })
                                        }
                                        required
                                    />
                                </label>

                                <label className="block text-sm font-medium text-slate-300">
                                    Time

                                    <input
                                        type="time"
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                        value={form.interview_time}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                interview_time: e.target.value
                                            })
                                        }
                                        required
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-xl bg-emerald-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "Scheduling..."
                                    : "Schedule interview"}
                            </button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">
                                    Interview calendar
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                                    Scheduled interviews
                                </h2>
                            </div>

                            <button
                                onClick={() => getData()}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                Refresh
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">

                            {isLoading && (
                                <p className="py-10 text-center text-sm text-slate-400">
                                    Loading interviews...
                                </p>
                            )}

                            {!isLoading &&
                                interviews.map((interview) => (
                                    <article
                                        key={interview.id}
                                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {interview.candidate_name}
                                                    </h3>

                                                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                                                        {interview.mode}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm text-slate-500">
                                                    {interview.interview_date} at{" "}
                                                    {interview.interview_time}
                                                </p>

                                                {interview.task_id && (
                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Related task #{interview.task_id}
                                                    </p>
                                                )}
                                            </div>

                                            <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                                                {interview.status}
                                            </span>
                                        </div>

                                        <div className="mt-5 border-t border-slate-200/70 pt-4">
                                            {interview.meeting_link ? (
                                                <a
                                                    href={interview.meeting_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                                                >
                                                    Join {interview.mode} interview
                                                </a>
                                            ) : (
                                                <span className="text-sm text-amber-600">
                                                    Meeting link not added
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                ))}

                            {!isLoading && interviews.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                                    <p className="font-medium text-slate-700">
                                        No interviews scheduled
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Schedule an interview to see it here.
                                    </p>
                                </div>
                            )}

                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}