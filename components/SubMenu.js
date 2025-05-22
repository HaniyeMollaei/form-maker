import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AccountNameContext } from "../contexts/AccountNameContext";
import SubMenuItem from "./SubMenuItem";
import axios from "axios";

export default function SubMenu() {
  const router = useRouter();
  const {pathname} = router;
  const { name } = useContext(AccountNameContext);
  const [viewMenu, setViewMenu] = useState(false);
  const goToRoute = (route) => {
    return router.push(route);
  };

  const handleOnClickLogOut = async () => {
    const ls = localStorage;
    try {
      const res = await axios.delete("/api/auth/logout");
      ls.removeItem('account-name');
      console.log(res);
      router.push("/login");
    } catch (error) {
      console.warn("error!");
    }
  };

  return (
      <>
        <ul className="relative">
          <li onClick={() => setViewMenu(!viewMenu)}>
            <button className="">
              <i
                  className={`ease-in-out duration-150 bi bi-grid-3x3-gap-fill text-xl ${
                      viewMenu ? "text-white" : "text-white" // همیشه سفید باشد
                  }`}
              />
            </button>
          </li>
          {viewMenu === true && (
              <>
                {/* تغییر left-[-175px] به right-0 برای باز شدن از راست و تغییر w-48 به w-fit */}
                <menu className="absolute right-0 w-fit p-2 border rounded bg-white shadow-md">
                  <header className="flex gap-2 py-2 text-gray-700"> {/* رنگ خاکستری تیره برای هدر */}
                    <i className="bi bi-person-circle" />
                    <p>{name}</p>
                  </header>
                  <section className="subMenu__section flex flex-col gap-2 py-2 border-t-2 border-b-2">
                    {/* تغییر عنوان‌ها به فارسی و اعمال رنگ خاکستری تیره */}
                    {pathname !== "/user/forms/view" ? (
                        <SubMenuItem icon={'bi bi-file-earmark-text'} title="فرم‌های من" action={()=> goToRoute("/user/forms/view")} className="text-gray-700"/>
                    ) : ""}
                    <SubMenuItem
                        icon="bi bi-gear"
                        title="تنظیمات"
                        action={() => goToRoute("/user/settings")}
                        className="text-gray-700"
                    />
                    <div>
                      <SubMenuItem
                          icon={"bi bi-box-arrow-right"}
                          title="خروج"
                          action={handleOnClickLogOut}
                          className="text-gray-700"
                      />
                    </div>
                  </section>
                </menu>
              </>
          )}
        </ul>
      </>
  );
}