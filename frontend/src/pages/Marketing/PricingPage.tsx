import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { signupService } from '../../services/signup.service';
import { Plan } from '../../types';
import PublicLayout from './PublicLayout';

/* ─── Exported plan card (reused in LandingPage) ─── */
export const PlanCard: React.FC<{ plan: Plan; onSelect: () => void; annually?: boolean }> = ({ plan, onSelect, annually = false }) => {
  const price = annually && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price;
  return (
    <div style={{
      background: plan.popular ? 'linear-gradient(145deg,#007AFF,#5856D6)' : '#fff',
      color: plan.popular ? '#fff' : '#1C1C1E',
      borderRadius: 22, padding: 32,
      border: plan.popular ? 'none' : '1.5px solid #E5E5EA',
      boxShadow: plan.popular ? '0 16px 48px rgba(88,86,214,0.32)' : '0 2px 16px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {plan.popular && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#FF9500', color: '#fff', padding: '5px 18px', borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(255,149,0,0.4)' }}>
          ⭐ Most Popular
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>{plan.name}</h3>
        <p style={{ fontSize: 14, opacity: 0.75, margin: 0, lineHeight: 1.5 }}>{plan.description}</p>
      </div>
      <div style={{ marginBottom: 26 }}>
        <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1 }}>{price === 0 ? 'Free' : `$${price}`}</span>
        {price > 0 && <span style={{ fontSize: 15, opacity: 0.65 }}>/mo{annually ? ' · billed yearly' : ''}</span>}
        {annually && plan.price > 0 && <div style={{ fontSize: 12, marginTop: 4, opacity: 0.75 }}>Save 20% vs monthly</div>}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, lineHeight: 1.4 }}>
            <span style={{ color: plan.popular ? 'rgba(255,255,255,0.75)' : '#34C759', fontSize: 16, marginTop: 1, flexShrink: 0 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <button onClick={onSelect} style={{
        background: plan.popular ? '#fff' : 'linear-gradient(135deg,#007AFF,#5856D6)',
        color: plan.popular ? '#5856D6' : '#fff',
        border: 'none', padding: '13px 0', borderRadius: 13, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%',
      }}>
        {plan.price === 0 ? 'Get Started Free' : `Start ${plan.name}`}
      </button>
    </div>
  );
};

/* ─── Comparison table data ─── */
const COMPARISON: { category: string; rows: { feature: string; starter: string | boolean; professional: string | boolean; enterprise: string | boolean }[] }[] = [
  {
    category: 'Organisations',
    rows: [
      { feature: 'Companies', starter: '1', professional: '5', enterprise: 'Unlimited' },
      { feature: 'Branches', starter: '2', professional: '20', enterprise: 'Unlimited' },
      { feature: 'Departments', starter: '5', professional: 'Unlimited', enterprise: 'Unlimited' },
      { feature: 'Users', starter: '5', professional: '50', enterprise: 'Unlimited' },
    ],
  },
  {
    category: 'Access Control',
    rows: [
      { feature: 'Role-Based Access (RBAC)', starter: true, professional: true, enterprise: true },
      { feature: 'Custom Roles', starter: false, professional: true, enterprise: true },
      { feature: 'Permission Groups', starter: false, professional: true, enterprise: true },
      { feature: 'Audit Logs', starter: true, professional: true, enterprise: true },
    ],
  },
  {
    category: 'Notifications',
    rows: [
      { feature: 'In-App Notifications', starter: true, professional: true, enterprise: true },
      { feature: 'Push Notifications', starter: false, professional: true, enterprise: true },
      { feature: 'Email Notifications', starter: false, professional: true, enterprise: true },
      { feature: 'WhatsApp Integration', starter: false, professional: false, enterprise: true },
    ],
  },
  {
    category: 'Platform',
    rows: [
      { feature: 'File Uploads', starter: false, professional: true, enterprise: true },
      { feature: 'API Access', starter: false, professional: false, enterprise: true },
      { feature: 'Mobile App (iOS & Android)', starter: true, professional: true, enterprise: true },
      { feature: 'Custom Domain', starter: false, professional: true, enterprise: true },
    ],
  },
  {
    category: 'Support',
    rows: [
      { feature: 'Community Support', starter: true, professional: true, enterprise: true },
      { feature: 'Email Support', starter: false, professional: true, enterprise: true },
      { feature: 'Priority Support', starter: false, professional: false, enterprise: true },
      { feature: 'Dedicated Account Manager', starter: false, professional: false, enterprise: true },
    ],
  },
];

