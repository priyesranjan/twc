"use client";
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PartnerLogin() {
  const { loginSuccess } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        loginSuccess(data.token, { user: data.user });
        // Route according to Role
        if (data.user.role === 'ADMIN' || data.user.role === 'STAFF') {
          router.push('/admin/leads');
        } else {
          router.push('/vendor/dashboard');
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Network error. Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '440px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111', margin: '0 0 8px 0' }}>Partner Portal</h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Secure access for TWC Partners and Staff.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#111' }}>Authorized Email</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="agency@theweddingschapter.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '16px 16px 16px 44px', borderRadius: '12px', border: '1.5px solid #eaeaea', fontSize: '15px', outline: 'none', transition: 'border 0.2s' }}
              />
              <Mail size={18} color="#999" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#111' }}>Security Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '16px 16px 16px 44px', borderRadius: '12px', border: '1.5px solid #eaeaea', fontSize: '15px', outline: 'none', transition: 'border 0.2s' }}
              />
              <Lock size={18} color="#999" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '12px', width: '100%', padding: '16px', borderRadius: '12px', 
              background: '#111', color: 'white', border: 'none', fontWeight: '800', 
              fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Authenticating...' : 'Access Workspace'} <ArrowRight size={18} />
          </button>

        </form>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/" style={{ color: '#666', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>&larr; Return to main site</a>
        </div>
      </div>
    </div>
  );
}
