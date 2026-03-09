import "./globals.css";

export const metadata = {
  title: "street-lens",
  description: "Discover and document urban spots.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
