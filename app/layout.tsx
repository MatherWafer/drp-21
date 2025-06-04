'use client';

import { usePathname } from 'next/navigation';
import type { Metadata } from 'next';
import { UserProvider } from './context/userContext';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CategoryProvider } from './user/posts/CategoryContext';
import Footer from './layout/Footer';
import Header from './layout/Header';
import Selector from './layout/Selector';
import { FooterWrapper, HeaderWrapper } from './auxHeaderFooter';

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
  return pathname === '/'
  ?
  (
      <html lang="en" className="dark h-full">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full`}>
    <UserProvider>
      <CategoryProvider>
        <div className="relative h-screen overflow-hidden">
          {/* Header on top */}
          <HeaderWrapper />

          {/* Main content underneath */}
          <main className="h-full overflow-y-auto">
            {children}
          </main>

          {/* Footer on bottom */}
          <FooterWrapper />
        </div>
      </CategoryProvider>
    </UserProvider>
  </body>
</html>
  )
  :
  pathname === '/login' 
  ?
  (
    <html lang="en" className="dark h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full`}>
        <UserProvider>
          <main className="h-full overflow-y-auto px-2 pt-[60px] pb-[80px]">
            {children}
          </main>
      </UserProvider>
    </body>
  </html>
  )
  :
  (
  <html lang="en" className="dark h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-teal-900 text-white h-full`}>
        <UserProvider>
          <CategoryProvider>
            <div className="flex flex-col h-screen overflow-hidden">
              <Header />
              <Selector />
              <main className="flex-1 overflow-y-auto px-2 rounded-lg">
                {children}
              </main>
              <div className="pt-5">
                <Footer />
              </div>
            </div>
          </CategoryProvider>
        </UserProvider>
      </body>
    </html>
  )
}