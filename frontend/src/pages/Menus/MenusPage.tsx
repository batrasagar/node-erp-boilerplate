import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { menuService } from '../../services/role.service';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { menuOutline } from 'ionicons/icons';
import { Menu } from '../../types';

const MenuRow: React.FC<{ menu: Menu; depth?: number }> = ({ menu, depth = 0 }) => (
  <>
    <IonItem style={{ '--background': '#fff', '--padding-start': `${16 + depth * 20}px` }}>
      <IonLabel>
        <h3 style={{ fontWeight: depth === 0 ? 600 : 400, fontSize: depth === 0 ? 16 : 14 }}>
          {depth > 0 ? '↳ ' : ''}{menu.name}
        </h3>
        {menu.path && <p style={{ fontSize: 12, color: '#8E8E93', fontFamily: 'monospace' }}>{menu.path}</p>}
        {menu.requiredPermission && <p style={{ fontSize: 11, color: '#007AFF' }}>{menu.requiredPermission}</p>}
      </IonLabel>
      {!menu.isVisible && (
        <span slot="end" style={{ fontSize: 11, padding: '2px 6px', background: '#F2F2F7', borderRadius: 6, color: '#8E8E93' }}>hidden</span>
      )}
    </IonItem>
    {menu.children?.map((child) => <MenuRow key={child.id} menu={child} depth={depth + 1} />)}
  </>
);

const MenusPage: React.FC = () => {
  const { data, isLoading, refetch } = useQuery({ queryKey: ['menus'], queryFn: menuService.list });
  const menus: Menu[] = data || [];

  return (
    <IonPage>
      <IonHeader translucent><IonToolbar><IonTitle>Menus</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}><IonRefresherContent /></IonRefresher>
        <IonHeader collapse="condense"><IonToolbar style={{ '--background': 'transparent' }}><IonTitle size="large">Menus</IonTitle></IonToolbar></IonHeader>
        {isLoading ? <LoadingSkeleton count={6} /> : menus.length === 0 ? (
          <EmptyState title="No Menus" icon={menuOutline} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {menus.map((m) => <MenuRow key={m.id} menu={m} />)}
            </IonList>
          </div>
        )}
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default MenusPage;
