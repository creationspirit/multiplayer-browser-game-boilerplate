import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Game from './Game';
import Lobby from './Lobby';
import { IRootState } from '../types';
import { connectToGameClient } from '../thunks';
import * as Colyseus from 'colyseus.js';

import './App.css';

interface IAppProps {
  client: Colyseus.Client | null;
  connectToClient: () => void;
}

class App extends Component<IAppProps> {
  // This should be refactored in the future, endpoint should be dynamic
  // state = { gameClient: new Colyseus.Client('ws://localhost:4000') };
  canRender = false;
  state = { canRender: false };

  componentDidMount() {
    this.props.connectToClient();
  }

  componentDidUpdate(prevProps: IAppProps) {
    if (this.props.client && !prevProps.client) {
      console.log(this.props.client);
      console.log('can render now');
      this.setState({ canRender: true });
    }
  }

  render() {
    if (!this.state.canRender) {
      return <div>Loading...</div>;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Switch>
              <Route path="/" exact={true} component={Lobby} />
              <Route path="/game/:roomId" exact={true} component={Game} />
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
