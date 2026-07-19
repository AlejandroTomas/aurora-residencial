import "@/styles/globals.css";
import Providers from "@/providers/Providers";

export const metadata = {
  title: "Aurora POS",
  description: "Sistema POS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
