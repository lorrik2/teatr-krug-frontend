"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SITE_URL } from "@/lib/site-config";

const COUNTER_ID = process.env.NEXT_PUBLIC_MAILRU_COUNTER_ID;

declare global {
  interface Window {
    _tmr?: Array<{ id: string; type: string; start: number; page?: string }>;
  }
}

/**
 * Top.Mail.Ru счётчик: скрипт, инициализация и учёт pageView при смене страниц SPA.
 * Работает только при наличии NEXT_PUBLIC_MAILRU_COUNTER_ID в .env
 */
export default function MailRuMetrika() {
  const pathname = usePathname();

  useEffect(() => {
    if (!COUNTER_ID || typeof window === "undefined" || !window._tmr) return;
    const url = `${SITE_URL}${pathname || "/"}`;
    window._tmr.push({
      id: COUNTER_ID,
      type: "pageView",
      start: new Date().getTime(),
      page: url,
    });
  }, [pathname]);

  if (!COUNTER_ID) return null;

  return (
    <>
      <Script
        id="top-mailru-counter"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "${COUNTER_ID}", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
              if (d.getElementById(id)) return;
              var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
              ts.src = "https://top-fwz1.mail.ru/js/code.js";
              var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
              if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
            })(document, window, "tmr-code");
          `,
        }}
      />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://top-fwz1.mail.ru/counter?id=${COUNTER_ID};js=na`}
            style={{ position: "absolute", left: "-9999px" }}
            alt="Top.Mail.Ru"
          />
        </div>
      </noscript>
    </>
  );
}
