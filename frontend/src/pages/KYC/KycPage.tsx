import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { kycService, KycFormData } from '../../services/kyc.service';
import { useAuthStore } from '../../stores/authStore';

const BUSINESS_TYPES = [
  { value: 'sole_proprietor', label: 'Sole Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llc', label: 'LLC' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'ngo', label: 'NGO / Non-Profit' },
  { value: 'other', label: 'Other' },
];

const KycPage: React.FC = () => {
  const history = useHistory();
  const { setKycStatus, kycStatus } = useAuthStore();
  const [form, setForm] = useState<KycFormData>({
    businessName: '', businessType: '', address: '', city: '',
    country: '', phone: '', state: '', postalCode: '', registrationNumber: '', taxNumber: '', website: '',
  });
  const [error, setError] = useState('');

  const set = (key: keyof KycFormData, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const { mutate, isPending } = useMutation({
    mutationFn: kycService.submit,
    onSuccess: () => {
      setKycStatus('pending');
      history.replace('/app/kyc/pending');
    },
    onError: (err: any) => setError(err?.response?.data?.message || 'Submission failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.businessName || !form.businessType || !form.address || !form.city || !form.country || !form.phone) {
      setError('Please fill all required fields');
      return;
    }
    mutate(form);
  };

  return (
    <IonPage>
      <IonContent>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFF3CD', color: '#856404', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              <span>🔍</span> KYC Verification Required
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>Verify your business</h1>
            <p style={{ color: '#6C6C70', fontSize: 16, margin: 0 }}>
              {kycStatus === 'rejected'
                ? 'Your previous submission was rejected. Please update and resubmit.'
                : 'Complete your business verification to unlock full platform access.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <Section title="Business Information">
              <Row>
                <Field label="Business Name *">
                  <input value={form.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="Acme Corporation" style={inputStyle} />
                </Field>
                <Field label="Business Type *">
                  <select value={form.businessType} onChange={(e) => set('businessType', e.target.value)} style={inputStyle}>
                    <option value="">Select type…</option>
                    {BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </Field>
              </Row>
              <Row>
                <Field label="Registration Number">
                  <input value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} placeholder="Optional" style={inputStyle} />
                </Field>
                <Field label="Tax Number">
                  <input value={form.taxNumber} onChange={(e) => set('taxNumber', e.target.value)} placeholder="Optional" style={inputStyle} />
                </Field>
              </Row>
            </Section>

            <Section title="Contact & Address">
              <Row>
                <Field label="Phone *">
                  <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 234 567 8900" style={inputStyle} />
                </Field>
                <Field label="Website">
                  <input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://yoursite.com" style={inputStyle} />
                </Field>
              </Row>
              <Field label="Address *" full>
                <input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Business Street" style={inputStyle} />
              </Field>
              <Row>
                <Field label="City *">
                  <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New York" style={inputStyle} />
                </Field>
                <Field label="State / Province">
                  <input value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="NY" style={inputStyle} />
                </Field>
              </Row>
              <Row>
                <Field label="Country *">
                  <input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="United States" style={inputStyle} />
                </Field>
                <Field label="Postal Code">
                  <input value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} placeholder="10001" style={inputStyle} />
                </Field>
              </Row>
            </Section>

            {error && (
              <div style={{ background: '#FFF2F2', border: '1px solid #FFD0D0', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#CC0000', fontSize: 14 }}>
                {error}
              </div>
            )}

            <IonButton expand="block" type="submit" disabled={isPending} style={{ '--border-radius': '12px', height: 50, fontSize: 17, fontWeight: 600 }}>
              {isPending ? <IonSpinner name="crescent" /> : 'Submit KYC for Review'}
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#3C3C43', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</h3>
    {children}
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>{children}</div>
);

const Field: React.FC<{ label: string; children: React.ReactNode; full?: boolean }> = ({ label, children, full }) => (
  <div style={full ? { marginBottom: 16 } : {}}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#6C6C70', display: 'block', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 10, border: '1.5px solid #E5E5EA',
  fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA',
};

export default KycPage;
