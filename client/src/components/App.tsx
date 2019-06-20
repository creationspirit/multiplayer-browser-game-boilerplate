import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';

import Game from './Game';
import Lobby from './Lobby';
import Login from './Login';
import Profile from './Profile';
import { ProtectedRoute, IProtectedRouteProps } from './fragments/ProtectedRoute';
import { IRootState } from '../types';
import { connectToGameClient } from '../thunks';
import { fetchUserData } from '../thunks/auth';
import * as Colyseus from 'colyseus.js';

import './App.scss';

interface IAppProps {
  client: Colyseus.Client | null;
  user: {} | null;
  connectToGameClient: () => void;
  fetchUserData: () => void;
}

class App extends Component<IAppProps> {
  componentDidMount() {
    this.props.fetchUserData();
  }

  componentDidUpdate(prevProps: IAppProps) {
    console.log('update');
    if (this.props.user && !this.props.client) {
      this.props.connectToGameClient();
    }
  }

  render() {
    const { user } = this.props;

    const defaultProtectedRouteProps: IProtectedRouteProps = {
      isAuthenticated: !!user,
      authenticationPath: '/login',
    };

    return (
      <div className="App">
        <BrowserRouter>
          <div className="router-wrapper">
            <Switch>
              <Route path="/login" exact={true} component={Login} />
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                path="/"
                exact={true}
                component={Lobby}
              />
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                path="/game/:roomId"
                exact={true}
                component={Game}
              />
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                path="/me"
                exact={true}
                component={Profile}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = ({ gameClient, auth }: IRootState) => {
  return {
    user: auth.user,
    client: gameClient.client,
  };
};

export default connect(
  mapStateToProps,
  { connectToGameClient, fetchUserData }
)(App);
