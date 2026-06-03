import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonItem, IonLabel, IonAvatar, IonBadge, IonFab, IonFabButton,
  IonIcon, IonRefresher, IonRefresherContent, IonButtons, IonButton,
  IonItemSliding, IonItemOptions, IonItemOption, IonAlert,
} from '@ionic/react';
import { add, personOutline, chevronForwardOutline, trashOutline } from 'ionicons/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { userService } from '../../services/user.service';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { usePermission } from '../../hooks/usePermission';
import { User } from '../../types';

const UsersPage: React.FC = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const canCreate = usePermission('users.create');
  const canDelete = usePermission('users.delete');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userService.list({ search, limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const users = data?.data || [];

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Users</IonTitle>
          <IonButtons slot="end">
            {canCreate && (
              <IonButton onClick={() => history.push('/app/users/new')} strong>
                <IonIcon icon={add} slot="icon-only" />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value || '')}
            placeholder="Search users..."
            animated
          />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Users</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : users.length === 0 ? (
          <EmptyState
            title="No Users Found"
            description="Add your first team member to get started"
            icon={personOutline}
            actionLabel={canCreate ? 'Add User' : undefined}
            onAction={canCreate ? () => history.push('/app/users/new') : undefined}
          />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {users.map((user) => (
                <IonItemSliding key={user.id}>
                  <IonItem
                    button
                    detail={false}
                    onClick={() => history.push(`/app/users/${user.id}/edit`)}
                    style={{ '--background': '#fff' }}
                  >
                    <IonAvatar slot="start">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.firstName} style={{ borderRadius: '50%' }} />
                      ) : (
                        <div style={{
                          width: 40, height: 40, borderRadius: 20, background: '#007AFF20',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#007AFF' }}>
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                      )}
                    </IonAvatar>
                    <IonLabel>
                      <h3 style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</h3>
                      <p>{user.email}</p>
                      {user.roles && user.roles.length > 0 && (
                        <p style={{ fontSize: 12, color: '#8E8E93' }}>
                          {user.roles.map((r) => r.name).join(', ')}
                        </p>
                      )}
                    </IonLabel>
                    <div slot="end" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IonBadge color={user.status === 'active' ? 'success' : 'medium'} style={{ fontSize: 11 }}>
                        {user.status}
                      </IonBadge>
                      <IonIcon icon={chevronForwardOutline} style={{ color: '#C7C7CC', fontSize: 16 }} />
                    </div>
                  </IonItem>
                  {canDelete && (
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => setDeleteTarget(user)}>
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonItemOption>
                    </IonItemOptions>
                  )}
                </IonItemSliding>
              ))}
            </IonList>
          </div>
        )}

        <IonAlert
          isOpen={!!deleteTarget}
          onDidDismiss={() => setDeleteTarget(null)}
          header="Deactivate User"
          message={`Are you sure you want to deactivate ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Deactivate',
              role: 'destructive',
              handler: () => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id); },
            },
          ]}
        />

        <div style={{ height: 100 }} />
      </IonContent>
    </IonPage>
  );
};

export default UsersPage;
