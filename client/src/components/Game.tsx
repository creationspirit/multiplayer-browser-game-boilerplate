import * as React from 'react';

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import * as Colyseus from 'colyseus.js';

import CodeEditor from './CodeEditor';
import BabylonScene, { ISceneEventArgs } from './Scene';
import { RouterService } from '../game/routing/routerService';
import { Game } from '../game/Game';
import { Pickup } from '../game/Pickup';

export interface IGameProps {
  client: Colyseus.Client;
}

export default class PageWithScene extends React.Component<IGameProps, {}> {
  state = { taskInProgress: false, question: null };

  private game!: Game;

  onSceneMount = (args: ISceneEventArgs) => {
    this.game = new Game(
      args,
      this.props.client,
      this.setTaskInProgress,
      this.removeTaskInProgress,
      this.setQuestion
    );
    this.game.load();
    this.game.start();
  };

  setTaskInProgress = () => {
    this.setState({ taskInProgress: true });
  };

  setQuestion = (question: any) => {
    this.setState({ question, taskInProgress: true });
  };

  removeTaskInProgress = () => {
    this.game.player.isSolving = false;
    this.setState({ taskInProgress: false });
  };

  onSourceCodeChange = (value: string) => {
    this.game.router.sendSolutionUpdate((this.game.player.inSolvingAreaOf as Pickup).id, value);
  };

  onSubmit = () => {
    this.game.router.sendSolveAttempt((this.game.player.inSolvingAreaOf as Pickup).id);
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
        {this.state.taskInProgress && (
          <CodeEditor
            onSourceCodeChange={this.onSourceCodeChange}
            question={this.state.question}
            onCancel={this.removeTaskInProgress}
            onSubmit={this.onSubmit}
          />
        )}
      </div>
    );
  }
}
