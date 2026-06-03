import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { signupService } from '../../services/signup.service';
import { Plan } from '../../types';

const LandingPage: React.FC = () => {
  const history = useHistory();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) history.replace('/app/home');
  }, [isAuthenticated, history]);

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: signupService.getPlans,
  });

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#1C1C1E', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E5EA', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#007AFF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>E</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 18 }}>ERP Suite</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#features" style={{ color: '#6C6C70', textDecoration: 'none', padding: '8px 12px', fontSize: 15 }}>Features</a>
            <a href="#pricing" style={{ color: '#6C6C70', textDecoration: 'none', padding: '8px 12px', fontSize: 15 }}>Pricing</a>
            <button onClick={() => history.push('/login')} style={{ background: 'none', border: '1.5px solid #007AFF', color: '#007AFF', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 500 }}>Log In</button>
            <button onClick={() => history.push('/signup')} style={{ background: '#007AFF', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #F0F7FF 0%, #EEF2FF 100%)', padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: '#E8F1FF', color: '#007AFF', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            Multi-Tenant ERP Platform
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: -1 }}>
            Run your business<br />
            <span style={{ color: '#007AFF' }}>smarter, together</span>
          </h1>
          <p style={{ fontSize: 20, color: '#6C6C70', lineHeight: 1.6, margin: '0 auto 40px', maxWidth: 560 }}>
            One platform for companies, branches, departments, users, and more. Start free — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => history.push('/signup')} style={{ background: '#007AFF', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 12, fontSize: 17, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,122,255,0.35)' }}>
              Start for Free →
            </button>
            <button onClick={() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ background: '#fff', color: '#1C1C1E', border: '1.5px solid #E5E5EA', padding: '14px 28px', borderRadius: 12, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>
              See Plans
            </button>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: '#8E8E93' }}>Free forever on Starter • No credit card • Setup in 2 minutes</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Everything you need to run operations</h2>
          <p style={{ textAlign: 'center', color: '#6C6C70', fontSize: 17, marginBottom: 56 }}>Built for modern businesses — powerful, flexible, and easy to use.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ padding: 28, borderRadius: 16, border: '1.5px solid #F2F2F7', background: '#FAFAFA' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ color: '#6C6C70', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 24px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Simple, transparent pricing</h2>
          <p style={{ textAlign: 'center', color: '#6C6C70', fontSize: 17, marginBottom: 56 }}>Start free. Scale as you grow. No hidden fees.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24, alignItems: 'stretch' }}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSelect={() => history.push(`/signup?plan=${plan.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#007AFF', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Ready to get started?</h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>Join teams already running their operations on ERP Suite. Free forever on Starter.</p>
          <button onClick={() => history.push('/signup')} style={{ background: '#fff', color: '#007AFF', border: 'none', padding: '14px 36px', borderRadius: 12, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
            Create your free account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 24px', background: '#1C1C1E', textAlign: 'center' }}>
        <p style={{ color: '#8E8E93', fontSize: 14, margin: 0 }}>
          © {new Date().getFullYear()} ERP Suite. All rights reserved. &nbsp;·&nbsp;
          <button onClick={() => history.push('/login')} style={{ background: 'none', border: 'none', color: '#8E8E93', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>Log In</button>
        </p>
      </footer>
    </div>
  );
};

const PlanCard: React.FC<{ plan: Plan; onSelect: () => void }> = ({ plan, onSelect }) => (
  <div style={{
    background: plan.popular ? '#007AFF' : '#fff',
    color: plan.popular ? '#fff' : '#1C1C1E',
    borderRadius: 20,
    padding: 32,
    border: plan.popular ? 'none' : '1.5px solid #E5E5EA',
    boxShadow: plan.popular ? '0 12px 40px rgba(0,122,255,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  }}>
    {plan.popular && (
      <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#FF9500', color: '#fff', padding: '4px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
        Most Popular
      </div>
    )}
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>{plan.name}</h3>
      <p style={{ fontSize: 14, opacity: 0.75, margin: 0 }}>{plan.description}</p>
    </div>
    <div style={{ marginBottom: 24 }}>
      <span style={{ fontSize: 44, fontWeight: 800 }}>{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
      {plan.price > 0 && <span style={{ fontSize: 16, opacity: 0.7 }}>/mo</span>}
    </div>
    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1 }}>
      {plan.features.map((f) => (
        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 15 }}>
          <span style={{ color: plan.popular ? 'rgba(255,255,255,0.8)' : '#34C759', fontSize: 16 }}>✓</span> {f}
        </li>
      ))}
    </ul>
    <button
      onClick={onSelect}
      style={{
        background: plan.popular ? '#fff' : '#007AFF',
        color: plan.popular ? '#007AFF' : '#fff',
        border: 'none',
        padding: '13px 0',
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        width: '100%',
      }}
    >
      {plan.price === 0 ? 'Get Started Free' : `Start ${plan.name}`}
    </button>
  </div>
);

const FEATURES = [
  { icon: '🏢', title: 'Multi-Tenant', desc: 'Full tenant isolation with custom domains, branding, and plan-based limits per organisation.' },
  { icon: '🔐', title: 'Role-Based Access', desc: 'Granular RBAC with custom roles, permissions, and hierarchical organisational structure.' },
  { icon: '🏗️', title: 'Org Structure', desc: 'Manage companies, branches, and departments under one tenant with nested hierarchies.' },
  { icon: '🔔', title: 'Notifications', desc: 'In-app, push, email, and WhatsApp notification channels to keep your team informed.' },
  { icon: '📋', title: 'Audit Logs', desc: 'Detailed audit trail for every action — who did what, when, and from where.' },
  { icon: '📱', title: 'Mobile Ready', desc: 'Built with Capacitor for iOS and Android — your ERP goes wherever your team does.' },
];

export default LandingPage;
