import { useRouter } from "next/router";
import { useContext } from "react";
import { SearchContext } from "../../contexts/SearchContext";
import Image from "next/image"; // اضافه کردن ایمپورت Image از Next.js

import SubMenu from "../SubMenu";

export default function Navbar() {
    const router = useRouter();
    const { pathname } = router;

    const { handleSearchOnChange } = useContext(SearchContext);

    return (
        <>
            <nav
                className="navBar flex items-center justify-between w-full p-4 shadow-md text-white"
                style={{ backgroundColor: "#A62626", direction: "rtl" }} // اضافه کردن direction: "rtl" برای راست‌چین کردن
            >
                <figure
                    title="فرم ساز"
                    onClick={() => router.push("/")}
                    className="flex items-center gap-1 w-fit hover:cursor-pointer"
                >
                    {/* استفاده از کامپوننت Image برای قرار دادن عکس PNG */}
                    <Image
                        src="/static/img/Divar-Logo.png" // آدرس عکس PNG مورد نظر شما (مثلاً در پوشه public/images)
                        alt="لوگوی فرم ساز"
                        width={44} // عرض عکس
                        height={44} // ارتفاع عکس
                        className="object-contain" // برای حفظ نسبت ابعاد عکس
                    />
                    <h1 className="font-bold text-white">فرم ساز</h1>
                </figure>
                {/* جابجایی المان‌ها برای راست‌چین شدن */}
                {(pathname === "/user/forms/view" ||
                    pathname === "/user/forms/add" ||
                    pathname === "/user/forms/edit/[formId]" ||
                    pathname === "/user/settings") && (
                    <SubMenu
                        className="text-white" // تغییر رنگ آیکون به سفید
                    />
                )}

                {pathname === "/user/forms/view" && (
                    <>
                        <form className="flex gap-2 px-1 rounded-full bg-white">
                            <input
                                type="text"
                                title="Search by term"
                                placeholder="جستجوی فرم بر اساس عنوان یا شناسه" // تغییر متن placeholder به فارسی
                                className="customInput pr-4 bg-transparent"
                                onChange={(e) => handleSearchOnChange(e)}
                            />
                            <button className="p-2 rounded-full hover:opacity-80" title="Search">
                                <i className="bi bi-search text-white" />
                            </button>
                        </form>
                    </>
                )}

                <button
                    onClick={() => router.push("/user/forms/manage")}
                    className="bg-gray-200 text-[#A62626] font-bold px-5 py-2 rounded hover:bg-gray-300"
                >
                    مدیریت فرم‌های من
                </button>

            </nav>
        </>
    );
}