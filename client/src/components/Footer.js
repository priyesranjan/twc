"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '60px 20px 40px 20px',
      marginTop: 'auto',
      borderTop: '4px solid var(--primary-color)'
    }}>
      <div className="footer-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div className="footer-grid" style={{
          display: 'grid',
          gap: '40px',
          marginBottom: '40px'
        }}>
          
          {/* Column 1: Brand & Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, var(--primary-color), #b10a34)', 
                color: 'white', 
                padding: '8px 12px', 
                borderRadius: '8px', 
                fontWeight: '900', 
                fontSize: '20px',
                letterSpacing: '-0.5px'
              }}>TWC</div>
              <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                TheWeddingsChapter<span style={{ color: 'var(--primary-color)' }}>.com</span>
              </span>
            </div>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>
              India's most trusted platform for discovering luxury wedding venues, expert photographers, and premium vendors.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '14px' }}>
                <Phone size={16} color="var(--primary-color)" /> +91 98765 43210
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '14px' }}>
                <Mail size={16} color="var(--primary-color)" /> hello@theweddingschapter.com
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '14px' }}>
                <MapPin size={16} color="var(--primary-color)" /> 123 Luxury Avenue, Connaught Place, New Delhi
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', width: 'max-content' }}>For Customers</h3>
            <Link href="/banquet-halls/delhi/all" className="footer-link">Banquet Halls</Link>
            <Link href="/vendors" className="footer-link">Top Rated Vendors</Link>
            <Link href="/blog" className="footer-link">Wedding Ideas & Inspiration</Link>
            <Link href="/real-weddings" className="footer-link">Real Weddings</Link>
            <Link href="/reviews" className="footer-link">Vendor Reviews</Link>
          </div>

          {/* Column 3: Agency Services */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', width: 'max-content' }}>Agency Services</h3>
            <Link href="/contact" className="footer-link">List Your Wedding Business</Link>
            <Link href="/planning" className="footer-link">Expert Wedding Planning</Link>
            <Link href="/admin/cms" className="footer-link" style={{ color: 'var(--primary-color)' }}>TWC Admin Portal</Link>
          </div>

          {/* Column 4: Legal & Social */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', width: 'max-content' }}>Connect With Us</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="#" className="social-icon"><Instagram size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
              <a href="#" className="social-icon"><Youtube size={20} /></a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms & Conditions</Link>
              <Link href="/cancellation" className="footer-link">Cancellation Policy</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ 
          borderTop: '1px solid #333', 
          paddingTop: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: '8px' 
        }}>
          <p style={{ color: '#888', fontSize: '14px' }}>
            &copy; {new Date().getFullYear()} TheWeddingsChapter.com - The Premium Wedding Marketplace. All rights reserved.
          </p>
          <p style={{ color: '#666', fontSize: '12px' }}>
            Engineered internally as a high-performance Next.js 14 progressive web platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
