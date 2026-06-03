import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';
import {
  homeOutline, home,
  gridOutline, grid,
  peopleOutline, people,
  notificationsOutline, notifications,
  settingsOutline, settings,
  shieldCheckmarkOutline, shieldCheckmark,
} from 'ionicons/icons';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../../services/role.service';
import { kycService } from '../../services/kyc.service';
import { useIsAuthenticated } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';

const TabBar: React.FC = () => {
  const isAuth = useIsAuthenticated();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canSeeApprovals = hasPermission('approvals.read');

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.unreadCount,
    enabled: isAuth,
    refetchInterval: 30000,
  });

  const { data: pendingKyc = 0 } = useQuery({
    queryKey: ['kyc-pending-count'],
    queryFn: kycService.pendingCount,
    enabled: isAuth && canSeeApprovals,
    refetchInterval: 60000,
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

      {canSeeApprovals && (
        <IonTabButton tab="approvals" href="/app/approvals">
          <IonIcon ios={shieldCheckmark} md={shieldCheckmarkOutline} />
          <IonLabel>Approvals</IonLabel>
          {pendingKyc > 0 && <IonBadge color="danger">{pendingKyc > 99 ? '99+' : pendingKyc}</IonBadge>}
        </IonTabButton>
      )}

      <IonTabButton tab="settings" href="/app/settings">
        <IonIcon ios={settings} md={settingsOutline} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar;
