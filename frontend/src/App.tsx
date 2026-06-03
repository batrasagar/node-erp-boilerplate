import { IonApp, IonRouterOutlet, IonToast, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './utils/queryClient';

/* Core Ionic CSS */
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
import { useUIStore } from './stores/uiStore';

setupIonicReact({
  mode: 'ios',
  animated: true,
  hardwareBackButton: false,
  swipeBackEnabled: true,
});

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
            <Route path="/login" component={LoginPage} exact />
            <ProtectedRoute path="/app" component={AppLayout} />
            <Redirect from="/" to="/app/home" exact />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    {import.meta.env.DEV && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export default App;
