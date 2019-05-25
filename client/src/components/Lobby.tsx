import React, { Component } from 'react';
import { Client } from 'colyseus.js';

export interface ILobbyProps {
  client?: Client;
}

class Lobby extends Component<ILobbyProps, {}> {
  create = () => {
    if (this.props.client) {
      this.props.client.join('game', { create: true });
    }
  };

  render() {
    if (this.props.client) {
      this.props.client.getAvailableRooms('game', (rooms, err) => {
        console.log('rooms', rooms);
      });
    }

    return (
      <div className="ui container raised segments">
        <div className="ui segment">
          <div className="ui buttons">
            <button className="ui button" onClick={this.create}>
              Create
            </button>
            <button className="ui button">Join</button>
          </div>
        </div>
        <div className="ui segments">
          <div className="ui segment">
            <div className="ui relaxed divided list">
              <div className="item">
                <div className="content">
                  <div className="header">Room 1</div>
                  <div className="description">2/4 clients</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">Room 2</div>
                  <div className="description">1/4 clients</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">Room 3</div>
                  <div className="description">3/4 clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
