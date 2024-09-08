import type { Metadata } from 'next';
import { Zen_Maru_Gothic } from 'next/font/google';
import './styles/globals.scss';

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zen-maru-gothic',
});

export const metadata: Metadata = {
  title: 'Petit Marche',
  description: 'コンビニエンスストアの商品レビューサイト',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/convenience.png',
    apple: '/convenience.png',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Petit Marche',
    description: 'コンビニエンスストアの商品レビューサイト',
    url: '',
    siteName: 'Petit Marche',
    images: [
      {
        url: '/frontend/public/convenience.png',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    description: 'コンビニエンスストアの商品レビューサイト',
    images: ['/frontend/public/convenience.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenMaruGothic.className} ${zenMaruGothic.variable}`}>{children}</body>
    </html>
  );
}
