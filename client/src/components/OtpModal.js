"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function OtpModal() {
  const { isOtpModalOpen, closeOtpModal, loginSuccess } = useAuth();
  
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = Verify OTP, 3 = Complete Profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOtpModalOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        console.log(data.message); // For dev testing mock OTP
      } else {
        alert(data.message || 'Error sending OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Network Error! Ensure Backend is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpValue })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (!data.user.name || !data.user.email) {
          localStorage.setItem('jwt_token', data.token); // Store token temporarily
          setStep(3); // Force profile completion
        } else {
          loginSuccess(data.token, data);
          setStep(1); // Reset
        }
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Network Error! Cannot verify OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (name.length < 2 || email.length < 5) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      
      if (res.ok) {
        loginSuccess(token, { user: data.user });
        setStep(1); // Reset
      } else {
        alert(data.message || 'Error updating profile');
      }
    } catch (err) {
      alert('Network Error! Cannot update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={closeOtpModal}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          transition: 'all 0.3s ease-out'
        }} 
      />
      
      {/* Bottom Sheet Modal */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        zIndex: 9999,
        maxWidth: '480px',
        margin: '0 auto',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <button onClick={closeOtpModal} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', padding: '8px', cursor: 'pointer', color: '#666' }}>
          <X size={20} />
        </button>

        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Smartphone size={24} color="var(--primary-color)" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Unlock Wedding Deals</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Share your number to see locked prices and save up to 40% on top vendors.</p>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-main)', fontWeight: '600' }}>+91</span>
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={{ width: '100%', padding: '16px 16px 16px 56px', border: '1.5px solid #eee', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border 0.2s' }}
                autoFocus
              />
            </div>

            <button disabled={phone.length !== 10 || isLoading} type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: phone.length !== 10 ? 0.6 : 1 }}>
              {isLoading ? 'Sending Secret Code...' : 'Get OTP on WhatsApp / SMS'} <ArrowRight size={18} />
            </button>
            <p style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', margin: '8px 0 0 0' }}>By continuing, you agree to our Terms of Use and Privacy Policy.</p>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', background: '#e6fce2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <ShieldCheck size={24} color="#2ba83c" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Verify OTP</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Enter the 4-digit code sent to +91 {phone}</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '12px 0' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[index] = e.target.value.replace(/\D/g, '');
                    setOtp(newOtp);
                    // Standard auto-focus next logic goes here
                  }}
                  style={{ width: '45px', height: '56px', border: '1.5px solid #ddd', borderRadius: '12px', fontSize: '24px', textAlign: 'center', fontWeight: '600', outline: 'none', caretColor: 'var(--primary-color)' }}
                />
              ))}
            </div>

            <button disabled={otp.join('').length !== 4 || isLoading} type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: otp.join('').length !== 4 ? 0.6 : 1 }}>
              {isLoading ? 'Verifying...' : 'Unlock Platform'}
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', fontSize: '13px', margin: '12px 0 0 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Didn't receive code?</span>
              <button type="button" onClick={() => {/* Resend Logic */}} style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer' }}>Resend</button>
            </div>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Complete Your Profile</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>We need a few details so our team can send your quotation.</p>
            </div>

            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '16px', border: '1.5px solid #eee', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
              autoFocus
            />

            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '16px', border: '1.5px solid #eee', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
            />

            <button disabled={name.length < 2 || email.length < 5 || isLoading} type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (name.length < 2 || email.length < 5) ? 0.6 : 1 }}>
              {isLoading ? 'Saving...' : 'Submit Profile'}
            </button>
          </form>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}} />
    </>
  );
}
