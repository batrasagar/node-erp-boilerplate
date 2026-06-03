import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useIsAuthenticated } from '../../hooks/useAuth';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  permission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
