import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface KycGuardProps extends RouteProps {
  component: React.ComponentType<any>;
}

const KycGuard: React.FC<KycGuardProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, kycStatus } = useAuthStore();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) return <Redirect to="/login" />;
        if (!kycStatus || kycStatus === 'not_submitted' || kycStatus === 'rejected') {
          return <Redirect to="/app/kyc" />;
        }
        if (kycStatus === 'pending' || kycStatus === 'under_review') {
          return <Redirect to="/app/kyc/pending" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default KycGuard;
