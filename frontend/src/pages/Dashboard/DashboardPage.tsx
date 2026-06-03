import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonRefresher, IonRefresherContent, IonIcon, IonButton,
  IonList, IonItem, IonAvatar, IonLabel,
} from '@ionic/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  peopleOutline, businessOutline, gitBranchOutline,
  layersOutline, shieldCheckmarkOutline, documentTextOutline,
  addOutline, checkmarkCircleOutline, folderOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { dashboardService, notificationService } from '../../services/role.service';
import { kycService } from '../../services/kyc.service';
import { useAuthStore } from '../../stores/authStore';
import StatCard from '../../components/Common/StatCard';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);

  const canSeeUsers    = hasPermission('users.read');
  const canSeeOrgs     = hasPermission('companies.read');
  const canSeeApprovals = hasPermission('approvals.read');
  const canSeeAudit    = hasPermission('audit_logs.read');
  const canAddUsers    = hasPermission('users.create');
  const canSeeFiles    = hasPermission('files.read');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.stats,
    enabled: canSeeUsers || canSeeOrgs || canSeeAudit,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardService.activity,
    enabled: canSeeAudit,
  });

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['kyc-pending-count'],
    queryFn: kycService.pendingCount,
    enabled: canSeeApprovals,
    refetchInterval: 30000,
  });

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.unreadCount,
    refetchInterval: 30000,
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

        {statsLoading ? <LoadingSkeleton type="stat" /> : (
          <>
            {/* Users block */}
            {canSeeUsers && stats && (
              <>
                <p className="section-header">Users</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
                  <StatCard title="Total Users" value={stats.users.total} subtitle={`${stats.users.active} active`} icon={peopleOutline} color="#007AFF" />
                  <StatCard title="Inactive" value={stats.users.inactive} subtitle="accounts" icon={peopleOutline} color="#8E8E93" />
                </div>
              </>
            )}

            {/* Org block */}
            {canSeeOrgs && stats && (
              <>
                <p className="section-header" style={{ marginTop: 16 }}>Organisation</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
                  <StatCard title="Companies" value={stats.organizations.companies} icon={businessOutline} color="#34C759" />
                  <StatCard title="Branches" value={stats.organizations.branches} icon={gitBranchOutline} color="#FF9F0A" />
                  <StatCard title="Departments" value={stats.organizations.departments} icon={layersOutline} color="#5856D6" />
                  <StatCard title="Roles" value={stats.access.roles} subtitle="Active roles" icon={shieldCheckmarkOutline} color="#FF2D55" />
                </div>
              </>
            )}

            {/* Approvals block */}
            {canSeeApprovals && (
              <>
                <p className="section-header" style={{ marginTop: 16 }}>Approvals</p>
                <div style={{ padding: '0 16px' }}>
                  <StatCard
                    title="Pending KYC"
                    value={pendingCount}
                    subtitle={pendingCount > 0 ? 'Requires attention' : 'All clear'}
                    icon={checkmarkCircleOutline}
                    color={pendingCount > 0 ? '#FF9500' : '#34C759'}
                  />
                </div>
              </>
            )}

            {/* Notifications */}
            <p className="section-header" style={{ marginTop: 16 }}>Notifications</p>
            <div style={{ padding: '0 16px' }}>
              <StatCard
                title="Unread"
                value={unreadData?.count || 0}
                subtitle="notifications"
                icon={documentTextOutline}
                color="#007AFF"
              />
            </div>

            {/* Audit */}
            {canSeeAudit && stats && (
              <>
                <p className="section-header" style={{ marginTop: 16 }}>Activity (30 days)</p>
                <div style={{ padding: '0 16px' }}>
                  <StatCard title="Audit Events" value={stats.activity.recentLogs} subtitle="Last 30 days" icon={documentTextOutline} color="#FF6B35" />
                </div>
              </>
            )}
          </>
        )}

        {/* Quick Actions */}
        <p className="section-header" style={{ marginTop: 16 }}>Quick Actions</p>
        <div style={{ padding: '0 16px', display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
          {canAddUsers && (
            <QuickAction label="Add User" icon={addOutline} color="#007AFF" onTap={() => history.push('/app/users/new')} />
          )}
          {canSeeApprovals && pendingCount > 0 && (
            <QuickAction label={`${pendingCount} Pending`} icon={checkmarkCircleOutline} color="#FF9500" onTap={() => history.push('/app/approvals')} />
          )}
          {canSeeFiles && (
            <QuickAction label="Files" icon={folderOutline} color="#32ADE6" onTap={() => history.push('/app/files')} />
          )}
          {canSeeOrgs && (
            <QuickAction label="Companies" icon={businessOutline} color="#34C759" onTap={() => history.push('/app/companies')} />
          )}
        </div>

        {/* Recent Activity — admin/audit only */}
        {canSeeAudit && (
          <>
            <p className="section-header" style={{ marginTop: 8 }}>Recent Activity</p>
            {activityLoading ? <LoadingSkeleton count={4} /> : (
              <div style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <IonList style={{ background: 'transparent' }}>
                  {(activity || []).slice(0, 8).map((log) => (
                    <IonItem key={log.id} style={{ '--background': '#fff' }}>
                      <IonAvatar slot="start">
                        <div style={{ width: 40, height: 40, borderRadius: 20, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: '#007AFF' }}>{log.user?.firstName?.[0] || '?'}</span>
                        </div>
                      </IonAvatar>
                      <IonLabel>
                        <h3 style={{ fontSize: 15, fontWeight: 500 }}>{log.user?.firstName} {log.user?.lastName}</h3>
                        <p style={{ fontSize: 13, color: '#8E8E93' }}>{log.action} {log.resource}</p>
                        <p style={{ fontSize: 12, color: '#C7C7CC' }}>{format(new Date(log.createdAt), 'MMM d, h:mm a')}</p>
                      </IonLabel>
                      <div slot="end">
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: log.status === 'success' ? '#34C75920' : '#FF3B3020', color: log.status === 'success' ? '#34C759' : '#FF3B30' }}>
                          {log.status}
                        </span>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            )}
          </>
        )}

        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

const QuickAction: React.FC<{ label: string; icon: string; color: string; onTap: () => void }> = ({ label, icon, color, onTap }) => (
  <IonButton fill="outline" size="small" onClick={onTap} style={{ '--border-radius': '10px', '--border-color': color, '--color': color, fontSize: 13 }}>
    <IonIcon slot="start" icon={icon} />
    {label}
  </IonButton>
);

export default DashboardPage;
