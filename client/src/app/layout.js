import './globals.css';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import TopNav from '../components/TopNav';
import WhatsAppButton from '../components/WhatsAppButton';
import { AuthProvider } from '../context/AuthContext';
import OtpModal from '../components/OtpModal';

export const metadata = {
  title: 'Wedding Marketplace & Booking Platform',
  description: 'Find Your Dream Wedding Services. Search, Compare, and Book top-rated Vendors and Venues.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-container">
            <TopNav />
            {children}
            <Footer />
            <OtpModal />
            <WhatsAppButton />
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
