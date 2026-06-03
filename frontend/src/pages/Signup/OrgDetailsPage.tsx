import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSignupStore } from '../../stores/signupStore';
import { signupService } from '../../services/signup.service';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const OrgDetailsPage: React.FC = () => {
  const history = useHistory();
  const { selectedPlan, orgName, orgSlug, setOrgDetails } = useSignupStore();
  const [name, setName] = useState(orgName);
  const [slug, setSlug] = useState(orgSlug);
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!selectedPlan) history.replace('/signup/plan'); }, [selectedPlan, history]);

  useEffect(() => {
    if (!slugEdited && name) setSlug(slugify(name));
  }, [name, slugEdited]);

  useEffect(() => {
    if (!slug || slug.length < 3) { setSlugAvailable(null); return; }
    setChecking(true);
    const t = setTimeout(async () => {
      const available = await signupService.checkSlug(slug);
      setSlugAvailable(available);
      setChecking(false);
    }, 400);
    return () => clearTimeout(t);
  }, [slug]);

  const handleNext = () => {
    if (!name.trim()) { setError('Organisation name is required'); return; }
    if (!slug || slug.length < 3) { setError('Slug must be at least 3 characters'); return; }
    if (slugAvailable === false) { setError('This slug is already taken'); return; }
    setOrgDetails(name.trim(), slug);
    history.push('/signup/account');
  };

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>Your organisation</h2>
      <p style={{ color: '#6C6C70', marginBottom: 28, fontSize: 16 }}>This is how your workspace will be identified.</p>

      <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#3C3C43', display: 'block', marginBottom: 8 }}>Organisation Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#3C3C43', display: 'block', marginBottom: 8 }}>Organisation Slug</label>
          <div style={{ position: 'relative' }}>
            <input
              value={slug}
              onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }}
              placeholder="acme-corp"
              style={{ ...inputStyle, paddingRight: 48 }}
            />
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>
              {checking ? '⏳' : slugAvailable === true ? '✅' : slugAvailable === false ? '❌' : ''}
            </span>
          </div>
          <p style={{ fontSize: 12, color: slugAvailable === false ? '#FF3B30' : '#8E8E93', marginTop: 6 }}>
            {slugAvailable === false ? 'Slug already taken — try another' : `Your login URL: app.erp.com/${slug || '...'}`}
          </p>
        </div>

        {error && <p style={{ color: '#FF3B30', fontSize: 14, marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button onClick={() => history.goBack()} style={{ flex: 1, background: '#F2F2F7', color: '#1C1C1E', border: 'none', padding: 14, borderRadius: 12, fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={slugAvailable === false || checking}
            style={{ flex: 2, background: '#007AFF', color: '#fff', border: 'none', padding: 14, borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', opacity: slugAvailable === false ? 0.5 : 1 }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E5E5EA',
  fontSize: 16, outline: 'none', boxSizing: 'border-box', background: '#FAFAFA',
};

export default OrgDetailsPage;
