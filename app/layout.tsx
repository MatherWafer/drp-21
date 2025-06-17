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
              {/* Slim White Header with Title */}
              <header className="w-full bg-white text-black fixed top-0 left-0 z-50 shadow-md border-b-3 border-teal-500">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
                  <h1 className="text-xl md:text-2xl font-bold">
                    Explore Local Ideas
                  </h1>
                </div>
              </header>

              {/* Main content with map and overlaying lozenges */}
              <main className="flex-1 overflow-y-auto relative">
                {/* Floating Filters in Lozenge, overlaying the map */}
                <div className="absolute top-15 left-1/2 -translate-x-1/2 w-[95%] md:w-auto bg-teal-900/95 backdrop-blur-sm rounded-full p-1 flex flex-row gap-2 shadow-lg z-50">
                  <div className="w-1/2 md:w-44">
                    <FilterToggle />
                  </div>
                  <div className="w-1/2 md:w-44">
                    <CategoryDropdown />
                  </div>
                </div>
                {/* Map view and other content */}
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