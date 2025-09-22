import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gaming Gear TN - Custom Gaming PCs & Full Setup Bundles",
  description: "Build your dream gaming PC with Gaming Gear TN. Custom builds, full setup bundles, and expert consultation in Tunisia. From budget beasts to liquid-cooled monsters.",
  keywords: ["gaming pc", "custom pc", "gaming gear", "tunisia", "pc builder", "gaming setup", "rtx", "ryzen", "intel"],
  openGraph: {
    title: "Gaming Gear TN - Custom Gaming PCs",
    description: "Build your dream gaming PC with Gaming Gear TN. Custom builds and full setup bundles in Tunisia.",
    url: "https://gaminggear.tn/landing",
    siteName: "Gaming Gear TN",
    type: "website",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
