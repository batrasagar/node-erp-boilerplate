import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon, IonAvatar, IonNote,
} from '@ionic/react';
import {
  personOutline, businessOutline, shieldCheckmarkOutline, notificationsOutline,
  chevronForwardOutline, logOutOutline, informationCircleOutline, colorPaletteOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';

const SettingsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const history = useHistory();

  const sections = [
    {
      title: 'Organization',
      items: [
        { label: 'Companies', icon: businessOutline, color: '#007AFF', path: '/app/companies' },
        { label: 'Branches', icon: businessOutline, color: '#34C759', path: '/app/branches' },
        { label: 'Departments', icon: businessOutline, color: '#FF9F0A', path: '/app/departments' },
      ],
    },
    {
      title: 'Access Control',
      items: [
        { label: 'Roles & Permissions', icon: shieldCheckmarkOutline, color: '#FF2D55', path: '/app/roles' },
        { label: 'Menu Management', icon: colorPaletteOutline, color: '#AF52DE', path: '/app/menus' },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Audit Logs', icon: informationCircleOutline, color: '#FF6B35', path: '/app/audit-logs' },
        { label: 'File Manager', icon: informationCircleOutline, color: '#32ADE6', path: '/app/files' },
      ],
    },
  ];

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Profile Card */}
        <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <IonItem style={{ '--background': '#fff', '--min-height': '72px' }}>
            <IonAvatar slot="start" style={{ width: 50, height: 50 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 25, background: '#007AFF20',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#007AFF' }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </IonAvatar>
            <IonLabel>
              <h2 style={{ fontWeight: 700, fontSize: 18 }}>{user?.firstName} {user?.lastName}</h2>
              <p style={{ color: '#6C6C70' }}>{user?.email}</p>
              {user?.isSuperAdmin && (
                <IonNote color="primary" style={{ fontSize: 12 }}>Super Admin</IonNote>
              )}
            </IonLabel>
          </IonItem>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <p className="section-header">{section.title}</p>
            <div style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <IonList style={{ background: 'transparent' }}>
                {section.items.map((item) => (
                  <IonItem key={item.label} button detail={false}
                    onClick={() => history.push(item.path)}
                    style={{ '--background': '#fff' }}
                  >
                    <div slot="start" style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: item.color, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IonIcon icon={item.icon} style={{ fontSize: 16, color: '#fff' }} />
                    </div>
                    <IonLabel style={{ marginLeft: 10 }}>{item.label}</IonLabel>
                    <IonIcon icon={chevronForwardOutline} slot="end" style={{ color: '#C7C7CC', fontSize: 16 }} />
                  </IonItem>
                ))}
              </IonList>
            </div>
          </div>
        ))}

        <p className="section-header">Account</p>
        <div style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <IonList style={{ background: 'transparent' }}>
            <IonItem button detail={false} onClick={() => logout()} style={{ '--background': '#fff' }}>
              <div slot="start" style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#FF3B30', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <IonIcon icon={logOutOutline} style={{ fontSize: 16, color: '#fff' }} />
              </div>
              <IonLabel style={{ marginLeft: 10, color: '#FF3B30', fontWeight: 500 }}>Sign Out</IonLabel>
            </IonItem>
          </IonList>
        </div>
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
