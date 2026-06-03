import React from 'react';
import { Switch, Route, Redirect, useRouteMatch, useLocation } from 'react-router-dom';
import PlanSelectPage from './PlanSelectPage';
import OrgDetailsPage from './OrgDetailsPage';
import AccountDetailsPage from './AccountDetailsPage';

const STEPS = [
  { path: 'plan', label: 'Choose Plan' },
  { path: 'org', label: 'Organisation' },
  { path: 'account', label: 'Your Account' },
];

const SignupLayout: React.FC = () => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const currentStep = STEPS.findIndex((s) => location.pathname.includes(s.path));

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: '#F2F2F7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5EA', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1C1C1E' }}>
          <div style={{ width: 32, height: 32, background: '#007AFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>E</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>ERP Suite</span>
        </a>
        <span style={{ color: '#8E8E93', margin: '0 8px' }}>·</span>
        <span style={{ color: '#6C6C70', fontSize: 15 }}>Create your account</span>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: 640, margin: '32px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.path}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600,
                  background: i < currentStep ? '#34C759' : i === currentStep ? '#007AFF' : '#E5E5EA',
                  color: i <= currentStep ? '#fff' : '#8E8E93',
                }}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === currentStep ? '#007AFF' : '#8E8E93', fontWeight: i === currentStep ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < currentStep ? '#34C759' : '#E5E5EA', margin: '0 8px 16px' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Switch>
          <Route exact path={`${path}/plan`} component={PlanSelectPage} />
          <Route exact path={`${path}/org`} component={OrgDetailsPage} />
          <Route exact path={`${path}/account`} component={AccountDetailsPage} />
          <Redirect from={path} to={`${path}/plan`} exact />
        </Switch>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#8E8E93', fontSize: 14 }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#007AFF', textDecoration: 'none', fontWeight: 500 }}>Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupLayout;
