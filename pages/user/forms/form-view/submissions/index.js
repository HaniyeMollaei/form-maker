// ✅ صفحه نمایش لیست ثبت‌نامی‌ها همراه با مدیریت وضعیت در تب‌ها

import { useEffect, useState } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import Navbar from "../../../../../components/ui/Navbar";

const predefinedFieldLabels = {
    fullName: "نام و نام خانوادگی",
    phone: "شماره تماس",
    email: "ایمیل",
    telegram: "آیدی تلگرام",
    instagram: "صفحه اینستاگرام",
    location: "محل زندگی",
    nationalId: "کد ملی",
    age: "سن",
    gender: "جنسیت",
    description: "توضیحات",
    // amount: "مبلغ پیشنهادی",
    // selected_time: "زمان انتخاب شده"
};

export default function ViewSubmissions() {
    const [form, setForm] = useState(null);
    const [allEntries, setAllEntries] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");

    useEffect(() => {
        const formId = localStorage.getItem("view-submission-form-id");
        const allForms = JSON.parse(localStorage.getItem("published-forms")) || [];
        const matchedForm = allForms.find((f) => f.id === formId);
        setForm(matchedForm);

        const allSubmissions = JSON.parse(localStorage.getItem("form-submissions")) || {};
        const entries = allSubmissions[formId] || [];
        const entriesWithStatus = entries.map((entry) => ({
            ...entry,
            status: entry.status || "pending",
        }));
        setAllEntries(entriesWithStatus);
    }, []);

    const updateStatus = (index, newStatus) => {
        toast.success(`✅ وضعیت به '${newStatus === "approved" ? "تایید شده" : "رد شده"}' تغییر یافت`, {
            position: "top-center",
            theme: "colored",
        });
        setAllEntries((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], status: newStatus };

            // ذخیره در localStorage
            const formId = localStorage.getItem("view-submission-form-id");
            const existing = JSON.parse(localStorage.getItem("form-submissions")) || {};
            existing[formId] = updated;
            localStorage.setItem("form-submissions", JSON.stringify(existing));

            return updated;
        });
    };

    const renderTable = (status) => {
        const filtered = allEntries.filter((e) => e.status === status);
        if (filtered.length === 0) return <p className="text-sm">موردی وجود ندارد.</p>;

        return (
            <div className="overflow-x-auto mt-4">
                <table className="table-auto w-full border text-sm">
                    <thead className="bg-gray-200">
                    <tr>
                        {form.fields.map((key) => (
                            <th key={key} className="px-4 py-2 border">
                                {predefinedFieldLabels[key] || key}
                            </th>
                        ))}
                        <th className="px-4 py-2 border">وضعیت</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((entry, idx) => (
                        <tr
                            key={idx}
                            className={
                                status === "approved"
                                    ? "bg-green-50"
                                    : status === "rejected"
                                        ? "bg-red-50"
                                        : ""
                            }
                        >
                            {form.fields.map((key) => (
                                <td key={key} className="px-4 py-2 border">
                                    {entry[key] || "-"}
                                </td>
                            ))}
                            <td className="px-4 py-2 border text-center">
                                {entry.status === "pending" ? (
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => updateStatus(idx, "approved")}
                                            className="text-green-600 hover:text-green-800"
                                            title="تایید"
                                        >
                                            ✅
                                        </button>
                                        <button
                                            onClick={() => updateStatus(idx, "rejected")}
                                            className="text-red-600 hover:text-red-800"
                                            title="رد"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ) : (
                                    entry.status === "approved" ? "تایید شده" : "رد شده"
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    if (!form) return <p className="text-center mt-10">⏳ در حال بارگذاری...</p>;

    return (
        <>
            <Head>
                <title>لیست ثبت‌نامی‌ها - {form.title}</title>
            </Head>

            <Navbar />

            <main dir="rtl" className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
                    <h1 className="text-2xl font-bold text-[#A62626] mb-6">
                        ثبت‌نامی‌های فرم: {form.title}
                    </h1>

                    <div className="flex gap-3 mb-4">
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-[#A62626] text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            در انتظار بررسی
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "approved" ? "bg-[#A62626] text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("approved")}
                        >
                            تایید شده‌ها
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "rejected" ? "bg-[#A62626] text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("rejected")}
                        >
                            رد شده‌ها
                        </button>
                    </div>

                    {renderTable(activeTab)}
                </div>
            </main>
        </>
    );
}
