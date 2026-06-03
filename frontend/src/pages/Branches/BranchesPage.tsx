import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonRefresher, IonRefresherContent } from '@ionic/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { branchService } from '../../services/company.service';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { gitBranchOutline } from 'ionicons/icons';

const BranchesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({ queryKey: ['branches'], queryFn: () => branchService.list() });
  const branches = data?.data || [];

  return (
    <IonPage>
      <IonHeader translucent><IonToolbar><IonTitle>Branches</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}><IonRefresherContent /></IonRefresher>
        <IonHeader collapse="condense"><IonToolbar style={{ '--background': 'transparent' }}><IonTitle size="large">Branches</IonTitle></IonToolbar></IonHeader>
        {isLoading ? <LoadingSkeleton count={5} /> : branches.length === 0 ? (
          <EmptyState title="No Branches" icon={gitBranchOutline} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {branches.map((b) => (
                <IonItem key={b.id} style={{ '--background': '#fff' }}>
                  <IonLabel>
                    <h3 style={{ fontWeight: 600 }}>{b.name}</h3>
                    <p>{b.code} {b.city ? `• ${b.city}` : ''}</p>
                    {b.isHeadquarters && <p style={{ color: '#007AFF', fontSize: 12, fontWeight: 600 }}>Headquarters</p>}
                  </IonLabel>
                  <IonBadge slot="end" color={b.status === 'active' ? 'success' : 'medium'}>{b.status}</IonBadge>
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

export default BranchesPage;
