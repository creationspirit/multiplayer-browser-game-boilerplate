import * as React from 'react';

import * as Colyseus from 'colyseus.js';
import { connect } from 'react-redux';

import CodeEditor from './CodeEditor';
import BabylonScene, { ISceneEventArgs } from './Scene';
import { RouterService } from '../game/routing/routerService';
import { Game } from '../game/Game';
import { Pickup } from '../game/Pickup';
import { IRootState } from '../types';

export interface IGameProps {
  client: Colyseus.Client | null;
  match: { params: { roomId: string } };
  user: any;
  location: { state: any };
}

class PageWithScene extends React.Component<IGameProps> {
  state = { taskInProgress: false, question: null };

  private game!: Game;

  onSceneMount = (args: ISceneEventArgs) => {
    console.log(this.props.location);

    this.game = new Game(
      args,
      this.props.client as Colyseus.Client,
      this.props.match.params.roomId,
      this.props.location.state,
      this.setTaskInProgress,
      this.removeTaskInProgress,
      this.setQuestion
    );
    this.game.load();
    this.game.start();
  };

  componentWillUnmount() {
    this.game.router.room.leave();
    this.game.scene.dispose();
  }

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

  onCollectReward = () => {
    this.game.router.sendCollectReward((this.game.player.inSolvingAreaOf as Pickup).id);
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
            onCollectReward={this.onCollectReward}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ gameClient, auth }: IRootState) => {
  return {
    client: gameClient.client,
    user: auth.user,
  };
};

export default connect(
  mapStateToProps,
  null
)(PageWithScene);
