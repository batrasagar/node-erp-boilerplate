import React from 'react';
import { useHistory } from 'react-router-dom';
import PublicLayout from './PublicLayout';

const FEATURE_SECTIONS = [
  {
    icon: '🏢', color: '#007AFF', bg: '#EFF6FF',
    title: 'Multi-Tenant Architecture',
    tagline: 'Complete isolation, unlimited organisations',
    desc: 'Every organisation gets its own isolated data space, custom branding, and domain. Run hundreds of tenants on a single platform with zero cross-contamination.',
    points: ['Full data isolation per tenant', 'Custom domains and branding', 'Plan-based feature limits', 'Trial periods with auto-expiry', 'Tenant status management (active, suspended, trial)'],
  },
  {
    icon: '🔐', color: '#5856D6', bg: '#F0EDFF',
    title: 'Role-Based Access Control',
    tagline: 'Granular permissions, zero trust',
    desc: 'Define exactly what each user can see and do. Create custom roles, assign granular permissions, and enforce access at the API level.',
    points: ['Custom roles per tenant', 'Module-level permission groups', 'Super admin vs regular admin', 'Permission caching for performance', 'Audit every permission change'],
  },
  {
    icon: '🏗️', color: '#FF9500', bg: '#FFF7ED',
    title: 'Organisational Structure',
    tagline: 'Model your business exactly as it operates',
    desc: 'Manage the full hierarchy of your business — from companies and branches down to departments and users — all within a single tenant.',
    points: ['Multi-company support', 'Branch management with HQ flag', 'Nested department hierarchies', 'User assignment to any org unit', 'Cross-branch visibility controls'],
  },
  {
    icon: '🔔', color: '#FF2D55', bg: '#FFF0F3',
    title: 'Multi-Channel Notifications',
    tagline: 'Reach users where they are',
    desc: 'Send notifications through in-app, push, email, and WhatsApp channels. Every notification is tracked, read-receipt aware, and filterable.',
    points: ['In-app notification centre', 'Firebase push notifications (FCM)', 'Transactional email via SMTP', 'WhatsApp Cloud API integration', 'Per-user notification preferences'],
  },
  {
    icon: '📋', color: '#34C759', bg: '#F0FFF4',
    title: 'Audit Logging',
    tagline: 'Full visibility into every action',
    desc: 'Every create, update, and delete is automatically logged with the user, timestamp, IP address, old values, and new values.',
    points: ['Automatic logging middleware', 'Old vs new value diffs', 'IP address and user agent capture', 'Filterable by resource, action, user', 'Export to CSV for compliance'],
  },
  {
    icon: '📱', color: '#AF52DE', bg: '#FDF4FF',
    title: 'Mobile-First with Capacitor',
    tagline: 'iOS and Android out of the box',
    desc: 'The entire platform is built as an Ionic/Capacitor app — ready to deploy to the App Store and Google Play with zero additional development.',
    points: ['Single codebase for web + mobile', 'Native push notification support', 'Biometric authentication ready', 'Offline-capable architecture', 'Native keyboard and haptics'],
  },
];

const FeaturesPage: React.FC = () => {
  const history = useHistory();
  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(150deg,#F0F7FF,#EEF2FF)', padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: -1 }}>
            Built for real business operations
          </h1>
          <p style={{ color: '#6C6C70', fontSize: 18, marginBottom: 36, lineHeight: 1.6 }}>
            Every feature in ERP Suite is designed to handle the complexity of running multi-tenant, multi-company businesses at scale.
          </p>
          <button onClick={() => history.push('/signup')} style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: 13, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
            Start for Free →
          </button>
        </div>
      </section>

      {/* Quick stats */}
      <section style={{ padding: '40px 24px', background: '#fff', borderBottom: '1px solid #F2F2F7' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 24, textAlign: 'center' }}>
          {[['15+', 'API Modules'], ['100+', 'API Endpoints'], ['6', 'Notification Channels'], ['3', 'Mobile Platforms']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg,#007AFF,#5856D6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
              <div style={{ color: '#6C6C70', fontSize: 14, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature sections */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 80 }}>
          {FEATURE_SECTIONS.map((f, i) => (
            <div key={f.title} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center', direction: i % 2 === 1 ? 'rtl' as any : 'ltr' }}>
              <div style={{ direction: 'ltr' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: f.bg, padding: '6px 14px', borderRadius: 100, marginBottom: 20 }}>
                  <span>{f.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.tagline}</span>
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 14px', letterSpacing: -0.5 }}>{f.title}</h2>
                <p style={{ color: '#6C6C70', fontSize: 16, lineHeight: 1.7, margin: '0 0 24px' }}>{f.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {f.points.map((p) => (
                    <li key={p} style={{ display: 'flex', gap: 10, fontSize: 15, color: '#3C3C43' }}>
                      <span style={{ color: f.color, fontWeight: 700, flexShrink: 0 }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ direction: 'ltr' }}>
                <div style={{ background: f.bg, borderRadius: 24, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260, border: `1.5px solid ${f.bg}` }}>
                  <span style={{ fontSize: 96 }}>{f.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: 'linear-gradient(135deg,#007AFF,#5856D6)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>Ready to experience it?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 32 }}>Start free, no credit card required.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => history.push('/signup')} style={{ background: '#fff', color: '#5856D6', border: 'none', padding: '14px 36px', borderRadius: 13, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
            Get Started Free →
          </button>
          <button onClick={() => history.push('/pricing')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', padding: '14px 28px', borderRadius: 13, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>
            See Pricing
          </button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default FeaturesPage;
