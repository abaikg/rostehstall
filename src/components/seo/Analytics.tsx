import Script from "next/script";

/**
 * Веб-аналитика для продвижения: Яндекс.Метрика + Google Analytics 4.
 * Счётчики рендерятся только если заданы соответствующие env-переменные,
 * поэтому в dev/preview без ID ничего не подгружается.
 *
 *   NEXT_PUBLIC_YM_ID  — номер счётчика Яндекс.Метрики (Метрика → Настройки → Номер счётчика)
 *   NEXT_PUBLIC_GA_ID  — Measurement ID GA4 вида "G-XXXXXXXXXX"
 */
export function Analytics() {
  const ymId = process.env.NEXT_PUBLIC_YM_ID?.trim();
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  return (
    <>
      {ymId && (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(${JSON.stringify(ymId)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
            `}
          </Script>
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${ymId}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}

      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(gaId)});
            `}
          </Script>
        </>
      )}
    </>
  );
}
