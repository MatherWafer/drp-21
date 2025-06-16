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
  if (pathname === '/') {
    return (
      <html lang="en" className="dark h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full flex flex-col`}
        >
          <UserProvider>
            <CategoryProvider>
              {/* Header and Selector */}
              <div className="w-full z-50">
                <Header />
                {/* Apply fixed positioning to Selector */}
                <div className="fixed top-[header-height] left-0 w-full z-50">
                  <Selector />
                </div>
              </div>
  
              {/* Main content */}
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
  
              {/* Footer - stays visible above bottom nav bars */}
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
            <div className="w-full flex justify-end z-50">
              <Header />
            </div>

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