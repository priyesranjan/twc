"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Save, ShieldCheck, Settings } from 'lucide-react';

export default function ProfilePortal() {
  const { user, openOtpModal, logout } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If auth state is loaded and user is definitively not logged in
    if (user !== null && !user.authenticated) {
      setMessage('Please log in to manage your profile.');
      setLoading(false);
      return;
    }

    if (user?.authenticated) {
      fetchMyProfile();
    }
  }, [user]);

  async function fetchMyProfile() {
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || ''
        });
      } else {
        logout(); // Force logout if token is invalid
        router.push('/');
      }
    } catch (e) {
      setMessage('Network error loading profile.');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: profile.name, email: profile.email })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Profile successfully updated!');
      } else {
        setMessage(`❌ ${data.message || 'Update failed'}`);
      }
    } catch (e) {
      setMessage('❌ Network error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Profile...</div>;

  if (user !== null && !user.authenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <ShieldCheck size={64} color="#ddd" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Authentication Required</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Please log in to view and update your profile settings.</p>
        <button onClick={openOtpModal} style={{ background: '#d11243', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '50px', fontWeight: '800', cursor: 'pointer', fontSize: '16px' }}>
          Customer Login
        </button>
        <div style={{ marginTop: '20px' }}>
          <a href="/login" style={{ color: '#111', fontWeight: '700', textDecoration: 'none' }}>Partner / Admin Login</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: '#111', padding: '40px 30px', color: 'white', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #d11243, #ff4d6d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900' }}>
            {profile.name ? profile.name.substring(0,1).toUpperCase() : <User size={40} />}
          </div>
          <div>
            <h1 style={{ fontSize: '28px', margin: '0 0 6px 0', fontWeight: '900' }}>{profile.name || 'Complete Profile'}</h1>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}>
              {profile.role} ACCOUNT
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} /> Account Settings
          </h3>

          {message && (
            <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#047857' : '#b91c1c', fontSize: '14px', fontWeight: '600' }}>
              {message}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#666', marginBottom: '8px' }}>Phone Number (Verified)</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '14px', borderRadius: '8px', color: '#999', border: '1px solid #eee' }}>
              <Phone size={16} style={{ marginRight: '10px' }} />
              +91 {profile.phone}
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>Phone numbers cannot be changed.</div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>Full Name</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0 14px', transition: 'border-color 0.2s' }}>
              <User size={16} color="#666" />
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                placeholder="Enter your full name"
                required
                style={{ width: '100%', border: 'none', background: 'transparent', padding: '14px 10px', fontSize: '15px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0 14px' }}>
              <Mail size={16} color="#666" />
              <input 
                type="email" 
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                placeholder="you@email.com"
                required
                style={{ width: '100%', border: 'none', background: 'transparent', padding: '14px 10px', fontSize: '15px', outline: 'none' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            style={{ width: '100%', padding: '16px', background: '#111', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}>
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Settings'}
          </button>

        </form>
      </div>
    </div>
  );
}
