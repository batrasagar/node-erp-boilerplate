import React, { useEffect } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { kycService } from '../../services/kyc.service';
import { useAuthStore } from '../../stores/authStore';

const STATUS_CONFIG = {
  pending: { icon: '⏳', color: '#FF9500', bg: '#FFF8ED', title: 'Under Review', desc: 'Your KYC has been submitted and is awaiting review. We typically process submissions within 1–2 business days.' },
  under_review: { icon: '🔍', color: '#007AFF', bg: '#F0F7FF', title: 'Being Reviewed', desc: 'Our team is actively reviewing your submission. You will be notified once a decision is made.' },
  approved: { icon: '✅', color: '#34C759', bg: '#F0FFF4', title: 'Approved!', desc: 'Your business has been verified. You now have full access to the platform.' },
  rejected: { icon: '❌', color: '#FF3B30', bg: '#FFF2F2', title: 'Rejected', desc: 'Unfortunately your submission was rejected. Please review the reason below and resubmit.' },
};

const KycPendingPage: React.FC = () => {
  const history = useHistory();
  const { kycStatus, setKycStatus } = useAuthStore();

  const { data: kyc } = useQuery({
    queryKey: ['kyc-status'],
    queryFn: kycService.getStatus,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (kyc?.status && kyc.status !== kycStatus) {
      setKycStatus(kyc.status as any);
      if (kyc.status === 'approved') history.replace('/app/home');
    }
  }, [kyc, kycStatus, setKycStatus, history]);

  const status = (kyc?.status || kycStatus || 'pending') as keyof typeof STATUS_CONFIG;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <IonPage>
      <IonContent>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '64px 20px', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 44 }}>
            {cfg.icon}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px', color: '#1C1C1E' }}>{cfg.title}</h1>
          <p style={{ color: '#6C6C70', fontSize: 16, lineHeight: 1.6, margin: '0 0 32px' }}>{cfg.desc}</p>

          {kyc?.rejectionReason && (
            <div style={{ background: '#FFF2F2', border: '1px solid #FFD0D0', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#CC0000', margin: '0 0 4px' }}>Rejection Reason:</p>
              <p style={{ fontSize: 14, color: '#3C3C43', margin: 0 }}>{kyc.rejectionReason}</p>
            </div>
          )}

          <div style={{ background: '#F9F9F9', borderRadius: 16, padding: '20px 24px', marginBottom: 32, textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#8E8E93', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Submission Details</p>
            {kyc && (
              <>
                <Detail label="Business" value={kyc.businessName} />
                <Detail label="Type" value={kyc.businessType.replace('_', ' ')} />
                <Detail label="Status" value={<span style={{ color: cfg.color, fontWeight: 600, textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>} />
                <Detail label="Submitted" value={new Date(kyc.createdAt).toLocaleDateString()} />
              </>
            )}
          </div>

          {status === 'rejected' ? (
            <IonButton expand="block" onClick={() => history.replace('/app/kyc')} style={{ '--border-radius': '12px', height: 50 }}>
              Resubmit KYC
            </IonButton>
          ) : status === 'approved' ? (
            <IonButton expand="block" onClick={() => history.replace('/app/home')} style={{ '--border-radius': '12px', height: 50 }}>
              Go to Dashboard →
            </IonButton>
          ) : (
            <p style={{ color: '#8E8E93', fontSize: 13 }}>This page refreshes automatically every 30 seconds.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

const Detail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F2F2F7' }}>
    <span style={{ fontSize: 14, color: '#8E8E93' }}>{label}</span>
    <span style={{ fontSize: 14, color: '#1C1C1E', fontWeight: 500 }}>{value}</span>
  </div>
);

export default KycPendingPage;
