import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as Colyseus from 'colyseus.js';

import Game from './Game';
import Lobby from './Lobby';

import './App.css';

class App extends Component {
  // This should be refactored in the future, endpoint should be dynamic
  state = { gameClient: new Colyseus.Client('ws://localhost:4000') };

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
              <Route
                path="/game/:roomId"
                exact={true}
                render={() => <Game client={this.state.gameClient} />}
              />
            </Switch>
          </div>
        </BrowserRouter>
        )
      </div>
    );
  }
}

export default App;
