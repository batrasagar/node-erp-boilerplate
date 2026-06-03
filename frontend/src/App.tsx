import React from 'react';
import { IonApp, IonRouterOutlet, IonToast, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './utils/queryClient';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/global.css';

import LoginPage from './pages/Login/LoginPage';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import KycGuard from './components/Auth/KycGuard';
import LandingPage from './pages/Marketing/LandingPage';
import SignupLayout from './pages/Signup/SignupLayout';
import KycPage from './pages/KYC/KycPage';
import KycPendingPage from './pages/KYC/KycPendingPage';
import { useUIStore } from './stores/uiStore';

setupIonicReact({ mode: 'ios', animated: true, hardwareBackButton: false, swipeBackEnabled: true });

const GlobalToasts: React.FC = () => {
  const { toasts, dismissToast } = useUIStore();
  return (
    <>
      {toasts.map((t) => (
        <IonToast
          key={t.id}
          isOpen
          message={t.message}
          duration={t.duration}
          color={t.type === 'error' ? 'danger' : t.type === 'success' ? 'success' : t.type === 'warning' ? 'warning' : 'medium'}
          position="top"
          onDidDismiss={() => dismissToast(t.id)}
        />
      ))}
    </>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <GlobalToasts />
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Switch>
            <Route path="/" component={LandingPage} exact />
            <Route path="/login" component={LoginPage} exact />
            <Route path="/signup" component={SignupLayout} />
            <ProtectedRoute path="/app/kyc/pending" component={KycPendingPage} exact />
            <ProtectedRoute path="/app/kyc" component={KycPage} exact />
            <KycGuard path="/app" component={AppLayout} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    {import.meta.env.DEV && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export default App;
