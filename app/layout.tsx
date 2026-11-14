import type { Metadata } from "next";
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // 👈 HI LINE ADD KELI AHE
  title: "UP's Creation | Handmade Crochet Artistry",
  description: "Premium handcrafted crochet accessories, bespoke gifts, and elegant home decor. Stitched with love in Mumbai.",
  icons: {
    icon: '/logo.jpg.jpeg',
  },
  openGraph: {
    title: "UP's Creation | Handmade Crochet Artistry",
    description: "Premium handcrafted crochet accessories, bespoke gifts, and elegant home decor. Stitched with love in Mumbai.",
    url: 'http://localhost:3000', // ⚠️ Live jhalyavar ithe pan link update kar
    siteName: "UP's Creation",
    images: [
      {
        url: '/hero-bg.jpg', 
        width: 1200,
        height: 630,
        alt: "UP's Creation Handmade Crochet",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "UP's Creation | Handmade Crochet Artistry",
    description: "Premium handcrafted crochet accessories, bespoke gifts, and elegant home decor. Stitched with love in Mumbai.",
    images: ['/hero-bg.jpg'],
  },
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