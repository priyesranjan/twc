"use client";
import React from 'react';
import { Building2, IndianRupee, Rocket, CheckCircle2, Star, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ListVenueMarketing() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8f9fa' }}>
      
      {/* Navbar Minimal */}
      <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#d11243', margin: 0 }}>The Weddings Chapter</h1>
        <Link href="/vendor/register" style={{ background: '#111', color: 'white', padding: '12px 24px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
          Partner Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #111, #222)', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(209, 18, 67, 0.2)', color: '#ff4d6d', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '800', marginBottom: '24px', border: '1px solid rgba(209, 18, 67, 0.4)' }}>
            <Rocket size={16} /> Exclusive Motihari Partner Program
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 24px 0' }}>
            List your Hotel or Marriage Hall. <br />
            <span style={{ color: '#d11243' }}>Get Guaranteed Bookings.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#ccc', margin: '0 0 40px 0', lineHeight: '1.6' }}>
            Join East Champaran’s largest digital wedding directory. We actively match thousands of couples with premium venues like yours.
          </p>
          
          {/* THE HOOK */}
          <div style={{ background: '#d11243', padding: '24px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 10px 30px rgba(209,18,67,0.3)', border: '2px solid #ff4d6d', marginBottom: '40px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <IndianRupee size={24} /> SPECIAL ONBOARDING OFFER
            </h3>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Start accepting Marriage Hall bookings today from just <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffe4e6' }}>₹19,999!</span></p>
          </div>

          <div>
            <Link href="/vendor/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#111', padding: '16px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '800', fontSize: '16px', transition: 'transform 0.2s' }}>
              List Your Property Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#111', margin: '0 0 16px 0' }}>Why partner with TWC?</h2>
          <p style={{ fontSize: '16px', color: '#666' }}>We completely automate your digital marketing and lead generation.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Users size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 12px 0' }}>High-Intent Leads</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>Access a daily feed of couples aggressively looking to finalize their Shubh Muhurat dates in Motihari.</p>
          </div>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: '#fff0f3', color: '#d11243', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <TrendingUp size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 12px 0' }}>Bid & Win</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>Use our custom Vendor Portal to submit your own custom pricing quotes directly to the customer's phone.</p>
          </div>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Star size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 12px 0' }}>SEO Features</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>Our marketing team constantly publishes blogs featuring our top partners, driving immense Google traffic to your business.</p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section style={{ background: '#f1f5f9', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#111', margin: '0 0 24px 0' }}>Ready to fill your booking calendar?</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>Join 45+ other premium venues in East Champaran.</p>
        <Link href="/vendor/register" style={{ display: 'inline-block', background: '#111', color: 'white', padding: '16px 40px', borderRadius: '50px', textDecoration: 'none', fontWeight: '800', fontSize: '16px' }}>
          Start Onboarding Wizard
        </Link>
      </section>
    </div>
  );
}
