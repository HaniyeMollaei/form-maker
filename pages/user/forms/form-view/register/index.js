// ✅ صفحه نمایش فرم از نگاه دانش‌آموز به‌صورت داینامیک از localStorage (latest-preview-form)

import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../../../../../components/ui/Navbar";
import {router} from "next/client";

const fieldRenderMap = {
    fullName: {
        label: "نام و نام خانوادگی",
        render: (v, h) => <input {...h} required className="formInput" />,
    },
    phone: {
        label: "شماره تماس",
        render: (v, h) => <input type="tel" {...h} required className="formInput" />,
    },
    email: {
        label: "ایمیل",
        render: (v, h) => <input type="email" {...h} className="formInput" />,
    },
    telegram: {
        label: "آیدی تلگرام",
        render: (v, h) => <input {...h} className="formInput" />,
    },
    instagram: {
        label: "صفحه اینستاگرام",
        render: (v, h) => <input {...h} className="formInput" />,
    },
    location: {
        label: "محل زندگی",
        render: (v, h) => <input {...h} className="formInput" />,
    },
    nationalId: {
        label: "کد ملی",
        render: (v, h) => <input {...h} maxLength={10} pattern="\d{10}" className="formInput" />,
    },
    age: {
        label: "سن",
        render: (v, h) => <input type="number" {...h} max={120} className="formInput" />,
    },
    gender: {
        label: "جنسیت",
        render: (v, h) => (
            <select {...h} className="formInput">
                <option value="">انتخاب کنید</option>
                <option value="زن">زن</option>
                <option value="مرد">مرد</option>
            </select>
        ),
    },
    description: {
        label: "توضیحات",
        render: (v, h) => <input {...h} required className="formInput" />,
    },
};

export default function LivePreviewForm() {
    const [form, setForm] = useState(null);
    const [values, setValues] = useState({});

    useEffect(() => {
        const raw = localStorage.getItem("latest-preview-form");
        if (raw) {
            const parsed = JSON.parse(raw);
            setForm(parsed);
            const init = {};
            parsed.fields?.forEach((f) => (init[f] = ""));
            setValues(init);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const formId = form.id;
        const allResponses = JSON.parse(localStorage.getItem("form-submissions")) || {};
        const updatedResponses = {
            ...allResponses,
            [formId]: [...(allResponses[formId] || []), { ...values, status: "pending" }],
        };
        localStorage.setItem("form-submissions", JSON.stringify(updatedResponses));

        alert("✅ ثبت‌نام با موفقیت انجام شد.");

        setTimeout(() => {
            router.push("/");
        }, 800);
    };

    if (!form) return <p className="text-center mt-10">⏳ در حال بارگذاری فرم...</p>;

    return (
        <>
            <Head>
                <title>ثبت‌نام برای {form.title}</title>
            </Head>

            <Navbar />
            <main dir="rtl" className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                    <h1 className="text-2xl font-bold text-[#A62626] mb-2">{form.title}</h1>
                    <p className="mb-2 text-gray-600">{form.description}</p>

                    <ul className="mb-4 text-sm text-gray-700 space-y-1">
                        <li>👤 برگزارکننده: {form.organizer}</li>
                        <li>📍 مکان: {form.location}</li>
                        <li>🗓️ مهلت ثبت‌نام: {form.deadline}</li>
                        <li>💰 مبلغ کل: {form.totalAmount?.toLocaleString()} تومان</li>
                        {form.hasDeposit && (
                            <li>💳 بیعانه: {form.depositAmount?.toLocaleString()} تومان</li>
                        )}
                    </ul>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        {form.fields?.map((key) => {
                            const f = fieldRenderMap[key];
                            if (!f) return null;
                            return (
                                <div key={key}>
                                    <label className="block font-medium mb-1">{f.label}</label>
                                    {f.render(values[key], {
                                        name: key,
                                        value: values[key],
                                        onChange: handleChange,
                                    })}
                                </div>
                            );
                        })}

                        <button
                            type="submit"
                            className="bg-[#A62626] text-white py-2 px-6 rounded hover:bg-opacity-90"
                        >
                            ثبت‌نام
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}