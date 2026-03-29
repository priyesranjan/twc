"use client";
import React, { useState } from 'react';
import { Camera, CalendarHeart, ChefHat, Building2, UserCircle2, ArrowRight, CheckCircle } from 'lucide-react';

export default function VendorRegistration() {
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', businessName: '', vendorType: '', city: 'Motihari'
  });
  const [status, setStatus] = useState(null);

  const vendorTypes = [
    { id: 'Photographer Studio', icon: <Camera />, desc: 'Wedding Shoots & Pre-Wedding' },
    { id: 'Mehndi Artist', icon: <UserCircle2 />, desc: 'Bridal Henna & Guest Mehndi' },
    { id: 'Caterers', icon: <ChefHat />, desc: 'Food Stalls & Full Buffets' },
    { id: 'Hotel / Banquet', icon: <Building2 />, desc: 'Venues, Lawns & Farmhouses' },
    { id: 'Event Planners', icon: <CalendarHeart />, desc: 'Decor, Tent & Coordination' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendorType) return alert('Please select a business category');
    
    setStatus('submitting');
    try {
      const res = await fetch('/api/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
      } else {
        alert(data.message);
        setStatus(null);
      }
    } catch (err) {
      alert("Error submitting application");
      setStatus(null);
    }
  };

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '60px', height: '60px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <CheckCircle color="#10b981" size={30} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 16px 0' }}>Application Received!</h2>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5' }}>Thank you for joining The Weddings Chapter. Our administrative team will review your profile. Once verified, you will gain access to thousands of live customer leads in Motihari.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#111', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '800', margin: 0 }}>Join the TWC Partner Network</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginTop: '8px' }}>Grow your wedding business in Motihari</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '40px auto', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px', padding: '0 20px' }}>
        
        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #d11243, #e11d48)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 30px rgba(209, 18, 67, 0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800' }}>Why Partner with us?</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              <li>Access exclusive local leads instantly</li>
              <li>Submit your own custom price bids</li>
              <li>No upfront onboarding fees</li>
              <li>Dedicated TWC Support Agent</li>
            </ul>
          </div>
          <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>Trusted by 45+ premier vendors in East Champaran.</p>
        </div>

        {/* Application Form */}
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 24px 0' }}>Vendor Application Wizard</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>Your Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', outline: 'none', background: '#f9fafb' }} placeholder="Rohan Sharma" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>Mobile Number (Used for Login)</label>
                <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', outline: 'none', background: '#f9fafb' }} placeholder="99XXXXXX99" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>Account Password</label>
              <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', outline: 'none', background: '#f9fafb' }} placeholder="Create a secure password" />
            </div>

            <hr style={{ border: 'none', borderTop: '1.5px dashed #eee', margin: '10px 0' }} />

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>Official Business/Studio Name</label>
              <input required type="text" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #eee', outline: 'none', background: '#f9fafb' }} placeholder="e.g. Royal Photography Studio" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#333' }}>Primary Service Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr)', gap: '12px' }}>
                {vendorTypes.map(t => (
                  <div key={t.id} onClick={() => setFormData({...formData, vendorType: t.id})} style={{ padding: '16px', border: formData.vendorType === t.id ? '2px solid #d11243' : '1.5px solid #eee', background: formData.vendorType === t.id ? '#fff0f3' : 'white', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}>
                    <div style={{ color: formData.vendorType === t.id ? '#d11243' : '#666' }}>{t.icon}</div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '14px', color: formData.vendorType === t.id ? '#d11243' : '#111' }}>{t.id}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={status === 'submitting'} style={{ width: '100%', padding: '16px', background: '#111', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: status === 'submitting' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
              {status === 'submitting' ? 'Submitting Application...' : 'Submit Partnership Application'} <ArrowRight size={18} />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
