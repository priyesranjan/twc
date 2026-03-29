"use client";
import React, { useState } from 'react';
import { PenTool, Image, AlertCircle, CheckCircle2, LayoutDashboard } from 'lucide-react';

export default function AdminCMS() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: ''
  });
  
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const handleSlugify = () => {
    const autoSlug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, slug: autoSlug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulating API POST to /api/admin/blog
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      setFormData({ title: '', slug: '', excerpt: '', content: '', imageUrl: '' });
    }, 1500);
  };

  return (
    <main className="animate-fade-in" style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: '30px' }}>
      
      {/* Admin Header */}
      <header style={{
        backgroundColor: '#1f2937', // Dark Slate for Admin feel
        padding: '24px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', margin: 0, fontWeight: '700' }}>Super Admin Portal</h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0 0' }}>SEO Content Management System</p>
        </div>
        <LayoutDashboard size={24} color="#fcd34d" />
      </header>

      {/* Editor Main Canvas */}
      <div className="px-main" style={{ marginTop: '24px' }}>
        
        {status === 'success' && (
          <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981', display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <CheckCircle2 color="#10b981" size={20} />
            <span style={{ color: '#065f46', fontSize: '14px', fontWeight: '600' }}>Blog successfully published to the live site!</span>
          </div>
        )}

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool size={18} color="var(--primary-color)" /> Compose New SEO Article
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Title Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Article Title (H1)</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                onBlur={handleSlugify} // Auto-generate slug on blur
                placeholder="e.g. Top 10 Banquet Halls in South Delhi"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
              />
            </div>

            {/* URL Slug Input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>SEO URL Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ background: '#f5f5f5', padding: '12px', color: 'var(--text-muted)', fontSize: '14px', borderRight: '1px solid #ddd' }}>theweddingschapter.com/blog/</span>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: 'none', fontSize: '15px', color: 'var(--primary-color)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Hero Image URL */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Hero Image URL</label>
              <div style={{ position: 'relative' }}>
                <Image size={18} color="#999" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="url" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/photo-..."
                  style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Short Meta Description (for Google)</label>
              <textarea 
                rows="2"
                maxLength="160"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Write a compelling 160-character summary to drive CTR..."
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
              />
              <span style={{ fontSize: '11px', color: formData.excerpt.length > 150 ? 'var(--primary-color)' : 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '4px' }}>
                {formData.excerpt.length} / 160
              </span>
            </div>

            {/* Full Content Markdown/HTML */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Article Body (Supports HTML)</label>
              <textarea 
                required
                rows="10"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="<h2>Why South Delhi?</h2><p>South Delhi features the most luxurious...</p>"
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'monospace', background: '#fafafa' }}
              />
            </div>

            {/* Action Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <AlertCircle size={14} /> Will replace homepage feeds instantly.
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="btn-primary" 
                style={{ padding: '12px 24px', fontSize: '15px', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', opacity: status === 'loading' ? 0.7 : 1 }}
              >
                {status === 'loading' ? 'Publishing...' : 'Publish to Production'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
