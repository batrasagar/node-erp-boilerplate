import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PublicLayout from './PublicLayout';

const SUBJECTS = [
  'General Enquiry',
  'Sales & Pricing',
  'Technical Support',
  'Partnership',
  'Billing',
  'Other',
];

const ContactPage: React.FC = () => {
  const history = useHistory();
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission — wire to a real email service or backend endpoint as needed
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(150deg,#F0F7FF,#EEF2FF)', padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: -1 }}>Get in touch</h1>
          <p style={{ color: '#6C6C70', fontSize: 18, margin: 0, lineHeight: 1.6 }}>
            Have a question or need help choosing a plan? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 56 }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>Contact information</h2>
            <p style={{ color: '#6C6C70', fontSize: 16, lineHeight: 1.65, marginBottom: 36 }}>
              Our team is available Monday to Friday, 9am–6pm UTC. We typically respond within a few hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
              {CONTACT_METHODS.map((c) => (
                <div key={c.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, background: c.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 15, color: '#1C1C1E', fontWeight: 500 }}>{c.value}</div>
                    {c.sub && <div style={{ fontSize: 13, color: '#8E8E93' }}>{c.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ background: '#F9F9F9', borderRadius: 16, padding: 24 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Looking for something specific?</h4>
              {[['View pricing plans', '/pricing'], ['Explore all features', '/features'], ['Create a free account', '/signup']].map(([label, path]) => (
                <button key={label} onClick={() => history.push(path)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#007AFF', fontSize: 15, fontWeight: 500, cursor: 'pointer', padding: '6px 0' }}>
                  → {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div>
            {submitted ? (
              <div style={{ background: '#F0FFF4', border: '1.5px solid #BBF7D0', borderRadius: 20, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', color: '#166534' }}>Message sent!</h3>
                <p style={{ color: '#15803D', fontSize: 16, lineHeight: 1.6, margin: '0 0 28px' }}>
                  Thanks for reaching out, <strong>{form.name}</strong>. We'll get back to you at <strong>{form.email}</strong> within 1 business day.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', subject: '', message: '' }); }} style={{ background: '#007AFF', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 11, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1.5px solid #F2F2F7' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 24px' }}>Send us a message</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Work Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@company.com" style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Company</label>
                  <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme Corp (optional)" style={inputStyle} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Subject *</label>
                  <select required value={form.subject} onChange={(e) => set('subject', e.target.value)} style={inputStyle}>
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Message *</label>
                  <textarea required value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us how we can help…" rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>
                <button type="submit" disabled={submitting} style={{ width: '100%', background: 'linear-gradient(135deg,#007AFF,#5856D6)', color: '#fff', border: 'none', padding: '14px 0', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.75 : 1 }}>
                  {submitting ? 'Sending…' : 'Send Message →'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#8E8E93', marginTop: 14 }}>
                  We typically respond within 1 business day.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Office / map placeholder */}
      <section style={{ padding: '0 24px 72px', background: '#fff' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1.5px solid #E5E5EA', background: 'linear-gradient(135deg,#F0F7FF,#EEF2FF)', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 48 }}>🌍</span>
            <p style={{ color: '#6C6C70', fontSize: 16, margin: 0, fontWeight: 500 }}>Remote-first team · Serving businesses worldwide</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

const CONTACT_METHODS = [
  { icon: '📧', bg: '#EFF6FF', label: 'Email', value: 'hello@erpsuite.io', sub: 'General enquiries & support' },
  { icon: '💬', bg: '#F0FFF4', label: 'Live Chat', value: 'Available on this page', sub: 'Mon–Fri, 9am–6pm UTC' },
  { icon: '📞', bg: '#FFF7ED', label: 'Sales', value: '+1 (800) 123-4567', sub: 'Enterprise & partnership enquiries' },
  { icon: '🐦', bg: '#FDF4FF', label: 'Twitter / X', value: '@erpsuite', sub: 'Quick questions & updates' },
];

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#3C3C43', display: 'block', marginBottom: 7 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E5EA', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA', fontFamily: 'inherit' };

export default ContactPage;
