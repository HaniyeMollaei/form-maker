// ✅ فایل: pages/api/publisher/create.js

import dbConnect from "@/lib/dbConnect"; // مسیر اتصال استاندارد به MongoDB در پروژه

export default async function handler(req, res) {
    await dbConnect(); // اتصال به پایگاه داده

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const formData = req.body;

        // اعتبارسنجی اولیه ساده (می‌تونی به دلخواه گسترش بدی)
        if (!formData?.title || !formData?.organizer) {
            return res.status(400).json({ message: "لطفاً عنوان و برگزارکننده را وارد کنید." });
        }

        // ذخیره در مجموعه publisherForms — بدون نیاز به مدل خاص
        const result = await global.mongoose.connection
            .collection("publisherForms")
            .insertOne({
                ...formData,
                createdAt: new Date(),
            });

        return res.status(201).json({ message: "فرم با موفقیت ذخیره شد.", id: result.insertedId });
    } catch (err) {
        console.error("⛔ Error saving form:", err);
        return res.status(500).json({ message: "خطای سرور هنگام ذخیره فرم." });
    }
}
