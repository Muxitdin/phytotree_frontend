import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { I18nProvider } from "@/contexts/I18nContext";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Phytotree - Luxury Beauty Essentials",
  description: "Discover curated luxury beauty products designed to enhance your natural glow",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <ProductsProvider>
              <OrdersProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </OrdersProvider>
            </ProductsProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
