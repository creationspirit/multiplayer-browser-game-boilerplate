import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Game from './Game';
// import Lobby from './Lobby';
import { IRootState } from '../types';
import { IActions } from '../actions';
import { connectToGameClient } from '../thunks';
import * as Colyseus from 'colyseus.js';

import './App.css';
import { FresnelParameters } from 'babylonjs';

interface IAppProps {
  client: Colyseus.Client | null;
  connectToClient: () => void;
}

class App extends Component<IAppProps> {
  // This should be refactored in the future, endpoint should be dynamic
  // state = { gameClient: new Colyseus.Client('ws://localhost:4000') };

  componentDidMount() {
    this.props.connectToClient();
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Switch>
              {/* <Route
                  path="/"
                  exact={true}
                  render={() => <Lobby client={this.state.gameClient} />}
                /> */}
              {/* <Route
                path="/game/:roomId"
                exact={true}
                render={() => <Game client={this.state.gameClient} />}
              /> */}
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
  { connectToClient: connectToGameClient }
)(App);
