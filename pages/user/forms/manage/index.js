import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Trash2, Pencil, PlusCircle } from "lucide-react"; // اضافه کردن آیکون +
import Navbar from "../../../../components/ui/Navbar";

export default function ManageForms() {
    const [forms, setForms] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("published-forms")) || [];
        setForms(stored);
    }, []);

    const handlePreview = (form) => {
        localStorage.setItem("latest-preview-form", JSON.stringify(form));
        router.push("/user/forms/form-view/register");
    };

    const handleViewSubmissions = (formId) => {
        localStorage.setItem("view-submission-form-id", formId);
        router.push("/user/forms/form-view/submissions");
    };

    const getSubmissionCount = (formId) => {
        const all = JSON.parse(localStorage.getItem("form-submissions")) || {};
        return all[formId]?.length || 0;
    };

    const handleDelete = (formId) => {
        const confirmed = confirm("آیا از حذف فرم اطمینان دارید؟");
        if (!confirmed) return;
        const stored = JSON.parse(localStorage.getItem("published-forms")) || [];
        const filtered = stored.filter((f) => f.id !== formId);
        localStorage.setItem("published-forms", JSON.stringify(filtered));
        setForms(filtered);
    };

    return (
        <>
            <Head><title>مدیریت فرم‌های من</title></Head>
            <Navbar />
            <main dir="rtl" className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto">
                    {/* تیتر همراه دکمه اضافه کردن */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-[#A62626]">مدیریت فرم‌های ایجادشده</h1>
                        <button
                            onClick={() => router.push("/user/forms/static/register")}
                            className="flex items-center gap-2 text-[#A62626] font-bold hover:underline"
                        >
                            <PlusCircle size={22} />
                            فرم جدید
                        </button>
                    </div>

                    {forms.length === 0 ? (
                        <p>فرمی وجود ندارد.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {forms.map((form) => (
                                <div
                                    key={form.id}
                                    className="bg-white rounded shadow-md p-4 relative hover:shadow-lg transition h-[220px] flex flex-col justify-between"
                                >
                                    {/* آیکون‌های ویرایش و حذف */}
                                    <div className="absolute top-3 left-3 flex gap-3">
                                        <button onClick={() => handleDelete(form.id)} title="حذف فرم">
                                            <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                                        </button>
                                        <button onClick={() => alert("ویرایش در نسخه بعدی فعال می‌شود")} title="ویرایش فرم">
                                            <Pencil size={18} className="text-gray-600 hover:text-black" />
                                        </button>
                                    </div>

                                    {/* عنوان و توضیح */}
                                    <div>
                                        <h2 className="font-bold text-lg text-[#A62626] mb-1">{form.title}</h2>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{form.description}</p>
                                    </div>

                                    {/* دکمه‌ها پایین کارت */}
                                    <div className="flex justify-end items-end gap-2 mt-auto">
                                        <button
                                            onClick={() => handlePreview(form)}
                                            title="مشاهده فرم"
                                            className="bg-[#A62626] p-2 rounded hover:bg-opacity-90"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 4.5C5.5 4.5 2 10 2 10s3.5 5.5 8 5.5 8-5.5 8-5.5-3.5-5.5-8-5.5zM10 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                            </svg>
                                        </button>

                                        {getSubmissionCount(form.id) > 0 && (
                                            <button
                                                onClick={() => handleViewSubmissions(form.id)}
                                                title="مشاهده ثبت‌نامی‌ها"
                                                className="bg-indigo-600 p-2 rounded hover:bg-indigo-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-4h6v4m-6 0H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
                </div>
            </main>
        </>
    );
}
