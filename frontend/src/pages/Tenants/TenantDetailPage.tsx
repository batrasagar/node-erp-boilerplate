import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSegment, IonSegmentButton, IonLabel, IonRefresher,
  IonRefresherContent, IonBadge, IonIcon, IonButton, IonSpinner,
  IonList, IonItem, IonAvatar, IonAlert,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  personCircleOutline, mailOutline, checkmarkCircleOutline,
  closeCircleOutline, ellipsisHorizontalOutline, businessOutline,
} from 'ionicons/icons';
import { tenantService } from '../../services/tenant.service';
import { userService } from '../../services/user.service';
import { kycService } from '../../services/kyc.service';
import { format } from 'date-fns';

const PLAN_COLOR: Record<string, { bg: string; color: string }> = {
  starter:      { bg: '#E8F5E9', color: '#2E7D32' },
  professional: { bg: '#E8EAF6', color: '#3949AB' },
  enterprise:   { bg: '#FFF3E0', color: '#E65100' },
};

const STATUS_COLOR: Record<string, string> = {
  active: 'success', trial: 'warning', inactive: 'medium', suspended: 'danger',
};

const KYC_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  not_submitted: { bg: '#F5F5F5', color: '#9E9E9E', label: 'Not Submitted' },
  pending:       { bg: '#FFF8E1', color: '#F57F17', label: 'KYC Pending' },
  under_review:  { bg: '#E3F2FD', color: '#1565C0', label: 'Under Review' },
  approved:      { bg: '#E8F5E9', color: '#2E7D32', label: 'KYC Approved' },
  rejected:      { bg: '#FFEBEE', color: '#C62828', label: 'KYC Rejected' },
};

type Tab = 'overview' | 'users' | 'kyc';

const TenantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('overview');
  const [suspendAlert, setSuspendAlert] = useState(false);

  const { data: tenant, isLoading: tenantLoading, refetch } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.get(id),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', 'tenant', id],
    queryFn: () => userService.list({ tenantId: id, limit: 50 }),
    enabled: tab === 'users',
  });

  const { data: kyc, isLoading: kycLoading } = useQuery({
    queryKey: ['kyc-list', undefined, id],
    queryFn: async () => {
      const all = await kycService.list();
      return all.find((k) => k.tenantId === id) || null;
    },
    enabled: tab === 'kyc',
  });

  const { mutate: updateTenant, isPending: updating } = useMutation({
    mutationFn: (payload: Record<string, string>) => tenantService.update(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tenant', id] }); qc.invalidateQueries({ queryKey: ['tenants'] }); },
  });

  const { mutate: toggleUser, isPending: togglingUser } = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      userService.update(userId, { status } as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'tenant', id] }),
  });

  const users = usersData?.data || [];

  if (tenantLoading) return (
    <IonPage>
      <IonHeader><IonToolbar><IonBackButton defaultHref="/app/tenants" /><IonTitle>Loading…</IonTitle></IonToolbar></IonHeader>
      <IonContent><div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><IonSpinner /></div></IonContent>
    </IonPage>
  );

  if (!tenant) return null;

  const kycCfg = KYC_COLOR[tenant.kycStatus || 'not_submitted'];
  const planCfg = PLAN_COLOR[tenant.plan] || PLAN_COLOR.starter;

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/app/tenants" /></IonButtons>
          <IonTitle>{tenant.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setSuspendAlert(true)} color={tenant.status === 'suspended' ? 'success' : 'danger'} fill="clear" style={{ fontSize: 13 }}>
              {tenant.status === 'suspended' ? 'Activate' : 'Suspend'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch().then(() => e.detail.complete()); }}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Tenant identity card */}
        <div style={{ margin: '16px 16px 0', background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: tenant.primaryColor || '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>{tenant.name[0].toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 700 }}>{tenant.name}</h2>
              <span style={{ fontSize: 13, color: '#8E8E93' }}>@{tenant.slug}</span>
            </div>
            <IonBadge color={STATUS_COLOR[tenant.status]} style={{ fontSize: 12 }}>{tenant.status}</IonBadge>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Chip label={tenant.plan} bg={planCfg.bg} color={planCfg.color} />
            <Chip label={kycCfg.label} bg={kycCfg.bg} color={kycCfg.color} />
            {tenant.trialEndsAt && (
              <Chip label={`Trial ends ${format(new Date(tenant.trialEndsAt), 'MMM d')}`} bg="#FFF3E0" color="#E65100" />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '12px 16px 0' }}>
          <IonSegment value={tab} onIonChange={(e) => setTab(e.detail.value as Tab)}>
            <IonSegmentButton value="overview"><IonLabel>Overview</IonLabel></IonSegmentButton>
            <IonSegmentButton value="users">
              <IonLabel>Users {users.length > 0 && tab === 'users' ? `(${users.length})` : ''}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="kyc"><IonLabel>KYC</IonLabel></IonSegmentButton>
          </IonSegment>
        </div>

        <div style={{ padding: '16px 16px 80px' }}>
          {/* ─── Overview tab ─── */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <InfoCard title="Tenant Details">
                <InfoRow label="Tenant ID" value={tenant.id} mono />
                <InfoRow label="Plan" value={tenant.plan} capitalize />
                <InfoRow label="Status" value={tenant.status} capitalize />
                <InfoRow label="KYC Status" value={kycCfg.label} />
                {tenant.domain && <InfoRow label="Domain" value={tenant.domain} />}
                <InfoRow label="Created" value={format(new Date(tenant.createdAt), 'MMM d, yyyy')} />
                {tenant.trialEndsAt && <InfoRow label="Trial Ends" value={format(new Date(tenant.trialEndsAt), 'MMM d, yyyy')} />}
              </InfoCard>

              <InfoCard title="Quick Actions">
                {(['starter', 'professional', 'enterprise'] as const).map((plan) => (
                  <IonButton key={plan} expand="block" fill={tenant.plan === plan ? 'solid' : 'outline'} size="small"
                    disabled={tenant.plan === plan || updating}
                    onClick={() => updateTenant({ plan })}
                    style={{ marginBottom: 8, '--border-radius': '10px', textTransform: 'capitalize' }}>
                    {tenant.plan === plan ? `✓ ${plan}` : `Switch to ${plan}`}
                  </IonButton>
                ))}
              </InfoCard>
            </div>
          )}

          {/* ─── Users tab ─── */}
          {tab === 'users' && (
            usersLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}><IonSpinner /></div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <IonIcon icon={personCircleOutline} style={{ fontSize: 56, color: '#C7C7CC' }} />
                <p style={{ color: '#8E8E93', marginTop: 12 }}>No users in this tenant</p>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <IonList style={{ background: 'transparent' }}>
                  {users.map((user) => (
                    <IonItem key={user.id} style={{ '--background': '#fff' }}>
                      <IonAvatar slot="start">
                        <div style={{ width: 40, height: 40, borderRadius: 20, background: user.status === 'active' ? '#007AFF20' : '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: user.status === 'active' ? '#007AFF' : '#8E8E93' }}>
                            {user.firstName?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </IonAvatar>
                      <IonLabel>
                        <h3 style={{ fontWeight: 600, fontSize: 15 }}>
                          {user.firstName} {user.lastName}
                          {user.isSuperAdmin && <span style={{ marginLeft: 6, fontSize: 10, background: '#5856D620', color: '#5856D6', padding: '1px 6px', borderRadius: 100, fontWeight: 700 }}>ADMIN</span>}
                        </h3>
                        <p style={{ color: '#8E8E93', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <IonIcon icon={mailOutline} style={{ fontSize: 12 }} /> {user.email}
                        </p>
                        {(user as any).roles?.length > 0 && (
                          <p style={{ fontSize: 12, color: '#007AFF' }}>{(user as any).roles.map((r: any) => r.name).join(', ')}</p>
                        )}
                      </IonLabel>
                      <div slot="end" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <IonBadge color={user.status === 'active' ? 'success' : user.status === 'suspended' ? 'danger' : 'medium'} style={{ fontSize: 11 }}>
                          {user.status}
                        </IonBadge>
                        <IonButton fill="clear" size="small"
                          color={user.status === 'active' ? 'danger' : 'success'}
                          disabled={togglingUser}
                          onClick={() => toggleUser({ userId: user.id, status: user.status === 'active' ? 'suspended' : 'active' })}>
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </IonButton>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            )
          )}

          {/* ─── KYC tab ─── */}
          {tab === 'kyc' && (
            kycLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}><IonSpinner /></div>
            ) : !kyc ? (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>📋</div>
                <p style={{ color: '#8E8E93', fontSize: 16 }}>No KYC submitted yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <InfoCard title="KYC Status">
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
                    <span style={{ background: KYC_COLOR[kyc.status]?.bg, color: KYC_COLOR[kyc.status]?.color, padding: '8px 24px', borderRadius: 100, fontSize: 15, fontWeight: 700 }}>
                      {KYC_COLOR[kyc.status]?.label}
                    </span>
                  </div>
                  {kyc.rejectionReason && (
                    <div style={{ background: '#FFEBEE', borderRadius: 10, padding: 12, margin: '8px 0' }}>
                      <p style={{ fontWeight: 600, color: '#C62828', fontSize: 13, margin: '0 0 4px' }}>Rejection Reason:</p>
                      <p style={{ color: '#3C3C43', fontSize: 14, margin: 0 }}>{kyc.rejectionReason}</p>
                    </div>
                  )}
                </InfoCard>

                <InfoCard title="Business Details">
                  <InfoRow label="Business Name" value={kyc.businessName} />
                  <InfoRow label="Type" value={kyc.businessType.replace('_', ' ')} capitalize />
                  {kyc.registrationNumber && <InfoRow label="Reg. Number" value={kyc.registrationNumber} />}
                  {kyc.taxNumber && <InfoRow label="Tax Number" value={kyc.taxNumber} />}
                  <InfoRow label="Phone" value={kyc.phone} />
                  {kyc.website && <InfoRow label="Website" value={kyc.website} />}
                  <InfoRow label="Address" value={`${kyc.address}, ${kyc.city}${kyc.state ? ', ' + kyc.state : ''}, ${kyc.country}`} />
                  <InfoRow label="Submitted" value={format(new Date(kyc.createdAt), 'MMM d, yyyy h:mm a')} />
                </InfoCard>
              </div>
            )
          )}
        </div>
      </IonContent>

      <IonAlert
        isOpen={suspendAlert}
        onDidDismiss={() => setSuspendAlert(false)}
        header={tenant.status === 'suspended' ? 'Activate Tenant' : 'Suspend Tenant'}
        message={tenant.status === 'suspended'
          ? `Activate ${tenant.name}? Users will regain access immediately.`
          : `Suspend ${tenant.name}? All users will be locked out immediately.`}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          {
            text: tenant.status === 'suspended' ? 'Activate' : 'Suspend',
            role: 'confirm',
            handler: () => updateTenant({ status: tenant.status === 'suspended' ? 'active' : 'suspended' }),
          },
        ]}
      />
    </IonPage>
  );
};

const Chip: React.FC<{ label: string; bg: string; color: string }> = ({ label, bg, color }) => (
  <span style={{ background: bg, color, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{label}</span>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
    <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</h4>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string; mono?: boolean; capitalize?: boolean }> = ({ label, value, mono, capitalize }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F2F2F7' }}>
    <span style={{ fontSize: 14, color: '#8E8E93' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 500, fontFamily: mono ? 'monospace' : 'inherit', textTransform: capitalize ? 'capitalize' : 'none', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
  </div>
);

export default TenantDetailPage;
