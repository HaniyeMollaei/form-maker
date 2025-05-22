
export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { description, interval } = req.body;

    const prompt = `
شما یک سیستم زمان‌بندی نوبت‌دهی هستید. از ورودی زیر (توضیح زمان‌های در دسترس) و بازه‌ی بین نوبت‌ها استفاده کن و یک لیست از زمان‌های ممکن بر اساس ساختار زیر تولید کن:
هر آیتم باید شامل id یکتا (مثلاً slot_1)، یک متن نمایشی مثل "شنبه ۱۴۰۳/۰۳/۱۰ - ۱۰:۰۰" باشد.
خروجی را در قالب آرایه‌ای از آبجکت‌های زیر بازگردان:

[
  { "id": "slot_1", "label": "شنبه ۱۴۰۳/۰۳/۱۰ - ۱۰:۰۰" },
  { "id": "slot_2", "label": "شنبه ۱۴۰۳/۰۳/۱۰ - ۱۰:۳۰" }
]

توضیح زمان‌ها:
${description}

بازه بین نوبت‌ها (دقیقه): ${interval}
`;

    try {
        const apiRes = await fetch("https://api.metisai.ir/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.METIS_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "تو یک سیستم تولید نوبت بر اساس توضیح کاربر هستی." },
                    { role: "user", content: prompt },
                ],
            }),
        });

        const result = await apiRes.json();
        const content = result?.choices?.[0]?.message?.content || "[]";
        const slots = JSON.parse(content);
        return res.status(200).json({ slots });
    } catch (error) {
        console.error("AI ERROR:", error);
        return res.status(500).json({ error: "Failed to generate slots" });
    }
}
