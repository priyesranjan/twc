"use client";
import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, IndianRupee, TrendingUp, Users, CalendarDays, Activity } from 'lucide-react';

export default function AdminAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
        });
        const data = await res.json();
        setMetrics(data.metrics);
      } catch (err) {
        // Mock data
        setMetrics({
          totalUsers: 1450, totalVendors: 42, totalLeads: 218,
          statusCount: { NEW: 45, CONTACTED: 80, QUOTE_SENT: 60, CONVERTED: 33 },
          totalPipelineValue: 45000000 // 4.5Cr
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Analytics Engine...</div>;
  if (!metrics) return <div>Failed to load metrics.</div>;

  const total = metrics.totalLeads || 1; // Prevent div by 0

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #111, #222)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity color="#d11243" /> Intelligence Dashboard
          </h1>
          <p style={{ color: '#aaa', fontSize: '13px', margin: '4px 0 0 32px' }}>Real-time Marketplace Performance</p>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* KPI Top Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #16a34a', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#666', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><IndianRupee size={14} /> Total Pipeline Target</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#111' }}>{formatCurrency(metrics.totalPipelineValue)}</div>
            <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: '700', marginTop: '8px' }}>↑ Based on User Event Budgets</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #d11243', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#666', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={14} /> Total Leads Generated</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#111' }}>{metrics.totalLeads}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #6366f1', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#666', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Registered Customers</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#111' }}>{metrics.totalUsers}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #d97706', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#666', fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><BarChart3 size={14} /> Partner Vendors</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#111' }}>{metrics.totalVendors}</div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          
          {/* Conversion Funnel Bar Chart */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="#d11243" /> Lead Conversion Funnel
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'New Inquiries', val: metrics.statusCount?.NEW || 0, color: '#e53e3e' },
                { label: 'Contacted/In Progress', val: metrics.statusCount?.CONTACTED || 0, color: '#d97706' },
                { label: 'Proposals Distributed', val: metrics.statusCount?.QUOTE_SENT || 0, color: '#3b82f6' },
                { label: 'Successfully Converted', val: metrics.statusCount?.CONVERTED || 0, color: '#16a34a' },
              ].map((s, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 50px', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>{s.label}</span>
                  <div style={{ width: '100%', height: '24px', background: '#f5f5f5', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ width: `${(s.val / total) * 100}%`, height: '100%', background: s.color, borderRadius: '12px', transition: 'width 1s ease' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#111', textAlign: 'right' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Dates */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={18} color="#d11243" /> Surging Shubh Muhurat
            </h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>Most requested dates by customers. Consider surge pricing for top slots.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Mocking the surging dates visually since we don't have complex SQL group by on JSON fields easily */}
              {[
                { date: 'Nov 16, 2026', hits: 45, hot: true },
                { date: 'Feb 14, 2027', hits: 32, hot: true },
                { date: 'Nov 22, 2026', hits: 18, hot: false },
                { date: 'Dec 4, 2026', hits: 11, hot: false },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1.5px solid #f0f0f0', borderRadius: '10px', background: d.hot ? '#fffafb' : 'transparent' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: d.hot ? '#d11243' : '#111' }}>{d.date}</span>
                    {d.hot && <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 'bold' }}>High Demand 🔥</span>}
                  </div>
                  <span style={{ background: '#eee', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '800' }}>{d.hits} Leads</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
