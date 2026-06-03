import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel,
  IonRefresher, IonRefresherContent, IonAvatar,
} from '@ionic/react';
import {
  notificationsOutline, personCircleOutline, chevronForwardOutline,
  businessOutline, peopleOutline, gitBranchOutline, layersOutline,
  shieldCheckmarkOutline, menuOutline, documentTextOutline, folderOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { notificationService } from '../../services/role.service';
import { format } from 'date-fns';

interface MenuItem {
  title: string;
  subtitle: string;
  path: string;
  icon: string;
  color: string;
  permission?: string;
}

const menuItems: MenuItem[] = [
  { title: 'Tenants',       subtitle: 'Manage organizations',  path: '/app/tenants',       icon: businessOutline,        color: '#007AFF', permission: 'tenants.read' },
  { title: 'Companies',     subtitle: 'Business entities',     path: '/app/companies',     icon: businessOutline,        color: '#5AC8FA', permission: 'companies.read' },
  { title: 'Branches',      subtitle: 'Office locations',      path: '/app/branches',      icon: gitBranchOutline,       color: '#34C759', permission: 'branches.read' },
  { title: 'Departments',   subtitle: 'Organisation units',    path: '/app/departments',   icon: layersOutline,          color: '#FF9F0A', permission: 'departments.read' },
  { title: 'Users',         subtitle: 'Team members',          path: '/app/users',         icon: peopleOutline,          color: '#5856D6', permission: 'users.read' },
  { title: 'Roles',         subtitle: 'Access control',        path: '/app/roles',         icon: shieldCheckmarkOutline, color: '#FF2D55', permission: 'roles.read' },
  { title: 'Menus',         subtitle: 'Navigation config',     path: '/app/menus',         icon: menuOutline,            color: '#AF52DE', permission: 'menus.read' },
  { title: 'Approvals',     subtitle: 'KYC & workflows',       path: '/app/approvals',     icon: shieldCheckmarkOutline, color: '#30D158', permission: 'approvals.read' },
  { title: 'Audit Logs',    subtitle: 'Activity history',      path: '/app/audit-logs',    icon: documentTextOutline,    color: '#FF6B35', permission: 'audit_logs.read' },
  { title: 'Files',         subtitle: 'File manager',          path: '/app/files',         icon: folderOutline,          color: '#32ADE6', permission: 'files.read' },
  { title: 'Notifications', subtitle: 'Alerts & messages',     path: '/app/notifications', icon: notificationsOutline,   color: '#FF9F0A', permission: 'notifications.read' },
  { title: 'Settings',      subtitle: 'Platform settings',     path: '/app/settings',      icon: personCircleOutline,    color: '#636366', permission: 'settings.read' },
];

const HomePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const history = useHistory();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.unreadCount,
  });

  const handleRefresh = async (event: CustomEvent) => {
    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    event.detail.complete();
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/app/notifications')}>
              <IonIcon icon={notificationsOutline} />
              {(unreadData?.count || 0) > 0 && (
                <span className="ios-badge" style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, fontSize: 10 }}>
                  {unreadData!.count}
                </span>
              )}
            </IonButton>
            <IonButton onClick={() => history.push('/app/settings')}>
              <IonIcon icon={personCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large" style={{ paddingLeft: 0 }}>
              <div>
                <p style={{ fontSize: 15, color: '#6C6C70', margin: '0 0 2px', fontWeight: 400 }}>{greeting()},</p>
                <span style={{ fontSize: 34, fontWeight: 700 }}>{user?.firstName} 👋</span>
              </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Date */}
        <div style={{ padding: '0 20px 16px' }}>
          <p style={{ color: '#8E8E93', fontSize: 15, margin: 0 }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Quick Actions */}
        <p className="section-header">Modules</p>
        <div className="ios-grouped" style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <IonList style={{ background: 'transparent' }}>
            {menuItems.filter(item => !item.permission || hasPermission(item.permission)).map((item, i) => (
              <IonItem
                key={i}
                button
                detail={false}
                onClick={() => history.push(item.path)}
                style={{ '--background': '#fff' }}
              >
                <div slot="start" style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: item.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <IonIcon icon={item.icon} style={{ fontSize: 18, color: '#fff' }} />
                </div>
                <IonLabel style={{ marginLeft: 12 }}>
                  <h3 style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: '#8E8E93' }}>{item.subtitle}</p>
                </IonLabel>
                <IonIcon icon={chevronForwardOutline} slot="end" style={{ color: '#C7C7CC', fontSize: 16 }} />
              </IonItem>
            ))}
          </IonList>
        </div>
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
