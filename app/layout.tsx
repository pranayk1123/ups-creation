import type { Metadata } from "next";
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: "UP's Creation",
  description: "Handmade with Love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fdf7f7] text-[#4a2c2a]">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}