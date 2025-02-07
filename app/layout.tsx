import { SpeedInsights } from "@vercel/speed-insights/next"

import "./global.css";

export const metadata = {
  title: "Monetis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}