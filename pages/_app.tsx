import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect, useState } from "react";

import { DM_Sans } from "next/font/google";
import { NextPage } from "next";
import Modal from "@/modules/global/elements/modal";
const mainFont = DM_Sans({ subsets: ["latin"] });

// Define layout type support
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const defaultStyles = {
  color: "text-blue-950 bg-gray-50",
  fontSize: "text-[16px]",
  letterSpace: "0",
  lineHeight: "",
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();

  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 5000);
  }, [router.isReady]);

  return (
    <main className={`${mainFont.className} ${defaultStyles.color} ${defaultStyles.fontSize}`}>
      <Modal zIndex="z-[9999]" maxWidth="w-full max-w-md" show={show && mounted} setShow={setShow}>
        <div
          className={`
          relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out
          ${mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"}
        `}
          role="dialog"
          aria-modal="true"
          aria-label="Payment reminder"
        >
          {/* Reminder content */}
          <div className="text-center">
            {/* Simple icon (minimalist) */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-amber-600">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659a1 1 0 001.141 0l1.62-1.215a1 1 0 001.141 0l.88.659M9 12l1.879-1.409a1 1 0 011.141 0L15 12m-6 0l1.5-1.125M9 12l-1.5-1.125m6 0L15 12m-6 0l-1.125 1.5M15 12l1.125-1.5"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Project Notice</h2>

            <div className="mt-2 text-sm text-gray-500">
              <p>
                The current project version has been successfully completed by the development team. We are currently waiting for final confirmation regarding project
                continuation and payment processing.
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Please contact the developer to continue full support and deployment services.</p>
              <div className="mt-1 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-500">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <a
                  href={`mailto:zahidraju.com@gmail.com?subject=Contact%20for%20Website%20Project`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
                >
                  zahidraju.com@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-col space-y-2">
              <a
                href={`mailto:zahidraju.com@gmail.com?subject=Contact%20for%20Website%20Project&body=Hello zahid raju,%0D%0A%0D%0AI would like to settle the payment for the website project. Please send me the payment details.%0D%0A%0D%0AThank you.`}
                className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Contact Developer Now
              </a>
            </div>
          </div>
        </div>
      </Modal>

      {!show && (
        <div className="fixed top-16 left-5 z-[9999] flex items-center justify-center shadow-custom-1 transition-all duration-300" role="presentation">
          <div
            className={`
          relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out
          ${mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"}
        `}
            role="dialog"
            aria-modal="true"
            aria-label="Payment reminder"
          >
            {/* Reminder content */}
            <div className="text-center">
              {/* Simple icon (minimalist) */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-amber-600">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659a1 1 0 001.141 0l1.62-1.215a1 1 0 001.141 0l.88.659M9 12l1.879-1.409a1 1 0 011.141 0L15 12m-6 0l1.5-1.125M9 12l-1.5-1.125m6 0L15 12m-6 0l-1.125 1.5M15 12l1.125-1.5"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Project Notice</h2>

              <div className="mt-2 text-sm text-gray-500">
                <p>
                  The current project version has been successfully completed by the development team. We are currently waiting for final confirmation regarding project
                  continuation and payment processing.
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Please contact the developer to continue full support and deployment services.
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-500">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <a
                    href={`mailto:zahidraju.com@gmail.com?subject=Contact%20for%20Website%20Project`}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
                  >
                    zahidraju.com@gmail.com
                  </a>
                </div>
              </div>

              <div className="mt-6 flex flex-col space-y-2">
                <a
                  href={`mailto:zahidraju.com@gmail.com?subject=Contact%20for%20Website%20Project&body=Hello zahid raju,%0D%0A%0D%0AI would like to settle the payment for the website project. Please send me the payment details.%0D%0A%0D%0AThank you.`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Contact Developer Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <CursorFollower /> */}
      {getLayout(<Component {...pageProps} />)}
    </main>
  );
}
