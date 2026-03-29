import Link from 'next/link';
import { Search, MapPin, Star } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Venues', icon: '🏰', color: '#fbe6ea' },
    { name: 'Photographers', icon: '📸', color: '#e6f0fa' },
    { name: 'Makeup Artists', icon: '💄', color: '#f4e6fa' },
    { name: 'Mehendi', icon: '🖐️', color: '#e6faeb' },
    { name: 'Band/DJ', icon: '🎵', color: '#fcf0d4' },
    { name: 'Cars', icon: '🚗', color: '#f0e6e6' },
    { name: 'Catering', icon: '🍽️', color: '#e6fce2' },
    { name: 'Rentals', icon: '👗', color: '#fcd2d2' },
  ];

  const featuredListings = [
    {
      id: 1,
      name: 'The Royal Palace Banquet',
      category: 'Venue',
      price: '₹1200 / plate',
      rating: '4.8',
      reviews: 124,
      location: 'Motihari, Bihar',
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Elegance Photography',
      category: 'Photographer',
      price: 'Starting ₹35,000 / day',
      rating: '4.9',
      reviews: 89,
      location: 'Motihari, Bihar',
      img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <main className="animate-fade-in">
      {/* 1. Hero Banner */}
      <section style={{
        position: 'relative',
        height: '240px',
        overflow: 'hidden',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <img 
          src="https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Indian Wedding"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          {/* 2. Heading */}
          <h1 style={{ color: 'white', fontSize: '28px', textShadow: '0 2px 10px rgba(0,0,0,0.5)', marginBottom: '8px' }}>
            Find Your Dream Wedding Services
          </h1>
          <p style={{ color: '#eee', fontSize: '14px' }}>Discover 50,000+ verified vendors</p>
        </div>
      </section>

      {/* 3. Smart Search */}
      <div className="smart-search">
        <Search className="search-icon" size={20} />
        <input type="text" placeholder="e.g. Makeup artist in Patna under 15k" />
      </div>

      {/* 4. Quick Categories */}
      <section className="px-main" style={{ marginBottom: '24px', zIndex: 1, position: 'relative' }}>
        <h2 className="section-title">Categories</h2>
        <div className="category-grid" style={{ marginTop: '16px' }}>
          {categories.slice(0, 8).map((cat, idx) => (
            <Link href={`/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/motihari/all`} key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <div className="category-icon" style={{ backgroundColor: cat.color }}>
                {cat.icon}
              </div>
              <span style={{ fontSize: '11px', fontWeight: '500', textAlign: 'center', color: 'var(--text-main)' }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Featured Listings */}
      <section className="px-main" style={{ marginBottom: '24px' }}>
        <div className="section-title">
          <span>Featured Vendors</span>
          <Link href="/vendors" className="section-link">View All</Link>
        </div>
        
        <div className="responsive-grid vendors" style={{ marginTop: '12px' }}>
          {featuredListings.map(listing => (
            <div key={listing.id} className="hover-scale" style={{
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--border-radius)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={listing.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={listing.name} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: 'var(--primary-color)' }}>
                  {listing.category}
                </div>
                {/* Advanced Promo Badge Feature */}
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  40% OFF
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '4px', width: '70%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{listing.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#2ba83c', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    <Star size={10} fill="white" style={{marginRight: '3px'}} /> {listing.rating}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px', gap: '4px' }}>
                  <MapPin size={12} /> {listing.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{listing.price}</div>
                  <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Advanced SEO Blog Section */}
      <section className="px-main" style={{ marginBottom: '30px', marginTop: '12px' }}>
        <div className="section-title">
          <span>Wedding Blogs You Can't Miss!</span>
          <Link href="/blog" className="section-link">View All</Link>
        </div>
        <div className="responsive-grid blogs" style={{ paddingBottom: '12px' }}>
          {[
            { id: 1, title: 'Varmala Design Inspirations to Elevate Your Ceremony!', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&w=300&q=80' },
            { id: 2, title: 'Trending Bridal Nail Art Designs and Colours!', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&w=300&q=80' }
          ].map(blog => (
            <div key={blog.id} className="hover-scale" style={{ minWidth: '220px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <img src={blog.img} style={{ width: '100%', height: '120px', objectFit: 'cover' }} alt="Blog" />
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', lineHeight: '1.4', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>{blog.title}</h3>
                <span style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: '600' }}>Read Article </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Corporate Location / Map Embed */}
      <section className="px-main" style={{ marginBottom: '40px', marginTop: '20px' }}>
        <div className="section-title">
          <span>Our Corporate Office</span>
        </div>
        <div style={{ 
          width: '100%', 
          borderRadius: 'var(--border-radius)', 
          overflow: 'hidden', 
          boxShadow: 'var(--shadow-md)',
          border: '1px solid #eee'
        }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1823934.549680587!2d82.67445935624995!3d26.764404199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ecb9d4081f8161%3A0xac214e263af86182!2sThe%20weddings%20chapter!5e0!3m2!1sen!2sin!4v1774768265344!5m2!1sen!2sin" 
            width="100%" 
            height="350" 
            style={{ border: 0, display: 'block' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Setup Guide Hint */}
      <div className="px-main" style={{ paddingBottom: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
          Powered by The Weddings Chapter <br/> Built for Zomato-like Mobile Experience.
        </p>
      </div>
    </main>
  );
}
