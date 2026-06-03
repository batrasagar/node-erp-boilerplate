import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { signupService } from '../../services/signup.service';
import { useSignupStore } from '../../stores/signupStore';
import { Plan, PlanId } from '../../types';

const PlanSelectPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { selectedPlan, setPlan } = useSignupStore();
  const { data: plans = [], isLoading } = useQuery<Plan[]>({ queryKey: ['plans'], queryFn: signupService.getPlans });

  const preselected = new URLSearchParams(location.search).get('plan') as PlanId | null;

  React.useEffect(() => {
    if (preselected && !selectedPlan) setPlan(preselected);
  }, [preselected, selectedPlan, setPlan]);

  const handleSelect = (planId: PlanId) => {
    setPlan(planId);
    history.push('/signup/org');
  };

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: 48, color: '#8E8E93' }}>Loading plans…</div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>Choose your plan</h2>
      <p style={{ color: '#6C6C70', marginBottom: 28, fontSize: 16 }}>Start free, upgrade anytime. No credit card required for Starter.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handleSelect(plan.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
              padding: '20px 24px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
              border: `2px solid ${selectedPlan === plan.id ? '#007AFF' : '#E5E5EA'}`,
              background: selectedPlan === plan.id ? '#F0F7FF' : '#fff',
              boxShadow: selectedPlan === plan.id ? '0 0 0 4px rgba(0,122,255,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 17, fontWeight: 700 }}>{plan.name}</span>
                {plan.popular && (
                  <span style={{ background: '#FF9500', color: '#fff', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>Popular</span>
                )}
              </div>
              <p style={{ color: '#6C6C70', fontSize: 14, margin: '0 0 10px' }}>{plan.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {plan.features.slice(0, 3).map((f) => (
                  <span key={f} style={{ background: '#F2F2F7', color: '#3C3C43', padding: '3px 10px', borderRadius: 100, fontSize: 12 }}>{f}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#007AFF' }}>
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
              </div>
              {plan.price > 0 && <div style={{ fontSize: 13, color: '#8E8E93' }}>/month</div>}
            </div>
          </button>
        ))}
      </div>
      {selectedPlan && (
        <button
          onClick={() => history.push('/signup/org')}
          style={{ width: '100%', marginTop: 24, background: '#007AFF', color: '#fff', border: 'none', padding: '14px 0', borderRadius: 12, fontSize: 17, fontWeight: 600, cursor: 'pointer' }}
        >
          Continue with {plans.find((p) => p.id === selectedPlan)?.name} →
        </button>
      )}
    </div>
  );
};

export default PlanSelectPage;
