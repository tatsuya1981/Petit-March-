import type { Metadata } from 'next';
import { Zen_Maru_Gothic } from 'next/font/google';
import './styles/globals.scss';
import ArrowToTop from './components/elements/arrowToTop';
import Header from './components/layouts/header';
import Footer from './components/layouts/footer';

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zen-maru-gothic',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://google.com'),
  title: 'Petit Marche',
  description: 'コンビニエンスストアの商品レビューサイト',
  icons: {
    icon: '/frontend/app/icon.ico',
    apple: '/frontend/app/icon.ico',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Petit Marche',
    description: 'コンビニエンスストアの商品レビューサイト',
    url: 'https://google.com',
    siteName: 'Petit Marche',
    images: '/frontend/app/icon.ico',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    description: 'コンビニエンスストアの商品レビューサイト',
    images: '/frontend/app/icon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenMaruGothic.className} ${zenMaruGothic.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ArrowToTop />
      </body>
    </html>
  );
}
