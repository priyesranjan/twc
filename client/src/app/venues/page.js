"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Building2, Camera, Star, ArrowRight } from 'lucide-react';

export default function PublicVenues() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await fetch('/api/public/vendors');
        const data = await res.json();
        setVendors(data);
      } catch (e) {
        console.error("Failed fetching public directory");
        // Mock fallback if server is unreachable
        setVendors([{
          id: 1, businessName: 'The Royal Palace Banquet', city: 'Motihari', vendorType: 'Hotel / Banquet', description: 'Premium marriage lawn with seating for 1000.'
        }]);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);

  const filtered = filter === 'All' ? vendors : vendors.filter(v => (v.vendorType || '').includes(filter));

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header */}
      <header style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #111, #222)', color: 'white' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 16px 0' }}>Discover Motihari's Best</h1>
        <p style={{ fontSize: '18px', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>Find verified Marriage Halls, Photographers, and Event Planners curated exclusively by The Weddings Chapter.</p>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
          {['All', 'Hotel', 'Photographer', 'Mehndi', 'Caterers'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? '#d11243' : 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Directory Grid */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Loading the directory...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '16px' }}>
            <Search size={48} color="#ddd" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '24px', color: '#111', margin: '0 0 8px 0' }}>No partners found</h2>
            <p style={{ color: '#666' }}>We are currently expanding our network in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {filtered.map(vendor => (
              <div key={vendor.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                {/* Image Placeholder */}
                <div style={{ height: '220px', background: '#e2e8f0', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '11px', fontWeight: '800', backdropFilter: 'blur(4px)' }}>
                    {vendor.vendorType || 'Premium Vendor'}
                  </div>
                  {(vendor.vendorType || '').includes('Hotel') && (
                    <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: '#d11243', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={14} fill="currentColor" /> Starts ₹19k
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d11243', fontSize: '12px', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase' }}>
                    <MapPin size={14} /> {vendor.city || 'Bihar'}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 12px 0', lineHeight: '1.2', color: '#111' }}>{vendor.businessName}</h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                    {vendor.description ? (vendor.description.substring(0, 80) + '...') : 'A premium verified partner on The Weddings Chapter.'}
                  </p>
                  
                  {/* Agency-Protected View Button */}
                  <Link href={`/venues/${vendor.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f8f9fa', color: '#111', padding: '14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', border: '1.5px solid #eee', transition: 'background 0.2s' }}>
                    View Property Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
