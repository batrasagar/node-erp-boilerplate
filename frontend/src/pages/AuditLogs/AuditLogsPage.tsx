import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonAvatar, IonRefresher, IonRefresherContent,
} from '@ionic/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auditLogService } from '../../services/role.service';
import { format } from 'date-fns';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { documentTextOutline } from 'ionicons/icons';

const AuditLogsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => auditLogService.list({ limit: 50 }),
  });

  const logs = data?.data || [];

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar><IonTitle>Audit Logs</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Audit Logs</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? <LoadingSkeleton count={8} /> : logs.length === 0 ? (
          <EmptyState title="No Logs" description="Activity will appear here" icon={documentTextOutline} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {logs.map((log) => (
                <IonItem key={log.id} style={{ '--background': '#fff' }}>
                  <IonAvatar slot="start">
                    <div style={{ width: 40, height: 40, borderRadius: 20, background: log.status === 'success' ? '#34C75920' : '#FF3B3020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: log.status === 'success' ? '#34C759' : '#FF3B30' }}>
                        {log.user?.firstName?.[0] || '?'}
                      </span>
                    </div>
                  </IonAvatar>
                  <IonLabel>
                    <h3 style={{ fontWeight: 500, fontSize: 15 }}>
                      {log.action} <span style={{ color: '#6C6C70' }}>{log.resource}</span>
                    </h3>
                    <p style={{ fontSize: 13 }}>{log.user?.firstName} {log.user?.lastName}</p>
                    <p style={{ fontSize: 12, color: '#C7C7CC' }}>{format(new Date(log.createdAt), 'MMM d, h:mm a')}</p>
                  </IonLabel>
                  <span slot="end" style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                    background: log.status === 'success' ? '#34C75920' : '#FF3B3020',
                    color: log.status === 'success' ? '#34C759' : '#FF3B30',
                  }}>{log.status}</span>
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

export default AuditLogsPage;
