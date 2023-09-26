import '@/app/globals.css';
import { Navbar, Footer } from '@/components';

import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { Theme, ThemePanel } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bill-Bot-Baggins',
  description: 'Generated by PTRI11 Pantless Thundergeese',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang='en'>
        <head>
          <link rel='icon' href='/favicon.ico' />
        </head>
        <body className={font.className}>
          <Theme
            appearance='dark'
            accentColor='iris'
            grayColor='sand'
            panelBackground='solid'
            radius='full'
            scaling='90%'
            className='h-screen'
          >
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  );
}
