"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostReader({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams?.slug;

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          setBlog(null);
        }
      } catch (err) {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'Inter' }}>Loading Article...</div>;
  if (!blog) return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'Inter' }}><h3>Article Not Found</h3><p>The URL might be broken or the post was removed.</p></div>;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff', minHeight: '100vh' }}>
      
      {/* Header Image Cover */}
      {blog.imageUrl && (
        <div style={{ width: '100%', height: '400px', background: `url(${blog.imageUrl}) center/cover`, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))' }} />
        </div>
      )}

      {/* Article Container */}
      <div style={{ maxWidth: '800px', margin: blog.imageUrl ? '-100px auto 100px auto' : '60px auto', background: 'white', borderRadius: '24px', position: 'relative', zIndex: 10, padding: '40px' }}>
        
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#111', textDecoration: 'none', fontWeight: '800', fontSize: '14px', marginBottom: '24px', letterSpacing: '0.5px' }}>
          <ArrowLeft size={16} /> Back to Journal
        </Link>
        
        {/* Title Block */}
        <h1 style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0', color: '#111' }}>{blog.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#666', fontSize: '14px', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1.5px solid #eee' }}>
          <span>Written by <strong>TWC Editorial Team</strong></span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Content Body */}
        <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#333', whiteSpace: 'pre-wrap' }}>
          {blog.content}
        </div>

        {/* Share Block */}
        <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1.5px solid #eee', textAlign: 'center' }}>
          <p style={{ fontWeight: '800', fontSize: '18px', margin: '0 0 16px 0', color: '#111' }}>Share this guide</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button style={{ background: '#f8f9fa', border: 'none', width: '50px', height: '50px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
              <Facebook size={20} color="#1877F2" />
            </button>
            <button style={{ background: '#f8f9fa', border: 'none', width: '50px', height: '50px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Twitter size={20} color="#1DA1F2" />
            </button>
            <button style={{ background: '#f8f9fa', border: 'none', width: '50px', height: '50px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <LinkIcon size={20} color="#111" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
