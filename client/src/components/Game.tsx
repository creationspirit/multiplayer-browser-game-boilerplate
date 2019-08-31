import * as React from 'react';
import * as Colyseus from 'colyseus.js';
import { connect } from 'react-redux';

import BabylonScene, { ISceneEventArgs } from './Scene';
import { RouterService } from '../game/routing/routerService';
import { World } from '../game/World';
import { IRootState } from '../types';

export interface IGameProps {
  client: Colyseus.Client | null;
  match: { params: { roomId: string } };
}

class PageWithScene extends React.Component<IGameProps> {

  private world!: World;
  private routerService!: RouterService

  onSceneMount = (args: ISceneEventArgs) => {
    this.world = new World(args);
    this.world.run();
    this.routerService = new RouterService(
      this.props.client as Colyseus.Client,
      this.world,
      this.props.match.params.roomId
    );
    this.routerService.connect();
    this.world.associateRouterService(this.routerService);
  };

  componentWillUnmount() {
    this.routerService.room.leave();
  }

  render() {
    return (
      <div className="game-wrapper">
        <BabylonScene
          onSceneMount={this.onSceneMount}
          adaptToDeviceRatio={true}
          // height={'600'}
          // width={'1200'}
        />
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
  null
)(PageWithScene);
