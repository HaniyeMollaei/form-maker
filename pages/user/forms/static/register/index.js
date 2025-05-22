// ✅ این فایل مدیریت کامل فرم‌ها و نمایش از نگاه کاربر + کنترل فیلدهای اختیاری را انجام می‌دهد

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { toast } from "react-toastify";
import moment from "moment-jalaali";
import { DateTimePicker } from "react-advance-jalaali-datepicker";
import { nanoid } from "nanoid";
import Navbar from "../../../../../components/ui/Navbar";

const predefinedFields = [
    { key: "fullName", label: "نام و نام خانوادگی" },
    { key: "phone", label: "شماره تماس" },
    { key: "email", label: "ایمیل" },
    { key: "telegram", label: "آیدی تلگرام" },
    { key: "instagram", label: "صفحه اینستاگرام" },
    { key: "location", label: "محل زندگی" },
    { key: "nationalId", label: "کد ملی" },
    { key: "age", label: "سن" },
    { key: "gender", label: "جنسیت" },
    { key: "description", label: "توضیحات" },
    // { key: "amount", label: "مبلغ پیشنهادی" },
    // { key: "selected_time", label: "زمان انتخاب شده" },
];

export default function PublishFormPage() {
    const router = useRouter();
    const defaultDeadline = moment().add(3, "days").format("jYYYY/jMM/jDD HH:mm");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        adLink: "",
        organizer: "",
        capacity: "",
        hasDeposit: false,
        depositAmount: "",
        totalAmount: "",
        deadline: defaultDeadline,
        fields: [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddField = (fieldKey) => {
        if (!formData.fields.includes(fieldKey)) {
            setFormData((prev) => ({
                ...prev,
                fields: [...prev.fields, fieldKey],
            }));
        }
    };

    const handleRemoveField = (fieldKey) => {
        setFormData((prev) => ({
            ...prev,
            fields: prev.fields.filter((f) => f !== fieldKey),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = nanoid();
        const newForm = { ...formData, id };
        const stored = JSON.parse(localStorage.getItem("published-forms")) || [];
        const updated = [...stored, newForm];
        localStorage.setItem("published-forms", JSON.stringify(updated));
        localStorage.setItem("latest-published-form", JSON.stringify(newForm));
        toast.success("✅ فرم با موفقیت ذخیره شد!");
        setTimeout(() => {
            router.push("/user/forms/manage");
        }, 1000);
    };

    return (
        <>
            <Head>
                <title>ساخت فرم ثبت‌نام</title>
            </Head>

            <Navbar />

            <main dir="rtl" className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
                    {/*<div className="flex items-center justify-between mb-6">*/}
                        <h1 className="text-2xl mb-6 font-bold text-[#A62626]">ایجاد فرم ثبت نام</h1>
                        {/*<button*/}
                        {/*    onClick={() => router.push("/user/forms/manage")}*/}
                        {/*    className="bg-gray-200 text-[#A62626] font-bold px-5 py-2 rounded hover:bg-gray-300"*/}
                        {/*>*/}
                        {/*    مدیریت فرم‌های من*/}
                        {/*</button>*/}
                    {/*</div>*/}


                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[
                            { name: "title", label: "عنوان آگهی" },
                            { name: "description", label: "توضیحات", textarea: true },
                            { name: "location", label: "موقعیت مکانی" },
                            { name: "adLink", label: "لینک آگهی دیوار" },
                            { name: "organizer", label: "نام برگزارکننده" },
                            { name: "capacity", label: "ظرفیت ثبت‌نام" },
                            { name: "totalAmount", label: "مبلغ کل ثبت‌نام (تومان)" },
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

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="hasDeposit"
                                checked={formData.hasDeposit}
                                onChange={handleChange}
                            />
                            <label>بیعانه دریافت می‌شود</label>
                        </div>

                        {formData.hasDeposit && (
                            <div>
                                <label className="block font-medium">مبلغ بیعانه (تومان)</label>
                                <input
                                    type="number"
                                    name="depositAmount"
                                    value={formData.depositAmount}
                                    onChange={handleChange}
                                    className="formInput"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block font-medium">مهلت ثبت‌نام</label>
                            <DateTimePicker
                                inputComponent={(props) => (
                                    <input
                                        {...props}
                                        className="formInput"
                                        placeholder="انتخاب تاریخ و ساعت"
                                        readOnly
                                    />
                                )}
                                format="jYYYY/jMM/jDD HH:mm"
                                onChange={(unix, formatted) => {
                                    setFormData((prev) => ({ ...prev, deadline: formatted }));
                                }}
                                id="deadlinePicker"
                                preSelected={defaultDeadline}
                            />
                        </div>

                        {/* انتخاب فیلدهای اطلاعاتی */}
                        <div>
                            <label className="block font-medium mb-1">فیلدهای مورد نیاز از کاربر</label>
                            <div className="flex flex-wrap gap-2">
                                {predefinedFields.map((field) => (
                                    <button
                                        type="button"
                                        key={field.key}
                                        className="px-3 py-1 border rounded text-sm bg-gray-200 hover:bg-gray-300"
                                        onClick={() => handleAddField(field.key)}
                                        disabled={formData.fields.includes(field.key)}
                                    >
                                        {field.label}
                                    </button>
                                ))}
                            </div>
                            {formData.fields.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.fields.map((fKey) => {
                                        const label = predefinedFields.find((f) => f.key === fKey)?.label || fKey;
                                        return (
                                            <span
                                                key={fKey}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full flex items-center gap-2"
                                            >
                        {label}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveField(fKey)}
                                                    className="text-red-500 font-bold"
                                                >
                          ×
                        </button>
                      </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

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
