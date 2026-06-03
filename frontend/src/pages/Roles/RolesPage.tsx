import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButtons, IonButton,
  IonRefresher, IonRefresherContent,
} from '@ionic/react';
import { add, shieldCheckmarkOutline, chevronForwardOutline } from 'ionicons/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../../services/role.service';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';

const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.list,
  });

  const roles = data?.data || [];

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Roles</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Roles</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? <LoadingSkeleton count={5} /> : roles.length === 0 ? (
          <EmptyState title="No Roles" icon={shieldCheckmarkOutline} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {roles.map((role) => (
                <IonItem key={role.id} style={{ '--background': '#fff' }}>
                  <div slot="start" style={{
                    width: 36, height: 36, borderRadius: 9, background: '#FF2D5520',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IonIcon icon={shieldCheckmarkOutline} style={{ fontSize: 18, color: '#FF2D55' }} />
                  </div>
                  <IonLabel style={{ marginLeft: 8 }}>
                    <h3 style={{ fontWeight: 600 }}>{role.name}</h3>
                    <p style={{ color: '#8E8E93', fontSize: 13 }}>
                      {role.permissions?.length || 0} permissions
                    </p>
                  </IonLabel>
                  <div slot="end" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {role.isSystem && <IonBadge color="primary" style={{ fontSize: 10 }}>system</IonBadge>}
                    <IonBadge color={role.status === 'active' ? 'success' : 'medium'} style={{ fontSize: 11 }}>{role.status}</IonBadge>
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

export default RolesPage;
