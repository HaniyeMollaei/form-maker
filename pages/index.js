import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { verifyTokenServerSide } from "../middlewares/authentication/jwt";
import { ModalWindowContext } from "../contexts/ModalWindowContext";
import imagesList from "../utils/images/appShowcase";
import Modal from "../components/Modal";

// Lucide Icons
import { UserPlus, Calendar, Gavel, FileEdit } from "lucide-react";

export default function Home() {
  const { handleCloseClick } = useContext(ModalWindowContext);
  const [currentViewingImage, setCurrentViewingImage] = useState(null);

  const forms = [
    { icon: <UserPlus size={48} />, label: "فرم ثبت‌نام/سفارش", href: "/user/forms/static/register" },
    { icon: <Calendar size={48} />, label: "فرم نوبت‌دهی", href: "/user/forms/static/appoinment" },
    { icon: <Gavel size={48} />, label: "فرم مزایده", href: "/user/forms/add" },
    { icon: <FileEdit size={48} />, label: "فرم نظر سنجی", href: "/user/forms/add" },
    { icon: <FileEdit size={48} />, label: "فرم سفارشی", href: "/user/forms/add" },
  ];

  return (
      <main dir="rtl" className="flex flex-col items-center justify-center min-h-screen bg-white">
        {/* بخش اصلی قرمز رنگ */}
        <section
            className="homeSection flex flex-col justify-center gap-4 w-full min-h-screen px-6 py-4"
            style={{ backgroundColor: "#A62626" }}
        >
          {/* لوگو */}
          <div className="mb-2 flex justify-center">
            <Image
                src="/static/img/Divar-Logo.png"
                alt="دیوار"
                width={200}
                height={200}
                objectFit="contain"
            />
          </div>

          {/* عنوان و توضیح */}
          <header className="self-center flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-4xl font-bold text-white flex items-center gap-2">
              <i className="bi bi-file-earmark-text-fill" /> فرم‌ساز
            </h1>
            <p className="text-white">فرم آنلاین بساز، زمان رو مدیریت کن و مخاطبینت رو بهتر بشناس</p>
          </header>

          {/* کارت‌های فرم */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-8 w-full max-w-5xl mx-auto">
            {forms.map(({ icon, label, href }) => (
                <Link
                    key={label}
                    href={href}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="text-[#A62626]">{icon}</div>
                  <span className="mt-3 font-bold text-gray-700">{label}</span>
                </Link>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <Link
                href="/user/forms/manage"
                className="bg-white text-[#A62626] font-bold px-6 py-2 rounded shadow hover:bg-gray-100 transition"
            >
              مدیریت فرم‌های من
            </Link>
          </div>

        </section>

        {/* گالری تصاویر */}
        <section
            id="gallery"
            className="gallery flex flex-col justify-center gap-4 w-full min-h-screen px-12 bg-gray-100 py-12"
        >
          <header className="text-center">
            <h1 className="text-4xl font-bold" style={{ color: "#A62626" }}>
              گالری
            </h1>
          </header>

          <div
              title="برای دیدن تصویر کامل کلیک کنید"
              className="grid grid-cols-3 gap-4 h-96 overflow-y-scroll hideScrollbar"
          >
            {imagesList.map((img) => (
                <div
                    key={img.id}
                    className="ease-in-out duration-100 relative h-64 hover:cursor-pointer hover:opacity-70"
                >
                  <Image
                      src={img.src}
                      alt={`App showcase image with id:${img.id}`}
                      objectFit="cover"
                      fill
                      className="shadow-lg"
                      onClick={() => {
                        setCurrentViewingImage(img);
                        handleCloseClick();
                      }}
                  />
                </div>
            ))}

            <Modal>
              {currentViewingImage && (
                  <Image
                      src={currentViewingImage.src}
                      quality={100}
                      width={800}
                      height={800}
                      alt="Current viewing image"
                  />
              )}
            </Modal>
          </div>
        </section>

      </main>
  );
}

export async function getServerSideProps(ctx) {
  const token = verifyTokenServerSide(ctx);

  if (token) {
    return { redirect: { destination: "/user/forms/view", permanent: false } };
  }

  return {
    props: {},
  };
}
