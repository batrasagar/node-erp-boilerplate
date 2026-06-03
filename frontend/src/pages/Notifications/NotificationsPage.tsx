import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon, IonButtons, IonButton,
  IonRefresher, IonRefresherContent, IonBadge,
} from '@ionic/react';
import { checkmarkDoneOutline, notificationsOutline } from 'ionicons/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/role.service';
import { format } from 'date-fns';
import EmptyState from '../../components/Common/EmptyState';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';

const typeColors: Record<string, string> = {
  info: '#007AFF', success: '#34C759', warning: '#FF9F0A', error: '#FF3B30', system: '#5856D6',
};

const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.list(),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data?.data || [];

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
              <IonIcon icon={checkmarkDoneOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? <LoadingSkeleton count={6} /> : notifications.length === 0 ? (
          <EmptyState title="All Caught Up" description="No notifications to show" icon={notificationsOutline} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {notifications.map((notif) => (
                <IonItem key={notif.id} button detail={false}
                  onClick={() => !notif.isRead && markReadMutation.mutate(notif.id)}
                  style={{ '--background': notif.isRead ? '#fff' : '#F0F8FF' }}
                >
                  <div slot="start" style={{
                    width: 10, height: 10, borderRadius: 5,
                    background: notif.isRead ? 'transparent' : '#007AFF',
                    marginRight: 4, flexShrink: 0,
                  }} />
                  <div slot="start" style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${typeColors[notif.type]}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IonIcon icon={notificationsOutline} style={{ fontSize: 18, color: typeColors[notif.type] }} />
                  </div>
                  <IonLabel style={{ marginLeft: 8 }}>
                    <h3 style={{ fontWeight: notif.isRead ? 400 : 600, fontSize: 15 }}>{notif.title}</h3>
                    <p style={{ fontSize: 13, color: '#6C6C70', whiteSpace: 'normal', lineHeight: 1.4 }}>{notif.body}</p>
                    <p style={{ fontSize: 12, color: '#C7C7CC', marginTop: 4 }}>
                      {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </IonLabel>
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

export default NotificationsPage;
