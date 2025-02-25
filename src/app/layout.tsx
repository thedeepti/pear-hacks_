import './globals.css';
import { Inter } from 'next/font/google';
import { P2PProvider } from '@/contexts/P2PContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PearHacks - P2P Hackathon Platform',
  description: 'A decentralized hackathon platform powered by P2P technology',
};

function Navigation() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold">🍐 PearHacks</span>
            </a>
          </div>
          <div className="flex space-x-4">
            <a href="/hackathons" className="hover:bg-gray-700 px-3 py-2 rounded-md">
              Hackathons
            </a>
            <a href="/create" className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md">
              Create Hackathon
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <P2PProvider>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </P2PProvider>
      </body>
    </html>
  );
}
