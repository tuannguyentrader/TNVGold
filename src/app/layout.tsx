import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TNV Gold Pulse — Real-Time Algorithmic Market Analytics",
  description:
    "TNV provides real-time algorithmic market analytics, multi-timeframe bias conviction, Gold Session Flow visualization, and institutional order flow metrics for XAUUSD traders.",
  keywords: [
    "TNV",
    "Gold Pulse",
    "XAUUSD",
    "Trading Analytics",
    "Market Flow",
    "Technical Indicators",
    "Session Flow",
  ],
  authors: [{ name: "TNV" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05060a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Suppress unhandled third-party Chrome extension errors from triggering Next.js Dev Overlay */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(e) {
                  if (e.filename && (e.filename.includes('chrome-extension://') || e.filename.includes('moz-extension://'))) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && e.reason.stack && (e.reason.stack.includes('chrome-extension://') || e.reason.stack.includes('moz-extension://'))) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              }
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased bg-[#05060a] text-[#fdfdfd]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}