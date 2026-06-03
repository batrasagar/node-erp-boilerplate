import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel, IonRefresher,
  IonRefresherContent, IonBadge, IonButton, IonIcon, IonSpinner,
  IonModal, IonTextarea, IonItem, IonButtons,
} from '@ionic/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkmarkCircleOutline, closeCircleOutline, eyeOutline, timeOutline } from 'ionicons/icons';
import { kycService } from '../../services/kyc.service';
import { KycSubmission } from '../../types';
import { format } from 'date-fns';

type StatusFilter = 'pending' | 'under_review' | 'approved' | 'rejected' | '';

const STATUS_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  pending:      { bg: '#FFF3CD', color: '#856404', label: 'Pending' },
  under_review: { bg: '#CCE5FF', color: '#004085', label: 'Under Review' },
  approved:     { bg: '#D4EDDA', color: '#155724', label: 'Approved' },
  rejected:     { bg: '#F8D7DA', color: '#721C24', label: 'Rejected' },
};

const PLAN_COLOR: Record<string, string> = {
  starter: '#6C6C70', professional: '#5856D6', enterprise: '#FF9500',
};

const TenantApprovalsPage: React.FC = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [selected, setSelected] = useState<(KycSubmission & { tenant: any }) | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'review' | null>(null);

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['kyc-list', filter],
    queryFn: () => kycService.list(filter || undefined),
  });

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['kyc-pending-count'],
    queryFn: kycService.pendingCount,
    refetchInterval: 30000,
  });

  const { mutate: doReview, isPending: reviewing } = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: 'approved' | 'rejected' | 'under_review'; reason?: string }) =>
      kycService.review(id, status, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kyc-list'] });
      qc.invalidateQueries({ queryKey: ['kyc-pending-count'] });
      setSelected(null);
      setAction(null);
      setRejectReason('');
    },
  });

  const handleAction = (status: 'approved' | 'rejected' | 'under_review') => {
    if (!selected) return;
    if (status === 'rejected' && !rejectReason.trim()) return;
    doReview({ id: selected.id, status, reason: rejectReason || undefined });
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>
            Tenant Approvals
            {pendingCount > 0 && (
              <IonBadge color="danger" style={{ marginLeft: 8, fontSize: 11 }}>{pendingCount}</IonBadge>
            )}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch().then(() => e.detail.complete()); }}>
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Tenant Approvals</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Filter tabs */}
        <div style={{ padding: '12px 16px 0' }}>
          <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value as StatusFilter)}>
            <IonSegmentButton value="pending"><IonLabel>Pending</IonLabel></IonSegmentButton>
            <IonSegmentButton value="under_review"><IonLabel>In Review</IonLabel></IonSegmentButton>
            <IonSegmentButton value="approved"><IonLabel>Approved</IonLabel></IonSegmentButton>
            <IonSegmentButton value="rejected"><IonLabel>Rejected</IonLabel></IonSegmentButton>
          </IonSegment>
        </div>

        {/* List */}
        <div style={{ padding: '16px 16px 80px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><IonSpinner /></div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <p style={{ color: '#8E8E93', fontSize: 16 }}>No {filter || ''} submissions</p>
            </div>
          ) : (
            data.map((item) => (
              <KycCard key={item.id} item={item} onSelect={() => setSelected(item)} />
            ))
          )}
        </div>
      </IonContent>

      {/* Detail / Action modal */}
      <IonModal isOpen={!!selected} onDidDismiss={() => { setSelected(null); setAction(null); setRejectReason(''); }}>
        {selected && (
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonTitle style={{ fontSize: 16 }}>KYC Review</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setSelected(null)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div style={{ padding: 20 }}>
                {/* Tenant info */}
                <div style={{ background: '#F9F9F9', borderRadius: 14, padding: 18, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>{selected.tenant?.name}</h2>
                      <span style={{ fontSize: 13, color: '#8E8E93' }}>@{selected.tenant?.slug}</span>
                    </div>
                    <span style={{ background: PLAN_COLOR[selected.tenant?.plan] + '20', color: PLAN_COLOR[selected.tenant?.plan], padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>
                      {selected.tenant?.plan}
                    </span>
                  </div>
                  <Row label="Tenant Status" value={selected.tenant?.status} />
                  <Row label="Trial Ends" value={selected.tenant?.trialEndsAt ? format(new Date(selected.tenant.trialEndsAt), 'MMM d, yyyy') : '—'} />
                  <Row label="Joined" value={format(new Date(selected.tenant?.createdAt), 'MMM d, yyyy')} />
                </div>

                {/* KYC info */}
                <div style={{ background: '#F9F9F9', borderRadius: 14, padding: 18, marginBottom: 16 }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#3C3C43', textTransform: 'uppercase', letterSpacing: 0.5 }}>Business Details</h3>
                  <Row label="Business Name" value={selected.businessName} />
                  <Row label="Type" value={selected.businessType.replace('_', ' ')} />
                  {selected.registrationNumber && <Row label="Reg. Number" value={selected.registrationNumber} />}
                  {selected.taxNumber && <Row label="Tax Number" value={selected.taxNumber} />}
                  <Row label="Phone" value={selected.phone} />
                  {selected.website && <Row label="Website" value={selected.website} />}
                  <Row label="Address" value={`${selected.address}, ${selected.city}${selected.state ? ', ' + selected.state : ''}, ${selected.country}`} />
                  <Row label="Submitted" value={format(new Date(selected.createdAt), 'MMM d, yyyy h:mm a')} />
                </div>

                {selected.rejectionReason && (
                  <div style={{ background: '#FFF2F2', border: '1px solid #FFD0D0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <p style={{ fontWeight: 700, color: '#CC0000', fontSize: 13, margin: '0 0 6px' }}>Previous Rejection Reason:</p>
                    <p style={{ color: '#3C3C43', fontSize: 14, margin: 0 }}>{selected.rejectionReason}</p>
                  </div>
                )}

                {/* Current status */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span style={{ ...STATUS_COLOR[selected.status], padding: '6px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                    {STATUS_COLOR[selected.status]?.label}
                  </span>
                </div>

                {/* Actions */}
                {(selected.status === 'pending' || selected.status === 'under_review') && (
                  <>
                    {action === 'reject' ? (
                      <div>
                        <IonItem style={{ '--background': '#FFF', '--border-radius': '12px', marginBottom: 12 }}>
                          <IonLabel position="stacked" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Rejection Reason *</IonLabel>
                          <IonTextarea
                            value={rejectReason}
                            onIonInput={(e) => setRejectReason(e.detail.value || '')}
                            placeholder="Explain why this KYC is being rejected…"
                            rows={3}
                            autoGrow
                          />
                        </IonItem>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <IonButton fill="outline" expand="block" onClick={() => setAction(null)} style={{ flex: 1 }}>Cancel</IonButton>
                          <IonButton color="danger" expand="block" disabled={!rejectReason.trim() || reviewing} onClick={() => handleAction('rejected')} style={{ flex: 1 }}>
                            {reviewing ? <IonSpinner name="crescent" /> : 'Confirm Reject'}
                          </IonButton>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selected.status === 'pending' && (
                          <IonButton expand="block" fill="outline" color="primary" disabled={reviewing} onClick={() => doReview({ id: selected.id, status: 'under_review' })}>
                            <IonIcon slot="start" icon={timeOutline} />
                            Mark as Under Review
                          </IonButton>
                        )}
                        <IonButton expand="block" color="success" disabled={reviewing} onClick={() => handleAction('approved')}>
                          <IonIcon slot="start" icon={checkmarkCircleOutline} />
                          {reviewing ? <IonSpinner name="crescent" /> : 'Approve Tenant'}
                        </IonButton>
                        <IonButton expand="block" color="danger" fill="outline" onClick={() => setAction('reject')}>
                          <IonIcon slot="start" icon={closeCircleOutline} />
                          Reject
                        </IonButton>
                      </div>
                    )}
                  </>
                )}
              </div>
            </IonContent>
          </IonPage>
        )}
      </IonModal>
    </IonPage>
  );
};

const KycCard: React.FC<{ item: KycSubmission & { tenant: any }; onSelect: () => void }> = ({ item, onSelect }) => {
  const cfg = STATUS_COLOR[item.status];
  return (
    <div onClick={onSelect} style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', marginBottom: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer', border: '1.5px solid #F2F2F7' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <h3 style={{ margin: '0 0 3px', fontSize: 16, fontWeight: 700 }}>{item.tenant?.name || '—'}</h3>
          <span style={{ fontSize: 13, color: '#8E8E93' }}>@{item.tenant?.slug}</span>
        </div>
        <span style={{ background: cfg?.bg, color: cfg?.color, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{cfg?.label}</span>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Info label="Business" value={item.businessName} />
        <Info label="Type" value={item.businessType.replace('_', ' ')} />
        <Info label="Plan" value={item.tenant?.plan} color={PLAN_COLOR[item.tenant?.plan]} />
        <Info label="Submitted" value={format(new Date(item.createdAt), 'MMM d, yyyy')} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#007AFF', fontSize: 13, fontWeight: 600 }}>
        <IonIcon icon={eyeOutline} style={{ fontSize: 14 }} /> Review details
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F2F2F7', fontSize: 14 }}>
    <span style={{ color: '#8E8E93' }}>{label}</span>
    <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%', textTransform: 'capitalize' }}>{value}</span>
  </div>
);

const Info: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div>
    <div style={{ fontSize: 11, color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: color || '#1C1C1E', textTransform: 'capitalize' }}>{value}</div>
  </div>
);

export default TenantApprovalsPage;
