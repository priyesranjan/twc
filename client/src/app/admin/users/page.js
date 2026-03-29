"use client";
import React, { useState, useEffect } from 'react';
import { Users, Briefcase, ShieldCheck, ShieldAlert, Trash2, CheckCircle, Search } from 'lucide-react';

export default function UserRegistry() {
  const [activeTab, setActiveTab] = useState('USERS');
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt_token') || 'admin-dev';
      const uRes = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
      const vRes = await fetch('/api/admin/vendors', { headers: { 'Authorization': `Bearer ${token}` } });
      const uData = await uRes.json();
      const vData = await vRes.json();
      setUsers(uData.users || []);
      setVendors(vData.vendors || []);
    } catch (err) {
      console.warn("Using mock data as server is down");
      setUsers([{ id: 1, name: 'Rahul K', phone: '9876543210', email: 'rahul@test.com', _count: { inquiries: 2 }, createdAt: new Date().toISOString() }]);
      setVendors([{ id: 10, businessName: 'Suman Photography', city: 'Motihari', verified_status: false, user: { name: 'Suman', phone: '9998887776' }, createdAt: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (e) { alert('Failed to delete user.'); }
  };

  const toggleVendorVerification = async (id, currentStatus) => {
    try {
      await fetch(`/api/admin/vendors/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token') || 'admin-dev'}` },
        body: JSON.stringify({ verified: !currentStatus })
      });
      setVendors(vendors.map(v => v.id === id ? { ...v, verified_status: !currentStatus } : v));
    } catch (e) { alert('Failed to verify vendor.'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#111', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users color="#d11243" /> Central Registry
          </h1>
          <p style={{ color: '#aaa', fontSize: '13px', margin: '4px 0 0 32px' }}>Manage Customers & Partners</p>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <button onClick={() => setActiveTab('USERS')} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: activeTab === 'USERS' ? '#d11243' : 'white', color: activeTab === 'USERS' ? 'white' : '#666', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Users size={18} /> Customers ({users.length})
          </button>
          <button onClick={() => setActiveTab('VENDORS')} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: activeTab === 'VENDORS' ? '#111' : 'white', color: activeTab === 'VENDORS' ? 'white' : '#666', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Briefcase size={18} /> Vendor Network ({vendors.length})
          </button>
        </div>

        {/* Content */}
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading registry...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                  {activeTab === 'USERS' ? (
                    <>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Customer Name</th>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Contact</th>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Inquiries</th>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666', textAlign: 'right' }}>Actions</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Business Name</th>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Owner Contact</th>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666' }}>Verification</th>
                      <th style={{ padding: '16px 24px', fontSize: '13px', color: '#666', textAlign: 'right' }}>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'USERS' ? users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '600' }}>{u.name || 'Anonymous'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', color: '#111' }}>{u.phone}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{u.email || 'No email'}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}><span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}>{u._count?.inquiries || 0} Leads</span></td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button onClick={() => deleteUser(u.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700' }}><Trash2 size={14} /> Ban User</button>
                    </td>
                  </tr>
                )) : vendors.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: '#111' }}>{v.businessName}</div>
                      {v.vendorType && (
                        <div style={{ marginTop: '4px', display: 'inline-block', background: '#fff0f3', color: '#d11243', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>
                          Registered As: {v.vendorType}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Location: {v.city}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', color: '#111' }}>{v.user?.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{v.user?.phone}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {v.verified_status ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}><ShieldCheck size={14} /> Verified</span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fffbeb', color: '#d97706', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}><ShieldAlert size={14} /> Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button onClick={() => toggleVendorVerification(v.id, v.verified_status)} style={{ background: v.verified_status ? '#f3f4f6' : '#111', color: v.verified_status ? '#666' : 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                        {v.verified_status ? 'Revoke Status' : 'Verify Vendor'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
