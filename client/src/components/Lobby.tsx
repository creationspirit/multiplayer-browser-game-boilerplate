import React, { Component } from 'react';
import { Client } from 'colyseus.js';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { IRootState } from '../types';
import Navbar from './fragments/Navbar';
import RoomWizard from './fragments/RoomWizard';

export interface ILobbyProps {
  client: Client | null;
}

class Lobby extends Component<ILobbyProps> {
  state = { availableRooms: [], availableBattleRooms: [], selectedRoom: undefined };

  private checkRoomsInterval!: NodeJS.Timeout;

  componentDidMount() {
    this.checkRoomsInterval = setInterval(this.getAvailableRooms, 4000);
    this.getAvailableRooms();
  }

  getAvailableRooms = () => {
    let availableRooms: any[] = [];
    let availableBattleRooms: any[] = [];
    if (this.props.client) {
      (this.props.client as Client).getAvailableRooms('game', rooms => {
        if (rooms) {
          availableRooms = rooms;
        }
        (this.props.client as Client).getAvailableRooms('battle', battleRooms => {
          if (battleRooms) {
            availableBattleRooms = battleRooms;
          }
          this.setState({ availableRooms, availableBattleRooms });
        });
      });
    }
  };

  componentWillUnmount() {
    clearInterval(this.checkRoomsInterval);
  }

  selectRoom = (roomId: string) => {
    this.setState({ selectedRoom: roomId });
  };

  renderAvailableRooms(type: 'battle' | 'game') {
    const rooms = type === 'battle' ? this.state.availableBattleRooms : this.state.availableRooms;
    if (rooms.length === 0) {
      return <div className="item">It seems no one is playing at the moment.</div>;
    }
    return rooms.map((room: any) => {
      const selected = room.roomId === this.state.selectedRoom;
      return (
        <div
          className={`item${selected ? ' selected' : ''}`}
          key={room.roomId}
          onClick={() => this.selectRoom(room.roomId)}
        >
          {selected && (
            <div className="right floated content">
              <Link to={{ pathname: `/game/${room.roomId}`, state: { mode: type } }}>
                <div className="ui primary button">Join</div>
              </Link>
            </div>
          )}
          <div className="content">
            <div className="header">{room.roomId}</div>
            <div className="description">
              {room.clients}/{room.maxClients}
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="ui container">
        <Navbar />
        <div className="ui raised segment">
          <h3 className="ui header">
            <i className="circular inverted users icon" />
            <div className="content">
              Available rooms
              <div className="sub header">Choose one to join</div>
            </div>
          </h3>
          <div className="ui sub header">Co-op rooms</div>
          <div className="ui divided list">{this.renderAvailableRooms('game')}</div>
          <div className="ui sub header">Battle rooms</div>
          <div className="ui divided list">{this.renderAvailableRooms('battle')}</div>
        </div>
        <RoomWizard />
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
)(Lobby);
