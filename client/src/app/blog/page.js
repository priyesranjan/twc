"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function BlogHub() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        setBlogs(data);
      } catch (e) {
        console.error("Failed fetching blogs");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Mini Nav */}
      <nav style={{ padding: '24px 40px', background: 'white', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#d11243', margin: 0 }}>The Weddings Chapter <span style={{ color: '#111', fontWeight: '400' }}>| Journal</span></h1>
      </nav>

      {/* Header */}
      <header style={{ padding: '80px 20px', textAlign: 'center', background: '#111', color: 'white' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 16px 0' }}>Wedding Planning Secrets</h1>
        <p style={{ fontSize: '18px', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>Discover the top venues, caterers, and insider tips for organizing the perfect wedding in Motihari.</p>
      </header>

      {/* Blog Grid */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Loading the journal...</div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '16px' }}>
            <BookOpen size={48} color="#ddd" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '24px', color: '#111', margin: '0 0 8px 0' }}>No articles published yet</h2>
            <p style={{ color: '#666' }}>Our team is working on the first exclusive wedding guide for Motihari.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {blogs.map(blog => (
              <div key={blog.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                {/* Image */}
                <div style={{ height: '200px', background: blog.imageUrl ? `url(${blog.imageUrl}) center/cover` : '#eee' }}></div>
                
                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#d11243', marginBottom: '12px', textTransform: 'uppercase' }}>Wedding Guide</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 12px 0', lineHeight: '1.4', color: '#111' }}>{blog.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>{blog.excerpt || blog.content.substring(0, 100) + '...'}</p>
                  
                  <Link href={`/blog/${blog.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#111', fontWeight: '800', textDecoration: 'none', fontSize: '14px' }}>
                    Read Article <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
