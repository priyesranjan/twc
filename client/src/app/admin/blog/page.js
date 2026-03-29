"use client";
import React, { useState } from 'react';
import { PenSquare, Image as ImageIcon, Link as LinkIcon, Save, Type, CheckCircle } from 'lucide-react';

export default function AdminBlogWriter() {
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', imageUrl: ''
  });
  const [status, setStatus] = useState(null);

  const handleSlugify = () => {
    if (formData.title) {
      setFormData({ 
        ...formData, 
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
      });
    }
  };

  const publishArticle = async (e) => {
    e.preventDefault();
    setStatus('publishing');
    try {
      const token = localStorage.getItem('jwt_token') || 'admin-dev';
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) setStatus('success');
      else {
        const d = await res.json();
        alert('Failed: ' + d.message);
        setStatus(null);
      }
    } catch (e) {
      alert("Error publishing blog.");
      setStatus(null);
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <CheckCircle color="#10b981" size={60} style={{ margin: '0 auto 20px auto' }} />
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Article Published Successfully!</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>It is now live on the public SEO directory.</p>
        <button onClick={() => { setStatus(null); setFormData({ title:'',slug:'',excerpt:'',content:'',imageUrl:'' }); }} style={{ background: '#111', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Write Another Article</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ background: '#111', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenSquare color="#3b82f6" /> TWC Publishing CMS
          </h1>
          <p style={{ color: '#aaa', fontSize: '13px', margin: '4px 0 0 32px' }}>Write SEO Articles for Google Rankings</p>
        </div>
        <button onClick={publishArticle} disabled={status === 'publishing'} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: status === 'publishing' ? 'not-allowed' : 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {status === 'publishing' ? 'Saving...' : 'Publish to Live Web'}
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Title */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#111' }}><Type size={14} /> Headline</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                onBlur={handleSlugify}
                placeholder="e.g., Top 10 Best Marriage Halls in Motihari (2026)"
                style={{ width: '100%', padding: '16px', fontSize: '20px', fontWeight: '800', border: 'none', background: '#f8f9fa', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* Slug */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#111' }}><LinkIcon size={14} /> SEO URL Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', borderRadius: '8px', padding: '12px 16px' }}>
                <span style={{ color: '#888', marginRight: '4px' }}>theweddingschapter.com/blog/</span>
                <input 
                  type="text" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  placeholder="top-10-marriage-halls-motihari"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontWeight: '600', color: '#111' }}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#111' }}>Short Description (For Google Search Results)</label>
              <textarea 
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Write a 2 sentence summary describing the article to attract readers on Google..."
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1.5px solid #eee', outline: 'none', minHeight: '80px', fontFamily: 'Inter', resize: 'vertical' }}
              />
            </div>

            {/* Image */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#111' }}><ImageIcon size={14} /> Cover Image URL</label>
              <input 
                type="text" 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                placeholder="https://images.unsplash.com/photo-example"
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #eee', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* Main Content */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#111' }}>Article Body (Supports raw HTML / formatting)</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Start writing your blog post here. You can mention various Hotels, Pricing, or advice for couples."
                style={{ width: '100%', padding: '24px', borderRadius: '8px', border: '1.5px solid #eee', outline: 'none', minHeight: '400px', fontSize: '16px', lineHeight: '1.6', fontFamily: 'Inter', resize: 'vertical' }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
