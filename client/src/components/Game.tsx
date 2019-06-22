import * as React from 'react';

import * as Colyseus from 'colyseus.js';
import { connect } from 'react-redux';

import CodeEditor from './CodeEditor';
import BabylonScene, { ISceneEventArgs } from './Scene';
import { RouterService } from '../game/routing/routerService';
import { Game } from '../game/Game';
import { Pickup } from '../game/Pickup';
import { IRootState } from '../types';
import { GameStatus } from '../constants';

export interface IGameProps {
  client: Colyseus.Client | null;
  match: { params: { roomId: string } };
  user: any;
  location: { state: any };
  history: any;
}

class PageWithScene extends React.Component<IGameProps> {
  state = { taskInProgress: false, question: null, gameResult: null };

  private game!: Game;

  onSceneMount = (args: ISceneEventArgs) => {
    this.game = new Game(
      args,
      this.props.client as Colyseus.Client,
      this.props.match.params.roomId,
      this.props.location.state,
      this.setTaskInProgress,
      this.removeTaskInProgress,
      this.setQuestion,
      this.resetState,
      this.setGameResult
    );
    this.game.load();
    this.game.start();
  };

  componentWillUnmount() {
    this.game.router.room.leave();
  }

  setTaskInProgress = () => {
    this.setState({ taskInProgress: true });
  };

  resetState = (questionId: number) => {
    if (this.state.question && (this.state.question as any).id === questionId) {
      this.setState({ taskInProgress: false, question: null });
    }
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

  setGameResult = (gameResult: string) => {
    this.setState({ gameResult });
  };

  returnHome = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="game-wrapper">
        <BabylonScene
          onSceneMount={this.onSceneMount}
          adaptToDeviceRatio={true}
          // height={'600'}
          // width={'1200'}
        />
        {this.state.gameResult && (
          <GameResult
            hasWon={this.state.gameResult === GameStatus.WIN ? true : false}
            returnHome={this.returnHome}
          />
        )}
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

interface IGameResultProps {
  hasWon: boolean;
  returnHome: () => void;
}

const GameResult = ({ hasWon, returnHome }: IGameResultProps) => {
  return (
    <div className="game-result">
      <div className="ui center aligned segment">
        <h2 className="ui icon header">
          <i className={hasWon ? 'trophy icon' : 'frown outline icon'} />
          <div className="content">
            {hasWon ? "Congratulations! You've won!" : 'You lost...but you can always try again.'}
          </div>
        </h2>
        <div className="ui orange button" onClick={returnHome}>
          Return home
        </div>
      </div>
    </div>
  );
};

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
