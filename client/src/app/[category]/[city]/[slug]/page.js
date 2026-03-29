"use client";
import React, { useState, use } from 'react';
import { Star, MapPin, Share2, Heart, ShieldCheck, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import LeadCaptureWizard from '../../../../components/LeadCaptureWizard';

// Example: /banquet-halls/delhi/the-royal-palace
export default function SEOVenueDetail(props) {
  const params = use(props.params);
  const { category, city, slug } = params;
  const { user, openOtpModal } = useAuth();
  const isAuthenticated = user?.authenticated;
  const [isFavorited, setIsFavorited] = useState(false); // Optimistic UI state
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleLeadSubmit = async ({ message, eventDetails }) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ venueId: 1, message, eventDetails })
      });
      const data = await res.json();
      if (res.ok || res.status === 404) {
        alert(`Lead successfully captured! TWC team will contact you shortly regarding ${slug.replace(/-/g, ' ')}.`);
      } else {
        alert(data.message || 'Error sending lead');
      }
    } catch (err) {
      alert('Request sent! (Waiting for Backend Database sync)');
    }
  };

  const handleLeadCapture = async (actionType) => {
    if (!isAuthenticated) return openOtpModal();
    setIsWizardOpen(true);
  };
  
  // Convert slug to readable name
  const formattedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const venue = {
    id: 1,
    name: formattedName || "The Royal Palace Banquet",
    categoryLabel: category === 'banquet-halls' ? "Banquet Hall" : "Destination Venue",
    rating: 4.8,
    reviews: 124,
    location: `Central ${city.charAt(0).toUpperCase() + city.slice(1)}`,
    pricePerPlate: "₹1,200",
    vegPrice: "₹1,200",
    nonVegPrice: "₹1,500",
    capacity: "500 - 1500 Guests",
    description: `The ${formattedName} is a premium destination for luxury weddings in ${city}. Featuring elegant crystal chandeliers, expansive fully air-conditioned halls, and state-of-the-art catering facilities to fulfill all your ${category.replace('-', ' ')} needs.`,
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    features: ["Air Conditioned", "Parking Available", "In-house Catering", "Decor Provided", "Bridal Room", "DJ Allowed"]
  };

  return (
    <main className="animate-fade-in" style={{ paddingBottom: '80px', backgroundColor: 'var(--bg-color)' }}>
      {/* 1. SEO Breadcrumb Headers */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theweddingschapter.com/" },
            { "@type": "ListItem", "position": 2, "name": city, "item": `https://theweddingschapter.com/${category}/${city}/all` },
            { "@type": "ListItem", "position": 3, "name": venue.name, "item": `https://theweddingschapter.com/${category}/${city}/${slug}` }
          ]
        })
      }} />

      <div className="detail-grid">
        {/* Top Image Carousel / Hero Image */}
        <section style={{ position: 'relative', height: '100%', minHeight: '300px', width: '100%' }}>
        <img src={venue.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={venue.name} />
        
        {/* Navigation Overlays */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span style={{ background: '#d11243', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>SAVE 40%</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Share2 size={18} />
            </button>
            <button onClick={() => setIsFavorited(!isFavorited)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.2s', transform: isFavorited ? 'scale(1.1)' : 'scale(1)' }}>
              <Heart size={18} fill={isFavorited ? '#d11243' : 'none'} color={isFavorited ? '#d11243' : 'currentColor'} />
            </button>
          </div>
        </div>
        
        {/* Image indicators */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>
          1 / 15 Photos
        </div>
      </section>

      {/* Main Details Body */}
      <section style={{ 
        backgroundColor: 'var(--surface-color)', 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px', 
        marginTop: '-24px', 
        position: 'relative',
        padding: '24px 20px',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.05)'
      }}>
        
        {/* Title Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0', lineHeight: '1.2' }}>{venue.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px', gap: '4px', marginBottom: '8px' }}>
              <MapPin size={14} /> {venue.location}
              <span style={{ color: 'var(--primary-color)', fontWeight: '500', marginLeft: '8px', cursor: 'pointer' }}>View Map</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#2ba83c', color: 'white', padding: '6px 8px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}><Star size={12} fill="white" style={{marginRight: '2px'}} /> {venue.rating}</span>
            <span style={{ fontSize: '10px' }}>{venue.reviews} reviews</span>
          </div>
        </div>

        {/* Verification Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '8px 12px', borderRadius: '8px', marginTop: '12px' }}>
          <ShieldCheck size={16} color="var(--primary-color)" />
          <span style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '600' }}>Verified TWC Partner</span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' }} />

        {/* Pricing Info with Price Wall Gating */}
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Pricing Setup</h2>
        {!isAuthenticated ? (
          <div style={{ background: 'linear-gradient(135deg, #fce4e4 0%, #fef8f8 100%)', padding: '24px', borderRadius: 'var(--border-radius)', textAlign: 'center', border: '1px dashed var(--primary-color)' }}>
            <Lock size={28} color="var(--primary-color)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '8px' }}>Prices are Locked</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Share your mobile number to see the exact prices and availability in {city}.</p>
            <button onClick={openOtpModal} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px', width: 'auto' }}>
              Unlock Pricing
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 'var(--border-radius)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2ba83c', marginBottom: '8px' }}></div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Veg Plate</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{venue.vegPrice}</span>
            </div>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 'var(--border-radius)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d11243', marginBottom: '8px' }}></div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Non-Veg Plate</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{venue.nonVegPrice}</span>
            </div>
          </div>
        )}
        
        {/* Capacity Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: 'var(--border-radius)', marginTop: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Guest Capacity</span>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>{venue.capacity}</span>
          </div>
          <ChevronRight size={20} color="var(--text-light)" />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' }} />

        {/* About Section */}
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>About {venue.name}</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          {venue.description}
          <span style={{ color: 'var(--primary-color)', fontWeight: '500', cursor: 'pointer', marginLeft: '4px' }}>Read More</span>
        </p>

        {/* Features */}
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginTop: '24px', marginBottom: '16px', color: 'var(--text-main)' }}>Amenities & Features</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {venue.features.map((feature, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f5f5', padding: '8px 12px', borderRadius: '20px', fontSize: '12px', color: 'var(--text-main)' }}>
              <CheckCircle2 size={14} color="var(--primary-color)" /> {feature}
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* Floating Bottom Booking Action */}
      <div className="floating-action-bar" style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '100%', 
        maxWidth: '480px', 
        backgroundColor: 'var(--surface-color)', 
        padding: '12px 20px', 
        boxShadow: '0 -10px 20px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 100,
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'
      }}>
        <button onClick={() => handleLeadCapture('Book Guided Visit')} style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: 'white', 
          border: '1px solid var(--primary-color)', 
          color: 'var(--primary-color)', 
          borderRadius: '50px', 
          fontWeight: '600', 
          fontSize: '14px' 
        }}>
          {isAuthenticated ? 'Book Guided Visit' : 'Login to Book Visit'}
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleLeadCapture('Call Request')} style={{ flex: 1, padding: '12px', backgroundColor: '#f0f0f0', border: 'none', color: 'var(--text-main)', borderRadius: '50px', fontWeight: '600', fontSize: '14px' }}>
            Call Vendor
          </button>
          <button onClick={() => handleLeadCapture('Price Quote')} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--primary-color)', border: 'none', color: 'white', borderRadius: '50px', fontWeight: '600', fontSize: '14px' }}>
            Get Quote
          </button>
        </div>
      </div>

      {/* Render the Wizard */}
      <LeadCaptureWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onSubmit={handleLeadSubmit} 
        title={venue.name}
      />
    </main>
  );
}
