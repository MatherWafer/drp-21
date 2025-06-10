'use client';

import { usePathname } from 'next/navigation';
import { UserProvider } from './context/userContext';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CategoryProvider } from './user/posts/FilterContext';
import Footer from './layout/Footer';
import Header from './layout/Header';
import Selector from './layout/Selector';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // 🌐 LOGIN PAGE — no header/footer
  if (pathname === '/login') {
    return (
      <html lang="en" className="dark h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full`}
        >
          <UserProvider>
            <main className="h-full overflow-y-auto px-2 pt-[60px] pb-[80px]">
              {children}
            </main>
          </UserProvider>
        </body>
      </html>
    );
  }

  // 🗺️ ROOT PAGE — floating header/footer, selector below header
  if (pathname === '/') {
    return (
      <html lang="en" className="dark h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full`}
        >
          <UserProvider>
            <CategoryProvider>
              <div className="relative h-screen overflow-hidden">
                {/* Floating Header */}
                <div className="absolute top-0 left-0 w-full z-20">
                  <Header />
                  <Selector />

                </div>

          

                {/* Main content below everything */}
                <main className="h-full overflow-y-auto">
                  {children}
                </main>

                {/* Floating Footer */}
                <div className="absolute bottom-0 left-0 w-full z-20">
                  <Footer />
                </div>
              </div>
            </CategoryProvider>
          </UserProvider>
        </body>
      </html>
    );
  }

  // 📄 OTHER PAGES — normal header/footer
  return (
  <html lang="en" className="dark h-full">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full relative overflow-hidden`} // Added 'relative'
    >
      <UserProvider>
        <CategoryProvider>
          {/* Make header absolute and remove from flex flow */}
          <div className="absolute top-0 right-0 z-50 w-fit">
            <Header />
          </div>

          {/* Main content takes full height */}
          <div className="flex flex-col h-full pt-0"> {/* Removed padding-top */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
            <div className="flex-none">
              <Footer />
            </div>
          </div>
        </CategoryProvider>
      </UserProvider>
    </body>
  </html>
);
}
