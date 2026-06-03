import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { signupService } from '../../services/signup.service';
import { Plan } from '../../types';
import PublicLayout from './PublicLayout';
import { PlanCard } from './PricingPage';

const LandingPage: React.FC = () => {
  const history = useHistory();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => { if (isAuthenticated) history.replace('/app/home'); }, [isAuthenticated, history]);

  const { data: plans = [] } = useQuery<Plan[]>({ queryKey: ['plans'], queryFn: signupService.getPlans });

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(150deg,#F0F7FF 0%,#EEF2FF 60%,#F5F0FF 100%)', padding: '100px 24px 88px', textAlign: 'center' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#E8F1FF,#EDE8FF)', color: '#5856D6', padding: '6px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 28, border: '1px solid #D0C8FF' }}>
            🚀 Multi-Tenant ERP Platform
          </div>
          <h1 style={{ fontSize: 'clamp(38px,6vw,68px)', fontWeight: 800, lineHeight: 1.08, margin: '0 0 22px', letterSpacing: -1.5, color: '#0A0A0F' }}>
            Run your business<br />
            <span style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              smarter, together
            </span>
          </h1>
          <p style={{ fontSize: 20, color: '#6C6C70', lineHeight: 1.65, margin: '0 auto 44px', maxWidth: 560 }}>
            One platform for companies, branches, departments, users, and more. Start free — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => history.push('/signup')} style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', color: '#fff', border: 'none', padding: '15px 36px', borderRadius: 13, fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 24px rgba(88,86,214,0.35)' }}>
              Start for Free →
            </button>
            <button onClick={() => history.push('/pricing')} style={{ background: '#fff', color: '#1C1C1E', border: '1.5px solid #E5E5EA', padding: '15px 28px', borderRadius: 13, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>
              See Pricing
            </button>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            {['Free forever on Starter', 'No credit card', 'Setup in 2 min'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#6C6C70' }}>
                <span style={{ color: '#34C759', fontWeight: 700 }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F2F2F7', padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ color: '#8E8E93', fontSize: 14, margin: 0 }}>
          Trusted by teams building the next generation of businesses
        </p>
      </div>

      {/* Features grid */}
      <section id="features" style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: -0.5 }}>Everything you need to run operations</h2>
            <p style={{ color: '#6C6C70', fontSize: 17, margin: 0, maxWidth: 520, marginInline: 'auto' }}>Built for modern businesses — powerful, flexible, and mobile-ready.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ padding: 28, borderRadius: 18, border: '1.5px solid #F2F2F7', background: '#FAFAFA', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ color: '#6C6C70', fontSize: 15, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={() => history.push('/features')} style={{ background: 'none', border: '1.5px solid #007AFF', color: '#007AFF', padding: '11px 28px', borderRadius: 11, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Explore All Features →
            </button>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section style={{ padding: '88px 24px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: -0.5 }}>Simple, transparent pricing</h2>
            <p style={{ color: '#6C6C70', fontSize: 17, margin: 0 }}>Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 24, alignItems: 'stretch' }}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSelect={() => history.push(`/signup?plan=${plan.id}`)} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => history.push('/pricing')} style={{ background: 'none', border: 'none', color: '#007AFF', fontSize: 15, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
              Compare all plan features →
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: -0.5 }}>Up and running in minutes</h2>
          <p style={{ color: '#6C6C70', fontSize: 17, marginBottom: 56 }}>No IT team required. No complex setup.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
            {STEPS.map((s, i) => (
              <div key={s.title}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#007AFF,#5856D6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, margin: '0 auto 16px' }}>{i + 1}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{s.title}</h4>
                <p style={{ color: '#6C6C70', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '88px 24px', background: 'linear-gradient(135deg,#007AFF,#5856D6)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Ready to get started?</h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.82)', marginBottom: 36, lineHeight: 1.6 }}>Join teams already running their operations on ERP Suite. Free forever on Starter.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => history.push('/signup')} style={{ background: '#fff', color: '#007AFF', border: 'none', padding: '14px 36px', borderRadius: 13, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
              Create your free account →
            </button>
            <button onClick={() => history.push('/contact')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', padding: '14px 28px', borderRadius: 13, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

const FEATURES = [
  { icon: '🏢', bg: '#EFF6FF', title: 'Multi-Tenant Architecture', desc: 'Full tenant isolation with custom domains, branding, and plan-based limits per organisation.' },
  { icon: '🔐', bg: '#F0FFF4', title: 'Role-Based Access Control', desc: 'Granular RBAC with custom roles, permissions, and hierarchical organisational structure.' },
  { icon: '🏗️', bg: '#FFF7ED', title: 'Org Structure Management', desc: 'Manage companies, branches, and departments under one tenant with nested hierarchies.' },
  { icon: '🔔', bg: '#FDF4FF', title: 'Multi-Channel Notifications', desc: 'In-app, push, email, and WhatsApp notification channels to keep your team in the loop.' },
  { icon: '📋', bg: '#F0F9FF', title: 'Comprehensive Audit Logs', desc: 'Detailed audit trail for every action — who did what, when, and from where.' },
  { icon: '📱', bg: '#FFF1F2', title: 'Mobile-First Design', desc: 'Built with Capacitor for iOS and Android — your ERP goes wherever your team does.' },
];

const STEPS = [
  { title: 'Choose your plan', desc: 'Pick the plan that fits your team. Start free with Starter.' },
  { title: 'Create your account', desc: 'Sign up in under 2 minutes. No credit card needed.' },
  { title: 'Verify your business', desc: 'Complete a quick KYC check to unlock full access.' },
  { title: 'Invite your team', desc: 'Add users, assign roles, and start collaborating.' },
];

export default LandingPage;
