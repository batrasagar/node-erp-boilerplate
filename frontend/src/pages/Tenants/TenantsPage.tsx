import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButtons, IonButton,
  IonRefresher, IonRefresherContent,
} from '@ionic/react';
import { add, businessOutline, chevronForwardOutline } from 'ionicons/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { tenantService } from '../../services/tenant.service';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { useIsSuperAdmin } from '../../hooks/usePermission';

const planColors: Record<string, string> = {
  starter: '#34C759', professional: '#007AFF', enterprise: '#5856D6',
};

const TenantsPage: React.FC = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const isSuperAdmin = useIsSuperAdmin();
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantService.list(),
  });

  const tenants = (data?.data || []).filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Tenants</IonTitle>
          {isSuperAdmin && (
            <IonButtons slot="end">
              <IonButton onClick={() => history.push('/app/tenants/new')} strong>
                <IonIcon icon={add} slot="icon-only" />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={search} onIonInput={(e) => setSearch(e.detail.value || '')} placeholder="Search tenants..." animated />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Tenants</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? <LoadingSkeleton count={6} /> : tenants.length === 0 ? (
          <EmptyState title="No Tenants" description="No tenants found" icon={businessOutline} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {tenants.map((tenant) => (
                <IonItem key={tenant.id} button detail={false}
                  onClick={() => history.push(`/app/tenants/${tenant.id}/edit`)}
                  style={{ '--background': '#fff' }}
                >
                  <div slot="start" style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: tenant.primaryColor || '#007AFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                      {tenant.name[0].toUpperCase()}
                    </span>
                  </div>
                  <IonLabel style={{ marginLeft: 8 }}>
                    <h3 style={{ fontWeight: 600 }}>{tenant.name}</h3>
                    <p style={{ color: '#8E8E93' }}>{tenant.slug}</p>
                  </IonLabel>
                  <div slot="end" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                      background: `${planColors[tenant.plan]}20`,
                      color: planColors[tenant.plan],
                    }}>{tenant.plan}</span>
                    <IonBadge color={tenant.status === 'active' ? 'success' : tenant.status === 'trial' ? 'warning' : 'medium'} style={{ fontSize: 11 }}>
                      {tenant.status}
                    </IonBadge>
                    <IonIcon icon={chevronForwardOutline} style={{ color: '#C7C7CC', fontSize: 16 }} />
                  </div>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default TenantsPage;
