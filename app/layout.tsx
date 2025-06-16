'use client';

import { usePathname } from 'next/navigation';
import { UserProvider } from './context/userContext';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CategoryProvider } from './user/posts/FilterContext';
import Footer from './layout/Footer';
import Header from './layout/Header';
import Selector from './layout/Selector';
import FilterToggle from './user/posts/FilterToggle';
import CategoryDropdown from './user/posts/CategoryDropdown';

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

  if (pathname === '/') {
    return (
      <html lang="en" className="dark h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full flex flex-col`}
        >
          <UserProvider>
            <CategoryProvider>
              {/* Header and Filters */}
              <div className="w-full z-50">
                {/* Floating Filters in Lozenge */}
                <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full md:w-auto bg-teal-900/95 backdrop-blur-sm rounded-full p-2 flex flex-row gap-2 shadow-lg z-50 overflow-visible">
                  <div className="w-1/2 md:w-44">
                    <FilterToggle />
                  </div>
                  <div className="w-1/2 md:w-44">
                    <CategoryDropdown />
                  </div>
                </div>
              </div>

              {/* Main content */}
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>

              {/* Footer */}
              <div
                className="w-full pb-4"
                style={{
                  paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))',
                }}
              >
                <Footer />
              </div>
            </CategoryProvider>
          </UserProvider>
        </body>
      </html>
    );
  }
  // 📄 OTHER PAGES — standard layout
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full flex flex-col`}
      >
        <UserProvider>
          <CategoryProvider>
            {/* Header */}
            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
            
            {/* Footer */}
            <div className="w-full pb-4" style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))'
            }}>
              <Footer />
            </div>
          </CategoryProvider>
        </UserProvider>
      </body>
    </html>
  );
}