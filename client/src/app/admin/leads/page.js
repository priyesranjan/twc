"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Phone, Mail, MessageSquare, Send, RefreshCw, ChevronDown, X, User, TrendingUp } from 'lucide-react';

const STATUS_CONFIG = {
  NEW:        { label: 'New Lead',      color: '#e53e3e', bg: '#fff5f5' },
  CONTACTED:  { label: 'Contacted',     color: '#d97706', bg: '#fffbeb' },
  QUOTE_SENT: { label: 'Quote Sent',    color: '#2563eb', bg: '#eff6ff' },
  CONVERTED:  { label: 'Converted ✓',  color: '#16a34a', bg: '#f0fdf4' },
};

export default function CrmLeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [quotationText, setQuotationText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
      });
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      // Show mock data for when backend isn't running
      setLeads([
        {
          id: 1, status: 'NEW', message: 'Looking for venue for 200 guests wedding in April 2026.',
          createdAt: new Date().toISOString(), quotationSent: false, adminNotes: '',
          customer: { name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com' },
          venue: { location: 'Motihari, Bihar', city: 'Motihari' },
          assignedStaff: null,
        },
        {
          id: 2, status: 'CONTACTED', message: 'Need catering for 150 guests. Budget is ₹800 per plate.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), quotationSent: false, adminNotes: 'Called once, asked for callback.',
          customer: { name: 'Priya Gupta', phone: '9123456789', email: 'priya@example.com' },
          venue: null, assignedStaff: null,
        },
        {
          id: 3, status: 'QUOTE_SENT', message: 'Photographer needed for 2-day wedding ceremony.',
          createdAt: new Date(Date.now() - 172800000).toISOString(), quotationSent: true, adminNotes: 'Sent quote of ₹45,000 for 2 days.',
          customer: { name: 'Ankit Tiwari', phone: '9812345678', email: 'ankit@gmail.com' },
          venue: null, assignedStaff: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) setSelectedLead(prev => ({...prev, status: newStatus}));
    } catch (err) {
      // Optimistic update for dev
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) setSelectedLead(prev => ({...prev, status: newStatus}));
    }
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
        body: JSON.stringify({ adminNotes }),
      });
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, adminNotes } : l));
      alert('Notes saved!');
    } catch (err) { alert('Notes saved locally (backend offline).'); }
  };

  const saveFollowUp = async () => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
        body: JSON.stringify({ followUpDate }),
      });
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, followUpDate } : l));
      alert('Follow-up scheduled!');
    } catch (err) { alert('Follow-up saved locally (backend offline).'); }
  };

  const sendQuotation = async () => {
    if (!selectedLead || !quotationText) return alert('Please write a quotation first.');
    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
        body: JSON.stringify({ quotationText }),
      });
      const data = await res.json();
      alert(data.message);
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'QUOTE_SENT', quotationSent: true } : l));
      setSelectedLead(prev => ({...prev, status: 'QUOTE_SENT', quotationSent: true}));
    } catch (err) {
      alert(`Quotation logged locally! Would be sent to: ${selectedLead.customer?.email || selectedLead.customer?.phone}`);
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'QUOTE_SENT', quotationSent: true } : l));
    } finally {
      setIsSending(false);
    }
  };

  const filteredLeads = filterStatus === 'ALL' ? leads : leads.filter(l => l.status === filterStatus);
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    converted: leads.filter(l => l.status === 'CONVERTED').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #d11243, #8b0a2e)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: 0 }}>TWC CRM Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: '4px 0 0 0' }}>Manage customer leads and quotations</p>
        </div>
        <button onClick={fetchLeads} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Bar (Mini Analytics) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '24px 32px 0 32px' }}>
        {[
          { label: 'Total Leads Captured', value: stats.total, icon: <TrendingUp size={20} />, color: '#6366f1' },
          { label: 'Actionable Leads', value: stats.new + stats.contacted, icon: <Clock size={20} />, color: '#e53e3e' },
          { label: 'Conversion Rate', value: `${stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%`, icon: <CheckCircle2 size={20} />, color: '#16a34a' },
          { label: 'Overdue Follow-ups', value: leads.filter(l => l.followUpDate && new Date(l.followUpDate) < new Date() && l.status !== 'CONVERTED').length, icon: <Phone size={20} />, color: '#d11243' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: s.label === 'Overdue Follow-ups' && s.value > 0 ? '4px solid #d11243' : '4px solid transparent' }}>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', fontWeight: '600' }}>{s.label}</p>
              <p style={{ margin: '4px 0 0 0', fontWeight: '800', fontSize: '28px', color: '#111' }}>{s.value}</p>
            </div>
            <div style={{ background: s.color + '15', color: s.color, padding: '10px', borderRadius: '10px' }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 400px' : '1fr', gap: '24px', padding: '24px 32px', alignItems: 'start' }}>
        {/* Leads Table */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Filter */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginRight: '8px' }}>Filter:</span>
            {['ALL', 'NEW', 'CONTACTED', 'QUOTE_SENT', 'CONVERTED'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                border: filterStatus === s ? '2px solid #d11243' : '2px solid #e5e7eb',
                background: filterStatus === s ? '#fff0f3' : 'transparent',
                color: filterStatus === s ? '#d11243' : '#6b7280'
              }}>
                {s === 'ALL' ? 'All' : STATUS_CONFIG[s]?.label || s}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>No leads found. Start capturing leads by sharing the platform with customers!</div>
          ) : (
            filteredLeads.map(lead => {
              const st = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
              const isSelected = selectedLead?.id === lead.id;
              const isUrgent = lead.followUpDate && new Date(lead.followUpDate) <= new Date() && lead.status !== 'CONVERTED';
              
              return (
                <div key={lead.id} onClick={() => { 
                  setSelectedLead(lead); 
                  setAdminNotes(lead.adminNotes || ''); 
                  setQuotationText(''); 
                  setFollowUpDate(lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : '');
                }}
                  style={{
                    padding: '20px 24px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer',
                    background: isSelected ? '#fff8fa' : (isUrgent ? '#fff0f3' : 'white'),
                    borderLeft: isSelected ? '4px solid #d11243' : (isUrgent ? '4px solid #ef4444' : '4px solid transparent'),
                    transition: 'all 0.15s ease'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light, #fff0f3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={16} color="#d11243" />
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>{lead.customer?.name || 'Anonymous'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginLeft: '42px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={11} /> {lead.customer?.phone}
                        </span>
                        {lead.customer?.email && (
                          <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={11} /> {lead.customer?.email}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: '8px 0 0 42px', fontStyle: 'italic' }}>"{lead.message?.substring(0, 80)}..."</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{ background: st.bg, color: st.color, padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {st.label}
                      </span>
                      {isUrgent && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 'bold' }}>🔥 URGENT</span>}
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(lead.createdAt).toLocaleDateString('en-IN')}</span>
                      {lead.quotationSent && <span style={{ fontSize: '11px', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '50px' }}>Quote Sent ✓</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lead Detail Sidebar */}
        {selectedLead && (
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'sticky', top: '80px' }}>
            <div style={{ background: 'linear-gradient(135deg, #d11243, #8b0a2e)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontWeight: '700', margin: 0, fontSize: '16px' }}>Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Customer Info */}
              <div>
                <p style={{ margin: '0 0 12px 0', fontWeight: '700', color: '#374151' }}>Customer Info</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                    <User size={14} color="#d11243" />
                    <span style={{ fontWeight: '600' }}>{selectedLead.customer?.name || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                    <Phone size={14} color="#d11243" />
                    <a href={`tel:${selectedLead.customer?.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{selectedLead.customer?.phone}</a>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                    <Mail size={14} color="#d11243" />
                    <span style={{ color: selectedLead.customer?.email ? '#111' : '#9ca3af' }}>{selectedLead.customer?.email || 'Email not provided yet'}</span>
                  </div>
                </div>
              </div>

              {/* Event Details (Shubh Muhurat & Services) */}
              {selectedLead.eventDetails && (
                <div>
                  <p style={{ margin: '0 0 12px 0', fontWeight: '700', color: '#374151' }}>Event Details</p>
                  <div style={{ background: '#fff', border: '1.5px solid #eee', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Date / Shubh Muhurat</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#d11243' }}>{selectedLead.eventDetails.date}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Expected Guests</span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>{selectedLead.eventDetails.guests}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Budget Estimate</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#2ba83c' }}>{selectedLead.eventDetails.budget}</span>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '4px 0' }} />

                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>Requested Services</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {selectedLead.eventDetails.services && selectedLead.eventDetails.services.map((srv, idx) => (
                          <span key={idx} style={{ background: selectedLead.eventDetails.packageType === 'COMPLETE' ? '#d11243' : '#f3f4f6', color: selectedLead.eventDetails.packageType === 'COMPLETE' ? 'white' : '#374151', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '600' }}>
                            {srv === 'All inclusive TWC Package' ? '🌟 Complete Event Package' : srv}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Generate Invoice (Only if CONVERTED) */}
                {selectedLead.status === 'CONVERTED' && (
                  <div style={{ marginTop: '24px' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} /> Booking Finalized
                    </p>
                    <button 
                      onClick={generateInvoice} 
                      disabled={isSending}
                      style={{ width: '100%', padding: '16px', background: '#ecfdf5', color: '#16a34a', border: '2px dashed #16a34a', borderRadius: '12px', fontWeight: '800', cursor: isSending ? 'not-allowed' : 'pointer', fontSize: '15px' }}>
                      {isSending ? 'Generating Invoice...' : 'Generate & Email Tax Invoice'}
                    </button>
                  </div>
                )}
                
              </div>
                </div>
              )}

              {/* Requirement */}
              <div>
                <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#374151' }}>Customer Requirement (Message)</p>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#374151' }}>Update Status</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <button key={key} onClick={() => updateLeadStatus(selectedLead.id, key)} style={{
                      padding: '6px 14px', borderRadius: '50px', border: `2px solid ${selectedLead.status === key ? val.color : '#e5e7eb'}`,
                      background: selectedLead.status === key ? val.bg : 'transparent',
                      color: selectedLead.status === key ? val.color : '#6b7280',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s'
                    }}>
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow Up Planner */}
              <div>
                <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#374151' }}>Set Follow-Up Date</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="date" 
                    value={followUpDate} 
                    onChange={(e) => setFollowUpDate(e.target.value)} 
                    style={{ flex: 1, padding: '10px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                  />
                  <button onClick={saveFollowUp} style={{ padding: '0 16px', background: '#d11243', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                    Set Reminder
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#374151' }}>Private Admin Notes</p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Write internal notes (budget discussed, callback scheduled, etc.)..."
                  style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button onClick={saveNotes} style={{ marginTop: '8px', padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#374151' }}>
                  Save Notes
                </button>
              </div>

              {/* Quotation Engine */}
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={14} color="#d11243" /> Generate & Send Quotation
                </p>
                <textarea
                  value={quotationText}
                  onChange={(e) => setQuotationText(e.target.value)}
                  placeholder={`Dear ${selectedLead.customer?.name || 'Customer'},\n\nThank you for your interest in The Weddings Chapter...\n\nVenue Package: ₹XXXX/plate\nCapacity: XXX guests\nIncludes: Decoration, Catering, Photography\n\nBest Regards,\nTWC Team`}
                  style={{ width: '100%', minHeight: '120px', padding: '10px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.6' }}
                />
                <button onClick={sendQuotation} disabled={isSending} style={{ marginTop: '12px', width: '100%', padding: '12px', background: 'linear-gradient(135deg, #d11243, #8b0a2e)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send size={15} />
                  {isSending ? 'Sending...' : 'Send Quotation to Customer'}
                </button>
                <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
                  Quotation will be logged in DB & emailed to: {selectedLead.customer?.email || selectedLead.customer?.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
