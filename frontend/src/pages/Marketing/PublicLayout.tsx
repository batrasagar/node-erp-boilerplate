import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Features', path: '/features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
];

export const PublicNavbar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #E5E5EA', padding: '0 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <button onClick={() => history.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#007AFF,#5856D6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#1C1C1E' }}>ERP Suite</span>
        </button>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
          {NAV_LINKS.map((l) => (
            <button key={l.path} onClick={() => history.push(l.path)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 8,
              fontSize: 15, fontWeight: 500,
              color: location.pathname === l.path ? '#007AFF' : '#3C3C43',
              backgroundColor: location.pathname === l.path ? '#F0F7FF' : 'transparent',
            }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => history.push('/login')} style={{ background: 'none', border: '1.5px solid #E5E5EA', color: '#3C3C43', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 500 }}>
            Log In
          </button>
          <button onClick={() => history.push('/signup')} style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
            Get Started Free
          </button>
        </div>
      </div>
    </nav>
  );
};

export const PublicFooter: React.FC = () => {
  const history = useHistory();
  return (
    <footer style={{ background: '#111', color: '#A1A1AA', padding: '56px 24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#007AFF,#5856D6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>E</span>
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>ERP Suite</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, maxWidth: 220 }}>
              Multi-tenant ERP platform for modern businesses. Built for scale.
            </p>
          </div>
          {/* Product */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Product</h4>
            {[['Features', '/features'], ['Pricing', '/pricing'], ['Changelog', '#']].map(([l, p]) => (
              <button key={l} onClick={() => p !== '#' && history.push(p)} style={{ display: 'block', background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', fontSize: 14, padding: '4px 0', textAlign: 'left' }}>{l}</button>
            ))}
          </div>
          {/* Company */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Company</h4>
            {[['About', '#'], ['Contact', '/contact'], ['Privacy Policy', '#'], ['Terms of Service', '#']].map(([l, p]) => (
              <button key={l} onClick={() => p !== '#' && history.push(p)} style={{ display: 'block', background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', fontSize: 14, padding: '4px 0', textAlign: 'left' }}>{l}</button>
            ))}
          </div>
          {/* Support */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Support</h4>
            <p style={{ fontSize: 14, margin: '0 0 8px' }}>📧 hello@erpsuite.io</p>
            <p style={{ fontSize: 14, margin: '0 0 8px' }}>💬 Live chat available</p>
            <p style={{ fontSize: 14, margin: 0 }}>Mon–Fri, 9am–6pm UTC</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #27272A', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13 }}>© {new Date().getFullYear()} ERP Suite. All rights reserved.</span>
          <span style={{ fontSize: 13 }}>Built with ❤️ for modern businesses</span>
        </div>
      </div>
    </footer>
  );
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#1C1C1E', overflowX: 'hidden', overflowY: 'auto', height: '100%', position: 'absolute', inset: 0 }}>
    <PublicNavbar />
    {children}
    <PublicFooter />
  </div>
);

export default PublicLayout;