const Cell: React.FC<{ value: string | boolean; highlight?: boolean }> = ({ value, highlight }) => (
  <td style={{ padding: '14px 20px', textAlign: 'center', background: highlight ? '#F8F4FF' : 'transparent', fontSize: 14, borderBottom: '1px solid #F2F2F7' }}>
    {typeof value === 'boolean'
      ? <span style={{ fontSize: 18, color: value ? '#34C759' : '#D1D1D6' }}>{value ? '✓' : '✕'}</span>
      : <span style={{ fontWeight: 500 }}>{value}</span>}
  </td>
);

/* ─── FAQ ─── */
const FAQS = [
  { q: 'Can I change my plan later?', a: 'Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.' },
  { q: 'Is there a free trial for paid plans?', a: 'All new accounts start with a 14-day trial on the Professional plan. No credit card required to start.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards, as well as bank transfers for Enterprise plans.' },
  { q: 'What happens when I exceed plan limits?', a: 'You will be notified and prompted to upgrade. We never delete your data — the platform simply restricts new additions until you upgrade.' },
  { q: 'Do you offer discounts for nonprofits?', a: 'Yes! NGOs and non-profits are eligible for a 50% discount on any paid plan. Contact us to apply.' },
];

const PricingPage: React.FC = () => {
  const history = useHistory();
  const [annually, setAnnually] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: plans = [] } = useQuery<Plan[]>({ queryKey: ['plans'], queryFn: signupService.getPlans });

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(150deg,#F0F7FF,#EEF2FF)', padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: -1 }}>Simple, transparent pricing</h1>
          <p style={{ color: '#6C6C70', fontSize: 18, marginBottom: 36 }}>Start free. Upgrade as your team grows. No surprises.</p>
          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', padding: '6px 8px', borderRadius: 12, border: '1.5px solid #E5E5EA' }}>
            <button onClick={() => setAnnually(false)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: !annually ? '#007AFF' : 'transparent', color: !annually ? '#fff' : '#6C6C70', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Monthly</button>
            <button onClick={() => setAnnually(true)} style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: annually ? '#007AFF' : 'transparent', color: annually ? '#fff' : '#6C6C70', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Annual <span style={{ background: '#34C759', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, marginLeft: 4 }}>−20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ padding: '64px 24px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 24, alignItems: 'stretch' }}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} annually={annually} onSelect={() => history.push(`/signup?plan=${plan.id}`)} />
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, margin: '0 0 8px', letterSpacing: -0.5 }}>Compare all features</h2>
          <p style={{ textAlign: 'center', color: '#6C6C70', marginBottom: 40, fontSize: 16 }}>Everything in one place so you can choose with confidence.</p>
          <div style={{ overflowX: 'auto', borderRadius: 16, border: '1.5px solid #E5E5EA', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#F9F9F9' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #E5E5EA' }}>Feature</th>
                  {['Starter', 'Professional', 'Enterprise'].map((h, i) => (
                    <th key={h} style={{ padding: '16px 20px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: i === 1 ? '#5856D6' : '#1C1C1E', background: i === 1 ? '#F8F4FF' : 'transparent', borderBottom: '2px solid #E5E5EA' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((cat) => (
                  <React.Fragment key={cat.category}>
                    <tr>
                      <td colSpan={4} style={{ padding: '14px 20px', fontSize: 12, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.6, background: '#F9F9F9', borderBottom: '1px solid #F2F2F7' }}>
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((row) => (
                      <tr key={row.feature}>
                        <td style={{ padding: '14px 20px', fontSize: 14, color: '#3C3C43', borderBottom: '1px solid #F2F2F7' }}>{row.feature}</td>
                        <Cell value={row.starter} />
                        <Cell value={row.professional} highlight />
                        <Cell value={row.enterprise} />
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, margin: '0 0 8px', letterSpacing: -0.5 }}>Frequently asked questions</h2>
          <p style={{ textAlign: 'center', color: '#6C6C70', marginBottom: 44, fontSize: 16 }}>Can't find your answer? <button onClick={() => history.push('/contact')} style={{ background: 'none', border: 'none', color: '#007AFF', cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>Contact us →</button></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E5E5EA', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1E' }}>{faq.q}</span>
                  <span style={{ fontSize: 20, color: '#8E8E93', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && <div style={{ padding: '0 22px 18px', color: '#6C6C70', fontSize: 15, lineHeight: 1.65 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: 'linear-gradient(135deg,#007AFF,#5856D6)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>Start building today</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 32 }}>Free forever on Starter. No credit card required.</p>
        <button onClick={() => history.push('/signup')} style={{ background: '#fff', color: '#5856D6', border: 'none', padding: '14px 36px', borderRadius: 13, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
          Get Started Free →
        </button>
      </section>
    </PublicLayout>
  );
};

export default PricingPage;
