import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonRefresher, IonRefresherContent } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../../services/company.service';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { layersOutline } from 'ionicons/icons';

const DepartmentsPage: React.FC = () => {
  const { data, isLoading, refetch } = useQuery({ queryKey: ['departments'], queryFn: () => departmentService.list() });
  const departments = data?.data || [];

  return (
    <IonPage>
      <IonHeader translucent><IonToolbar><IonTitle>Departments</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}><IonRefresherContent /></IonRefresher>
        <IonHeader collapse="condense"><IonToolbar style={{ '--background': 'transparent' }}><IonTitle size="large">Departments</IonTitle></IonToolbar></IonHeader>
        {isLoading ? <LoadingSkeleton count={5} /> : departments.length === 0 ? (
          <EmptyState title="No Departments" icon={layersOutline} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {departments.map((d) => (
                <IonItem key={d.id} style={{ '--background': '#fff' }}>
                  <IonLabel>
                    <h3 style={{ fontWeight: 600 }}>{d.name}</h3>
                    <p style={{ color: '#8E8E93' }}>{d.code}</p>
                  </IonLabel>
                  <IonBadge slot="end" color={d.status === 'active' ? 'success' : 'medium'}>{d.status}</IonBadge>
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

export default DepartmentsPage;
