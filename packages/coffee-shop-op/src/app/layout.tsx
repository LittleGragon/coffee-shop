import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coffee Shop Buddy - Next.js Edition',
  description: 'A coffee shop management system built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-[#6f4e37] text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">
              <span className="mr-2">☕</span>
              Coffee Shop Buddy
            </h1>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/menu" className="hover:underline">Menu</a></li>
                <li><a href="/inventory" className="hover:underline">Inventory</a></li>
                <li><a href="/orders" className="hover:underline">Orders</a></li>
                <li><a href="/reservations" className="hover:underline">Reservations</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-100 text-gray-600 p-4 mt-12">
          <div className="container mx-auto text-center">
            <p>© {new Date().getFullYear()} Coffee Shop Buddy - Next.js Edition</p>
          </div>
        </footer>
      </body>
    </html>
  );
}