import React from 'react';
import { IonTabs, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect, Switch } from 'react-router-dom';
import TabBar from './TabBar';

import HomePage from '../../pages/Home/HomePage';
import DashboardPage from '../../pages/Dashboard/DashboardPage';
import TenantsPage from '../../pages/Tenants/TenantsPage';
import TenantFormPage from '../../pages/Tenants/TenantFormPage';
import TenantDetailPage from '../../pages/Tenants/TenantDetailPage';
import CompaniesPage from '../../pages/Companies/CompaniesPage';
import BranchesPage from '../../pages/Branches/BranchesPage';
import DepartmentsPage from '../../pages/Departments/DepartmentsPage';
import UsersPage from '../../pages/Users/UsersPage';
import UserFormPage from '../../pages/Users/UserFormPage';
import RolesPage from '../../pages/Roles/RolesPage';
import PermissionsPage from '../../pages/Permissions/PermissionsPage';
import MenusPage from '../../pages/Menus/MenusPage';
import NotificationsPage from '../../pages/Notifications/NotificationsPage';
import AuditLogsPage from '../../pages/AuditLogs/AuditLogsPage';
import SettingsPage from '../../pages/Settings/SettingsPage';
import FileManagerPage from '../../pages/FileManager/FileManagerPage';
import TenantApprovalsPage from '../../pages/Admin/TenantApprovalsPage';

const AppLayout: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Switch>
        <Route exact path="/app/home" component={HomePage} />
        <Route exact path="/app/dashboard" component={DashboardPage} />
        <Route exact path="/app/tenants" component={TenantsPage} />
        <Route exact path="/app/tenants/new" component={TenantFormPage} />
        <Route exact path="/app/tenants/:id" component={TenantDetailPage} />
        <Route exact path="/app/tenants/:id/edit" component={TenantFormPage} />
        <Route exact path="/app/companies" component={CompaniesPage} />
        <Route exact path="/app/branches" component={BranchesPage} />
        <Route exact path="/app/departments" component={DepartmentsPage} />
        <Route exact path="/app/users" component={UsersPage} />
        <Route exact path="/app/users/new" component={UserFormPage} />
        <Route exact path="/app/users/:id/edit" component={UserFormPage} />
        <Route exact path="/app/roles" component={RolesPage} />
        <Route exact path="/app/permissions" component={PermissionsPage} />
        <Route exact path="/app/menus" component={MenusPage} />
        <Route exact path="/app/notifications" component={NotificationsPage} />
        <Route exact path="/app/audit-logs" component={AuditLogsPage} />
        <Route exact path="/app/settings" component={SettingsPage} />
        <Route exact path="/app/files" component={FileManagerPage} />
        <Route exact path="/app/approvals" component={TenantApprovalsPage} />
        <Redirect from="/app" to="/app/home" exact />
      </Switch>
    </IonRouterOutlet>
    <TabBar />
  </IonTabs>
);

export default AppLayout;
