import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';
import {
  homeOutline, home,
  gridOutline, grid,
  peopleOutline, people,
  notificationsOutline, notifications,
  settingsOutline, settings,
} from 'ionicons/icons';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../../services/role.service';
import { useIsAuthenticated } from '../../hooks/useAuth';

const TabBar: React.FC = () => {
  const isAuth = useIsAuthenticated();

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.unreadCount,
    enabled: isAuth,
    refetchInterval: 30000,
  });

  const unreadCount = unreadData?.count || 0;

  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/app/home">
        <IonIcon ios={home} md={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="dashboard" href="/app/dashboard">
        <IonIcon ios={grid} md={gridOutline} />
        <IonLabel>Dashboard</IonLabel>
      </IonTabButton>

      <IonTabButton tab="users" href="/app/users">
        <IonIcon ios={people} md={peopleOutline} />
        <IonLabel>Users</IonLabel>
      </IonTabButton>

      <IonTabButton tab="notifications" href="/app/notifications">
        <IonIcon ios={notifications} md={notificationsOutline} />
        <IonLabel>Alerts</IonLabel>
        {unreadCount > 0 && (
          <IonBadge color="danger">{unreadCount > 99 ? '99+' : unreadCount}</IonBadge>
        )}
      </IonTabButton>

      <IonTabButton tab="settings" href="/app/settings">
        <IonIcon ios={settings} md={settingsOutline} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar;
