"use client";
import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, FileText, CheckCircle2, ChevronDown, DollarSign, Calendar, Users } from 'lucide-react';

export default function VendorDashboard() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [vendorNotes, setVendorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vendor/leads', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'vendor-dev'}` },
      });
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      // Mock data for UI testing
      setLeads([
        {
          id: 101, status: 'NEW', message: 'Looking for a premium photographer and drone coverage.',
          createdAt: new Date().toISOString(), eventDetails: { date: 'Nov 16, 2026', packageType: 'CUSTOM', services: ['Photography & Videography'], guests: '500-1000', budget: '₹5L - ₹10L' },
          customer: { name: 'Customer #101' }, bids: []
        },
        {
          id: 102, status: 'NEW', message: 'Need catering for Haldi and Wedding.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), eventDetails: { date: 'Nov 22, 2026', guests: '200-500', budget: 'Under ₹5 Lakh' },
          customer: { name: 'Customer #102' }, bids: [{ bidAmount: '45000', status: 'PENDING' }]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const submitBid = async () => {
    if (!selectedLead || !bidAmount) return alert('Enter a valid bid amount.');
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/vendor/leads/${selectedLead.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'vendor-dev'}` },
        body: JSON.stringify({ bidAmount: parseFloat(bidAmount), vendorNotes }),
      });
      const data = await res.json();
      alert(data.message);
      
      // Update local state
      const newBid = { bidAmount, vendorNotes, status: 'PENDING' };
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, bids: [newBid] } : l));
      setSelectedLead(null);
    } catch (err) {
      alert('Bid submitted locally (Backend Offline)');
      const newBid = { bidAmount, vendorNotes, status: 'PENDING' };
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, bids: [newBid] } : l));
      setSelectedLead(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#111', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="#d11243" /> TWC Partner Portal
          </h1>
          <p style={{ color: '#999', fontSize: '12px', margin: '4px 0 0 28px' }}>Manage Assignments & Bids</p>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: '#111' }}>Available Opportunities {leads.length > 0 && `(${leads.length})`}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 420px' : '1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Leads Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {isLoading ? <p>Loading opportunities...</p> : leads.map(lead => {
              const myBid = lead.bids && lead.bids[0];
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div key={lead.id} onClick={() => { setSelectedLead(lead); setBidAmount(myBid?.bidAmount || ''); setVendorNotes(myBid?.vendorNotes || ''); }}
                  style={{
                    background: 'white', borderRadius: '16px', padding: '20px', cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(209,18,67,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                    border: isSelected ? '2px solid #d11243' : '2px solid transparent',
                    transition: 'all 0.2s ease'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontWeight: '700', color: '#111' }}>{lead.customer?.name || `Client #${lead.id}`}</span>
                    {myBid ? (
                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#d97706', background: '#fffbeb', padding: '4px 8px', borderRadius: '50px' }}>
                         <Clock size={12} /> Bid Pending (₹{myBid.bidAmount})
                       </span>
                    ) : (
                       <span style={{ background: '#e5f6fd', color: '#0288d1', padding: '4px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: '700' }}>New Opportunity</span>
                    )}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                      <Calendar size={14} color="#d11243" /> {lead.eventDetails?.date || 'Flexible'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                      <Users size={14} color="#d11243" /> {lead.eventDetails?.guests || 'Unknown'}
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#444', background: '#f9f9f9', padding: '12px', borderRadius: '8px', margin: 0 }}>
                    "{lead.message.substring(0, 100)}..."
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bidding Sidebar */}
          {selectedLead && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 16px 0', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>Submit Your Bid</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#666' }}>Client's Estimated Budget</p>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#2ba83c' }}>{selectedLead.eventDetails?.budget || 'Not provided'}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#666' }}>Your Quoted Price (₹)</p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontWeight: '700' }}>₹</span>
                  <input 
                    type="number" 
                    value={bidAmount} 
                    onChange={e => setBidAmount(e.target.value)} 
                    placeholder="45000"
                    style={{ width: '100%', padding: '14px 14px 14px 32px', border: '1.5px solid #eee', borderRadius: '10px', fontSize: '16px', fontWeight: '600', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#666' }}>Proposal Details / Terms (Optional)</p>
                <textarea 
                  value={vendorNotes}
                  onChange={e => setVendorNotes(e.target.value)}
                  placeholder="E.g., Includes 2 photographers, album, drone... Excludes transport."
                  style={{ width: '100%', height: '100px', padding: '12px', border: '1.5px solid #eee', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                onClick={submitBid}
                disabled={isSubmitting || !bidAmount}
                style={{ width: '100%', padding: '16px', background: !bidAmount ? '#ccc' : '#d11243', color: 'white', fontWeight: '700', fontSize: '15px', border: 'none', borderRadius: '12px', cursor: !bidAmount ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
              >
                {isSubmitting ? 'Submitting...' : (selectedLead.bids?.length > 0 ? 'Update Bid' : 'Submit Final Bid →')}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '11px', color: '#999', margin: '12px 0 0 0' }}>
                Your bid will be sent to the TWC Admin Team. You will be notified if the client accepts.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
