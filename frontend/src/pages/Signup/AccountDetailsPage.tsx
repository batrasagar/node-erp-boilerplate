import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useSignupStore } from '../../stores/signupStore';
import { useAuthStore } from '../../stores/authStore';
import { useTenantStore } from '../../stores/tenantStore';
import { signupService } from '../../services/signup.service';

const AccountDetailsPage: React.FC = () => {
  const history = useHistory();
  const { selectedPlan, orgName, orgSlug, setAccountDetails, reset } = useSignupStore();
  const { setAuth } = useAuthStore();
  const { setTenant } = useTenantStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (!selectedPlan || !orgSlug) history.replace('/signup/plan'); }, [selectedPlan, orgSlug, history]);

  const { mutate: doSignup, isPending } = useMutation({
    mutationFn: signupService.signup,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken, [], data.tenant.kycStatus as any);
      setTenant({ ...data.tenant, status: data.tenant.status as any, createdAt: new Date().toISOString() });
      reset();
      history.replace('/app/kyc');
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Signup failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName) { setError('First and last name are required'); return; }
    if (!email.includes('@')) { setError('Enter a valid email address'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setAccountDetails(firstName, lastName, email, password);
    doSignup({ plan: selectedPlan!, orgName, orgSlug, firstName, lastName, email, password });
  };

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>Create your account</h2>
      <p style={{ color: '#6C6C70', marginBottom: 28, fontSize: 16 }}>You'll be the admin of <strong>{orgName}</strong>.</p>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Work Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Confirm Password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" style={inputStyle} />
        </div>

        {error && <p style={{ color: '#FF3B30', fontSize: 14, marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" onClick={() => history.goBack()} style={{ flex: 1, background: '#F2F2F7', color: '#1C1C1E', border: 'none', padding: 14, borderRadius: 12, fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
            ← Back
          </button>
          <button type="submit" disabled={isPending} style={{ flex: 2, background: '#007AFF', color: '#fff', border: 'none', padding: 14, borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Creating account…' : 'Create Account →'}
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#8E8E93', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
};

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#3C3C43', display: 'block', marginBottom: 8 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E5E5EA', fontSize: 16, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA' };

export default AccountDetailsPage;
