"use client";
import React, { useState, useEffect } from 'react';
import { Search, Heart, User, Building, Phone, MapPin, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const [isDesktop, setIsDesktop] = useState(false);
  const { user, openOtpModal } = useAuth();

  useEffect(() => {
    // Check if window is desktop sized
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <nav style={{ position: 'sticky', top: 0, width: '100%', height: '60px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #eee' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary-color), #b10a34)', color: 'white', padding: '6px 10px', borderRadius: '8px', fontWeight: '900', fontSize: '14px' }}>TWC</div>
            <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>TheWeddingsChapter</span>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user?.authenticated ? (
            <button onClick={() => { logout(); window.location.href = '/'; }} style={{ background: '#fce7f3', color: '#be185d', border: 'none', padding: '6px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LogOut size={12} /> Logout
            </button>
          ) : (
            <>
              <button onClick={openOtpModal} style={{ background: 'transparent', color: 'var(--primary-color)', border: 'none', fontWeight: '700', fontSize: '14px' }}>Login</button>
              <Link href="/login" style={{ background: '#111', color: 'white', padding: '6px 12px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '12px' }}>Partner View</Link>
            </>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '70px',
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: '1px solid #eee'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1440px',
        padding: '0 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary-color), #b10a34)', 
              color: 'white', 
              padding: '8px 12px', 
              borderRadius: '8px', 
              fontWeight: '900', 
              fontSize: '18px',
              letterSpacing: '-0.5px'
            }}>TWC</div>
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              TheWeddingsChapter<span style={{ color: 'var(--primary-color)' }}>.com</span>
            </span>
          </div>
        </Link>

        {/* Static Exclusive Location Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginLeft: '32px',
          background: 'rgba(209, 18, 67, 0.05)',
          padding: '6px 12px',
          borderRadius: '50px',
          border: '1px solid rgba(209, 18, 67, 0.1)'
        }}>
          <MapPin size={16} color="var(--primary-color)" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary-color)' }}>Motihari Exclusive</span>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div style={{
          flex: 1,
          maxWidth: '500px',
          margin: '0 40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '50px',
            padding: '10px 20px',
            gap: '12px',
            border: '1px solid #eee'
          }}>
            <Search size={18} color="var(--primary-color)" />
            <input 
              type="text" 
              placeholder="Search for Banquet Halls in Motihari..." 
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Action Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/admin/leads" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', transition: 'color 0.2s' }}>
            <Building size={16} color="var(--primary-color)" /> CRM
          </Link>
          <a href="tel:000000000" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', transition: 'color 0.2s' }}>
            <Phone size={16} color="var(--primary-color)" /> Contact
          </a>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: '#eee' }}></div>

          {!user?.authenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={openOtpModal}
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary-color)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <User size={16} /> Customer Login
              </button>
              <Link href="/login" style={{ background: '#111', color: 'white', padding: '10px 20px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                Partner Login
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Heart size={20} color="var(--text-main)" style={{ cursor: 'pointer' }} />
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#111' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                  {user?.name ? user.name.substring(0,1).toUpperCase() : "U"}
                </div>
              </Link>
              <button 
                onClick={() => { logout(); window.location.href = '/'; }}
                style={{ background: '#f8f9fa', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800' }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
