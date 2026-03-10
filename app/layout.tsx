import "./globals.css";

export const metadata = {
  title: "STREETLENS",
  description: "Discover and document urban artworks and places.",
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
