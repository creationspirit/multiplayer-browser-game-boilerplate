import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

export interface IProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
  authenticationPath: string;
}

export class ProtectedRoute extends Route<IProtectedRouteProps> {
  render() {
    let redirectPath: string = '';
    if (!this.props.isAuthenticated) {
      redirectPath = this.props.authenticationPath;
    }

    if (redirectPath) {
      const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
      return <Route {...this.props} component={renderComponent} render={undefined} />;
    } else {
      return <Route {...this.props} />;
    }
  }
}
