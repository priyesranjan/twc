import Link from 'next/link';
import { Filter, Star, MapPin } from 'lucide-react';

export default function SearchPage() {
  const searchResults = [
    {
      id: 1,
      name: 'Elegance Photography',
      category: 'Photographer',
      price: '₹35,000 / day',
      rating: '4.9',
      location: 'Delhi NCR',
      img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      name: 'Glamour Bridal Makeup',
      category: 'Makeup Artist',
      price: '₹15,000 / event',
      rating: '4.7',
      location: 'Patna',
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      name: 'Classic Wedding Cars',
      category: 'Transport',
      price: '₹8,000 / day',
      rating: '4.5',
      location: 'Delhi NCR',
      img: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <main className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      {/* Top Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'var(--surface-color)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div className="smart-search" style={{ margin: 0, flex: 1, boxShadow: 'none', border: '1px solid #eee', padding: '8px 16px' }}>
          <input type="text" placeholder="Search Makeup in Patna..." defaultValue="Makeup artist in Patna" />
        </div>
        <button style={{ 
          background: 'none', 
          border: '1px solid #ddd', 
          padding: '8px', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Filter size={20} color="var(--primary-color)" />
        </button>
      </header>

      {/* Filter Chips */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '8px',
        padding: '12px 20px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <span style={{ padding: '6px 16px', background: 'var(--primary-color)', color: 'white', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: '500' }}>All</span>
        <span style={{ padding: '6px 16px', background: 'white', border: '1px solid #eee', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap' }}>Budget &lt; 20k</span>
        <span style={{ padding: '6px 16px', background: 'white', border: '1px solid #eee', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap' }}>Top Rated</span>
        <span style={{ padding: '6px 16px', background: 'white', border: '1px solid #eee', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap' }}>Patna</span>
      </div>

      {/* Search Results */}
      <div className="px-main" style={{ marginTop: '8px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>
          Found {searchResults.length} results
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {searchResults.map(result => (
            <Link href={`/venue/${result.id}`} key={result.id} style={{ display: 'flex', background: 'white', borderRadius: 'var(--border-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <img src={result.img} style={{ width: '120px', height: '120px', objectFit: 'cover' }} alt={result.name} />
              <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: '600' }}>{result.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#2ba83c', color: 'white', padding: '1px 4px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                      <Star size={8} fill="white" style={{marginRight: '2px'}} /> {result.rating}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '14px', marginTop: '4px', marginBottom: '2px', lineHeight: '1.2' }}>{result.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '11px', gap: '2px' }}>
                    <MapPin size={10} /> {result.location}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '13px' }}>
                  {result.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
