"use client";
import React, { useState } from 'react';
import { X, Calendar, CheckSquare, Users, Wallet, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SHUBH_MUHURAT_DATES = [
  "Nov 16, 2026 (Hot Lagn)",
  "Nov 22, 2026 (Shubh Muhurat)",
  "Dec 4, 2026 (Shubh Muhurat)",
  "Feb 14, 2027 (Hot Lagn)",
  "Date Not Fixed Yet"
];

const SERVICES = [
  "Photography & Videography",
  "Catering (Fooding)",
  "Brass Band & Baraat",
  "Mehndi Artist",
  "Decoration",
  "Hotel / Banquet"
];

export default function LeadCaptureWizard({ isOpen, onClose, onSubmit, title }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("COMPLETE"); // COMPLETE or CUSTOM
  const [selectedServices, setSelectedServices] = useState([]);
  const [guests, setGuests] = useState("200-500");
  const [budget, setBudget] = useState("₹10L - ₹20L");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, openOtpModal } = useAuth();
  const isAuthenticated = user?.authenticated;

  React.useEffect(() => {
    if (isOpen) {
      setStep(1); setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleService = (s) => {
    if (selectedServices.includes(s)) {
      setSelectedServices(selectedServices.filter(item => item !== s));
    } else {
      setSelectedServices([...selectedServices, s]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !date) return alert("Please select a date");
    if (step === 2 && packageType === 'CUSTOM' && selectedServices.length === 0) return alert("Please select at least one service.");
    setStep(step + 1);
  };

  const handleFinalSubmit = async () => {
    if (!isAuthenticated) {
      onClose();
      return openOtpModal();
    }
    
    setIsSubmitting(true);
    const finalDetails = {
      date,
      packageType,
      services: packageType === "COMPLETE" ? ["All inclusive TWC Package"] : selectedServices,
      guests,
      budget
    };

    let msg = `Customer is looking for ${packageType === "COMPLETE" ? "a Complete Event Package" : "Custom Services"}.\n`;
    msg += `Date: ${date}\n`;
    msg += `Guests: ${guests}\n`;
    msg += `Budget: ${budget}\n`;
    msg += `Services: ${packageType === "COMPLETE" ? "All Selected" : selectedServices.join(", ")}\n`;

    await onSubmit({ message: msg, eventDetails: finalDetails });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
        }} 
      />
      
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '32px',
        zIndex: 9999,
        width: '90%',
        maxWidth: '520px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: '#f5f5f5', borderRadius: '50%', width:'32px', height:'32px', display:'flex', justifyContent:'center', alignItems:'center', cursor: 'pointer', color: '#666' }}>
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111', margin: '0 0 8px 0' }}>Plan Your {title || 'Event'}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: '40px', height: '4px', borderRadius: '4px', background: step >= i ? 'var(--primary-color)' : '#eee' }} />
            ))}
          </div>
        </div>

        {/* Step 1: Date */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--primary-color)" /> Hindu Calendar (Shubh Muhurat)
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Select an auspicious date for your event:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SHUBH_MUHURAT_DATES.map((d, i) => {
                const isHot = d.includes("Hot Lagn");
                return (
                  <label key={i} style={{ 
                    border: date === d ? '2px solid var(--primary-color)' : '1.5px solid #eee', 
                    background: date === d ? '#fffafb' : 'white',
                    padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    <input type="radio" name="date" checked={date === d} onChange={() => setDate(d)} style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }} />
                    <span style={{ fontSize: '15px', fontWeight: '600', flex: 1 }}>{d}</span>
                    {isHot && <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '50px', fontWeight: 'bold' }}>🔥 Books Fast</span>}
                  </label>
                )
              })}
            </div>
            <button onClick={handleNext} className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '16px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={20} color="var(--primary-color)" /> What do you need?
            </h3>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => setPackageType('COMPLETE')} style={{ flex: 1, padding: '16px 12px', borderRadius: '12px', border: packageType === 'COMPLETE' ? '2px solid var(--primary-color)' : '1.5px solid #eee', background: packageType === 'COMPLETE' ? '#fffafb' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ margin: '0 0 8px 0', display: 'flex', justifyContent: 'center' }}><ShieldCheck size={24} color={packageType === 'COMPLETE' ? 'var(--primary-color)' : '#999'} /></div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>Complete Event</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>TWC handles everything</div>
              </button>
              <button onClick={() => setPackageType('CUSTOM')} style={{ flex: 1, padding: '16px 12px', borderRadius: '12px', border: packageType === 'CUSTOM' ? '2px solid var(--primary-color)' : '1.5px solid #eee', background: packageType === 'CUSTOM' ? '#fffafb' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ margin: '0 0 8px 0', display: 'flex', justifyContent: 'center' }}><CheckSquare size={24} color={packageType === 'CUSTOM' ? 'var(--primary-color)' : '#999'} /></div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>Custom Services</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>I need specific vendors</div>
              </button>
            </div>

            {packageType === 'CUSTOM' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                {SERVICES.map((s, i) => (
                  <label key={i} style={{ border: selectedServices.includes(s) ? '2px solid var(--primary-color)' : '1px solid #ddd', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    <input type="checkbox" checked={selectedServices.includes(s)} onChange={() => toggleService(s)} style={{ accentColor: 'var(--primary-color)' }} /> {s}
                  </label>
                ))}
              </div>
            )}

            <button onClick={handleNext} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              Continue <ArrowRight size={18} />
            </button>
            <button onClick={() => setStep(step - 1)} style={{ width: '100%', padding: '12px', border: 'none', background: 'transparent', color: '#666', fontWeight: '600', marginTop: '8px', cursor: 'pointer' }}>Back</button>
          </div>
        )}

        {/* Step 3: Capacity & Budget */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="var(--primary-color)" /> Event Size & Budget
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Expected Guest Count</p>
              <select value={guests} onChange={(e) => setGuests(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #eee', fontSize: '15px', outline: 'none' }}>
                <option value="Under 100">Under 100 Guests</option>
                <option value="100-200">100 - 200 Guests</option>
                <option value="200-500">200 - 500 Guests</option>
                <option value="500-1000">500 - 1000 Guests</option>
                <option value="1000+">1000+ Guests</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Overall Budget Estimate</p>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #eee', fontSize: '15px', outline: 'none' }}>
                <option value="Under ₹5 Lakh">Under ₹5 Lakh</option>
                <option value="₹5L - ₹10L">₹5 Lakh - ₹10 Lakh</option>
                <option value="₹10L - ₹20L">₹10 Lakh - ₹20 Lakh</option>
                <option value="₹20L+">Above ₹20 Lakh</option>
              </select>
            </div>

            <button disabled={isSubmitting} onClick={handleFinalSubmit} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isSubmitting ? 'Sending...' : (isAuthenticated ? 'Confirm & Get Quote' : 'Login to Get Quote')}
            </button>
            <button onClick={() => setStep(step - 1)} style={{ width: '100%', padding: '12px', border: 'none', background: 'transparent', color: '#666', fontWeight: '600', marginTop: '8px', cursor: 'pointer' }}>Back</button>
          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </>
  );
}
