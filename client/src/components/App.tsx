import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Colyseus from 'colyseus.js';

import { IRootState } from '../types';
import Game from './Game';
import { connectToGameClient } from '../thunks';
import Lobby from './Lobby';

import './App.scss';

interface IAppProps {
  connectToGameClient: () => void;
  client: Colyseus.Client | null,
}

class App extends Component<IAppProps> {
  componentDidMount() {
    this.props.connectToGameClient();
  }

  render() {
    if(!this.props.client) {
      return null;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <div className="router-wrapper">
            <Switch>
              <Route
                path="/"
                exact={true}
                component={Lobby}
              />
              <Route
                path="/game/:roomId"
                exact={true}
                component={Game}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = ({ gameClient }: IRootState) => {
  return {
    client: gameClient.client,
  };
};

export default connect(
  mapStateToProps,
  { connectToGameClient, }
)(App);
