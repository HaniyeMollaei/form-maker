import { AccountNameProvider } from "../contexts/AccountNameContext";
import { ModalWindowProvider } from "../contexts/ModalWindowContext";
import { SearchProvider } from "../contexts/SearchContext";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import {ToastContainer} from "react-toastify";


function MyApp({ Component, pageProps }) {
  return (
    <>
      <ModalWindowProvider>
        <AccountNameProvider>
          <SearchProvider>
            <Toaster />
            <Component {...pageProps} />
            <ToastContainer position="top-center" rtl autoClose={3000} />
          </SearchProvider>
        </AccountNameProvider>
      </ModalWindowProvider>
    </>
  );
}

export default MyApp;
