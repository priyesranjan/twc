"use client";
import React, { useState, useEffect } from 'react';
import { FileText, IndianRupee, CheckCircle, Clock, DownloadCloud } from 'lucide-react';

export default function BillingModule() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt_token') || 'admin-dev';
      const res = await fetch('/api/admin/invoices', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch (err) {
      console.warn("Using mock data");
      setInvoices([{ id: 1001, amount: 450000, status: 'UNPAID', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), createdAt: new Date().toISOString(), inquiry: { customer: { name: 'Rahul Sharma', phone: '9876543210' } } }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const markPaid = async (id) => {
    if (!window.confirm("Mark as fully paid? This cannot be undone.")) return;
    try {
      await fetch(`/api/admin/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
        body: JSON.stringify({ status: 'PAID' })
      });
      setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'PAID' } : i));
    } catch (e) { alert('Failed to update invoice.'); }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#111', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText color="#10b981" /> Billing & Invoicing
          </h1>
          <p style={{ color: '#aaa', fontSize: '13px', margin: '4px 0 0 32px' }}>Track Active Tax Invoices</p>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: '4px solid #6366f1' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '600' }}>Total Invoiced (All Time)</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#111', fontWeight: '800' }}>{formatCurrency(invoices.reduce((a, b) => a + parseFloat(b.amount), 0))}</h2>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: '4px solid #d97706' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '600' }}>Pending Collection</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#d97706', fontWeight: '800' }}>{formatCurrency(invoices.filter(i => i.status === 'UNPAID').reduce((a, b) => a + parseFloat(b.amount), 0))}</h2>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '600' }}>Collected (PAID)</p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#10b981', fontWeight: '800' }}>{formatCurrency(invoices.filter(i => i.status === 'PAID').reduce((a, b) => a + parseFloat(b.amount), 0))}</h2>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading Financials...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Invoice ID</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Customer Name</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Billed Amount (+18% GST)</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const isPaid = inv.status === 'PAID';
                  const amount = parseFloat(inv.amount);
                  const totalWithGst = amount + (amount * 0.18);
                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '700', color: '#4f46e5' }}>INV-{inv.id}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '600', color: '#111' }}>{inv.inquiry?.customer?.name || 'Customer'}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{inv.inquiry?.customer?.phone}</div>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: '800', color: '#111' }}>{formatCurrency(totalWithGst)}</td>
                      <td style={{ padding: '16px 24px' }}>
                        {isPaid ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}><CheckCircle size={14} /> PAID</span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fffbeb', color: '#d97706', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}><Clock size={14} /> PENDING</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {!isPaid && (
                          <button onClick={() => markPaid(inv.id)} style={{ background: '#111', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>Mark Paid</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
