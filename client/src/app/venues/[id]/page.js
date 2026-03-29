"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, IndianRupee, ArrowRight, UserCircle2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VendorProfile({ params }) {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Next.js 15 requires unwrapping params
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id;

  useEffect(() => {
    async function fetchVendor() {
      try {
        const res = await fetch(`/api/public/vendors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVendor(data);
        } else { setVendor(null); }
      } catch (err) { setVendor(null); }
      finally { setLoading(false); }
    }
    if (id) fetchVendor();
  }, [id]);

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'Inter' }}>Loading Verified Partner...</div>;
  if (!vendor) return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'Inter' }}><h3>Partner Not Found</h3></div>;

  const isHotel = (vendor.vendorType || '').includes('Hotel') || (vendor.vendorType || '').includes('Banquet');

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f4f6f8', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Cover */}
      <div style={{ height: '350px', background: '#111', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111 0%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0', maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#10b981', padding: '6px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
            <ShieldCheck size={14} /> TWC Verified Secure Partner
          </div>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '900', margin: '0 0 12px 0' }}>{vendor.businessName}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '15px' }}>
            <MapPin size={16} /> {vendor.address}, {vendor.city} 
            <span style={{ margin: '0 8px' }}>•</span>
            <span style={{ fontWeight: '800', color: 'white' }}>{vendor.vendorType || 'Wedding Services'}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        
        {/* Main Content */}
        <div>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 16px 0', color: '#111' }}>About {vendor.businessName}</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
              {vendor.description || `${vendor.businessName} is a top-rated wedding partner in ${vendor.city}. As a fully verified member of The Weddings Chapter network, they guarantee exceptional service, 100% transparent pricing, and comprehensive execution for your Big Day.`}
            </p>
          </div>
        </div>

        {/* Agency-Controlled Booking Panel */}
        <div>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', position: 'sticky', top: '40px' }}>
            
            {isHotel && (
              <div style={{ background: '#fff0f3', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1.5px solid #ffe4e6', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#d11243', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>TWC Special Negotiation</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IndianRupee size={28} /> 19,999<span style={{ fontSize: '14px', color: '#666', fontWeight: '500', marginLeft: '4px' }}>/start</span>
                </div>
              </div>
            )}

            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', color: '#111' }}>Secure Your Booking</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
              To ensure 100% financial security and the lowest possible negotiated price, all bookings for {vendor.businessName} must be initiated through their official TWC Agency Representative.
            </p>

            <button 
              onClick={() => router.push('/')} 
              style={{ width: '100%', background: '#111', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              Enquire with TWC Expert <MessageCircle size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
              <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><UserCircle2 size={24} /></div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Your Dedicated Matchmaker</div>
                <div style={{ fontSize: '14px', color: '#111', fontWeight: '800' }}>TWC Agency Team</div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
