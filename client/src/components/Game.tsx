import * as React from 'react';

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import * as Colyseus from 'colyseus.js';

import CodeEditor from './CodeEditor';
import BabylonScene, { ISceneEventArgs } from './Scene';
import { RouterService } from '../game/routing/routerService';
import { Game } from '../game/Game';

export interface IGameProps {
  client: Colyseus.Client;
}

export default class PageWithScene extends React.Component<IGameProps, {}> {
  state = { taskInProgress: false };

  private game!: Game;

  onSceneMount = (args: ISceneEventArgs) => {
    const { canvas, scene, engine } = args;

    this.game = new Game(
      args,
      this.props.client,
      this.setTaskInProgress,
      this.removeTaskInProgress
    );
    this.game.load();
    this.game.start();
  };

  setTaskInProgress = () => {
    this.setState({ taskInProgress: true });
  };

  removeTaskInProgress = () => {
    this.setState({ taskInProgress: false });
  };

  render() {
    return (
      <div>
        <BabylonScene
          onSceneMount={this.onSceneMount}
          adaptToDeviceRatio={true}
          height={'650'}
          width={'1200'}
        />
        {this.state.taskInProgress && <CodeEditor />}
      </div>
    );
  }
}
