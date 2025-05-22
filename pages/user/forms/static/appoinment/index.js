import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import Navbar from "../../../../../components/ui/Navbar";

export default function AppointmentFormPage() {
    const router = useRouter();
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        adLink: "",
        organizer: "",
        timeDescription: "",
        intervalMinutes: "",
        timeSlots: [],
        fields: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = nanoid();
        const newForm = { ...formData, id };
        const stored = JSON.parse(localStorage.getItem("published-forms")) || [];
        localStorage.setItem("published-forms", JSON.stringify([...stored, newForm]));
        localStorage.setItem("latest-published-form", JSON.stringify(newForm));
        toast.success("✅ فرم با موفقیت ذخیره شد!");
        setTimeout(() => router.push("/user/forms/manage"), 1000);
    };

    const generateSlotsFromAI = async () => {
        if (!formData.timeDescription || !formData.intervalMinutes) {
            toast.error("لطفاً توضیح زمان‌ها و بازه زمانی را وارد کنید.");
            return;
        }

        setLoadingSlots(true);
        try {
            const response = await fetch("/api/ai/generate-slots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: formData.timeDescription,
                    interval: formData.intervalMinutes,
                }),
            });

            const data = await response.json();
            if (data?.slots?.length) {
                setFormData((prev) => ({ ...prev, timeSlots: data.slots }));
                toast.success("✅ زمان‌ها با موفقیت دریافت شد");
            } else {
                toast.error("❌ بازه‌ای پیدا نشد.");
            }
        } catch (err) {
            toast.error("⛔ خطا در ارتباط با سرور هوش مصنوعی");
        }
        setLoadingSlots(false);
    };

    return (
        <>
            <Head><title>ساخت فرم نوبت‌دهی</title></Head>
            <Navbar />

            <main dir="rtl" className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-[#A62626] mb-2">فرم نوبت‌دهی جدید</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[
                            { name: "title", label: "عنوان آگهی" },
                            { name: "description", label: "توضیحات", textarea: true },
                            { name: "location", label: "موقعیت مکانی" },
                            { name: "adLink", label: "لینک آگهی دیوار" },
                            { name: "organizer", label: "نام برگزارکننده" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block font-medium">{field.label}</label>
                                {field.textarea ? (
                                    <textarea
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="formInput"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="formInput"
                                    />
                                )}
                            </div>
                        ))}

                        <div>
                            <label className="block font-medium mb-1 text-[#A62626]">توضیح زمان‌های در دسترس</label>
                            <textarea
                                name="timeDescription"
                                value={formData.timeDescription}
                                onChange={handleChange}
                                className="formInput"
                                placeholder="مثلاً: هر روز از ساعت ۹ تا ۱۲ و روزهای زوج از ساعت ۱۶ تا ۱۸"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">مدت هر نوبت (دقیقه)</label>
                            <input
                                type="number"
                                name="intervalMinutes"
                                value={formData.intervalMinutes}
                                onChange={handleChange}
                                className="formInput"
                                placeholder="مثلاً 30"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={generateSlotsFromAI}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-opacity-90"
                            disabled={loadingSlots}
                        >
                            {loadingSlots ? "در حال تولید زمان‌ها..." : "📅 تولید زمان‌های قابل انتخاب"}
                        </button>

                        {formData.timeSlots.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2 text-[#A62626]">زمان‌های استخراج‌شده:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.timeSlots.map((slot) => (
                                        <span
                                            key={slot.id}
                                            className="px-3 py-1 bg-[#A62626] text-white rounded-full text-sm"
                                        >
                                            {slot.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="bg-[#A62626] text-white py-2 px-6 rounded hover:bg-opacity-90"
                        >
                            ثبت نهایی فرم
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}
