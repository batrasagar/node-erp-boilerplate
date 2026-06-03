import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonRefresher, IonRefresherContent } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { permissionService } from '../../services/role.service';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';

const PermissionsPage: React.FC = () => {
  const { data, isLoading, refetch } = useQuery({ queryKey: ['permissions'], queryFn: permissionService.list });
  const grouped = data?.grouped || {};

  return (
    <IonPage>
      <IonHeader translucent><IonToolbar><IonTitle>Permissions</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}><IonRefresherContent /></IonRefresher>
        <IonHeader collapse="condense"><IonToolbar style={{ '--background': 'transparent' }}><IonTitle size="large">Permissions</IonTitle></IonToolbar></IonHeader>
        {isLoading ? <LoadingSkeleton count={8} /> : Object.entries(grouped).map(([module, perms]) => (
          <div key={module}>
            <p className="section-header">{module.replace(/_/g, ' ').toUpperCase()}</p>
            <div style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <IonList style={{ background: 'transparent' }}>
                {perms.map((p) => (
                  <IonItem key={p.id} style={{ '--background': '#fff' }}>
                    <IonLabel>
                      <h3 style={{ fontSize: 15 }}>{p.description || `${p.module}.${p.action}`}</h3>
                      <p style={{ fontSize: 12, color: '#8E8E93', fontFamily: 'monospace' }}>{p.module}.{p.action}</p>
                    </IonLabel>
                    <IonBadge slot="end" color="light" style={{ color: '#6C6C70', fontSize: 11 }}>{p.action}</IonBadge>
                  </IonItem>
                ))}
              </IonList>
            </div>
          </div>
        ))}
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default PermissionsPage;
