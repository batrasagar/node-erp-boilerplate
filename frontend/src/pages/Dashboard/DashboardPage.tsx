import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonRefresher, IonRefresherContent, IonIcon, IonList, IonItem, IonAvatar, IonLabel,
} from '@ionic/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  peopleOutline, businessOutline, gitBranchOutline,
  layersOutline, shieldCheckmarkOutline, documentTextOutline,
} from 'ionicons/icons';
import { dashboardService } from '../../services/role.service';
import StatCard from '../../components/Common/StatCard';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.stats,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardService.activity,
  });

  const handleRefresh = async (event: CustomEvent) => {
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>

        {statsLoading ? (
          <LoadingSkeleton type="stat" />
        ) : stats ? (
          <>
            <p className="section-header">Overview</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
              <StatCard
                title="Total Users"
                value={stats.users.total}
                subtitle={`${stats.users.active} active`}
                icon={peopleOutline}
                color="#007AFF"
              />
              <StatCard
                title="Companies"
                value={stats.organizations.companies}
                icon={businessOutline}
                color="#34C759"
              />
              <StatCard
                title="Branches"
                value={stats.organizations.branches}
                icon={gitBranchOutline}
                color="#FF9F0A"
              />
              <StatCard
                title="Departments"
                value={stats.organizations.departments}
                icon={layersOutline}
                color="#5856D6"
              />
            </div>

            <p className="section-header" style={{ marginTop: 16 }}>Access Control</p>
            <div style={{ padding: '0 16px' }}>
              <StatCard
                title="Roles"
                value={stats.access.roles}
                subtitle="Active roles"
                icon={shieldCheckmarkOutline}
                color="#FF2D55"
              />
            </div>

            <p className="section-header" style={{ marginTop: 16 }}>Activity (30 days)</p>
            <div style={{ padding: '0 16px', marginBottom: 16 }}>
              <StatCard
                title="Audit Events"
                value={stats.activity.recentLogs}
                subtitle="Last 30 days"
                icon={documentTextOutline}
                color="#FF6B35"
              />
            </div>
          </>
        ) : null}

        <p className="section-header">Recent Activity</p>
        {activityLoading ? (
          <LoadingSkeleton count={5} />
        ) : (
          <div style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {(activity || []).slice(0, 10).map((log) => (
                <IonItem key={log.id} style={{ '--background': '#fff' }}>
                  <IonAvatar slot="start">
                    <div style={{
                      width: 40, height: 40, borderRadius: 20,
                      background: '#F2F2F7', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#007AFF' }}>
                        {log.user?.firstName?.[0] || '?'}
                      </span>
                    </div>
                  </IonAvatar>
                  <IonLabel>
                    <h3 style={{ fontSize: 15, fontWeight: 500 }}>
                      {log.user?.firstName} {log.user?.lastName}
                    </h3>
                    <p style={{ fontSize: 13, color: '#8E8E93' }}>
                      {log.action} {log.resource}
                    </p>
                    <p style={{ fontSize: 12, color: '#C7C7CC' }}>
                      {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </IonLabel>
                  <div slot="end">
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: log.status === 'success' ? '#34C75920' : '#FF3B3020',
                      color: log.status === 'success' ? '#34C759' : '#FF3B30',
                    }}>
                      {log.status}
                    </span>
                  </div>
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

export default DashboardPage;
