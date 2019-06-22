import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IRootState } from '../types';
import Navbar from './fragments/Navbar';
import { fetchUsers } from '../thunks/users';

export interface IProfileProps {
  fetchUsers: () => void;
  users: any[];
  loading: boolean;
}

class Leaderboard extends Component<IProfileProps> {
  state = { selected: undefined };

  componentDidMount() {
    this.props.fetchUsers();
  }

  selectUser = (userId: number) => {
    this.setState({ selected: userId });
  };

  renderAchievements = (user: any) => {
    if (user.achievements.length === 0) {
      return <p>{user.firstName} doesn't have any achievements yet.</p>;
    }
    return user.achievements.map((achievement: any) => {
      return (
        <div className="item" key={`${user.id}-ach${achievement.id}`}>
          <div className="content">
            <div className="header">{achievement.name}</div>
            <div className="description">{achievement.description}</div>
          </div>
        </div>
      );
    });
  };

  renderLeaderboard = () => {
    if (this.props.users.length === 0) {
      return <div className="ui segment">No users.</div>;
    }
    const sortedUsers = this.props.users.sort((a, b) => {
      return a.stats.accumulatedLoc < b.stats.accumulatedLoc ? 1 : -1;
    });
    return sortedUsers.map((user: any, index: number) => {
      if (this.state.selected === user.id) {
        return (
          <div className="leaderboard-item-wrapper" key={user.id}>
            <h1>{index + 1}.</h1>
            <div className="ui segment orange leaderboard-item-selected">
              <h2 className="ui header">
                <div className="content">
                  {user.firstName} {user.lastName}
                </div>
              </h2>
              <div className="ui four small statistics">
                <div className="ui statistic">
                  <div className="value">{user.stats.level}</div>
                  <div className="label">Level</div>
                </div>
                <div className="ui statistic">
                  <div className="value">{user.stats.accumulatedLoc}</div>
                  <div className="label">LOC</div>
                </div>
                <div className="ui statistic">
                  <div className="value">{user.stats.coopMatches}</div>
                  <div className="label">Co-op matches won</div>
                </div>
                <div className="ui statistic">
                  <div className="value">{user.stats.battleMatches}</div>
                  <div className="label">Battle matches won</div>
                </div>
              </div>
              <h4 className="ui header">
                <i className="gem outline icon" />
                <div className="content">Achievements</div>
              </h4>
              <div className="ui middle aligned divided list">{this.renderAchievements(user)}</div>
            </div>
          </div>
        );
      }

      return (
        <div className="leaderboard-item-wrapper" key={user.id}>
          <h1>{index + 1}.</h1>
          <div className="ui segment leaderboard-item" onClick={() => this.selectUser(user.id)}>
            <h3 className="ui header">
              <div className="content">
                {user.firstName} {user.lastName}
                <div className="sub header">Level {user.stats.level}</div>
              </div>
            </h3>
            <div className="ui tiny right floated statistic">
              <div className="value">{user.stats.accumulatedLoc}</div>
              <div className="label">LOC</div>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="ui container">
        <Navbar />
        <h3 className="ui header">
          <i className="chart line icon" />
          <div className="content">Global rankings</div>
        </h3>
        {this.props.loading ? (
          <div className="ui active centered inline loader" />
        ) : (
          this.renderLeaderboard()
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ users }: IRootState) => {
  return {
    users: users.users,
    loading: users.loading,
  };
};

export default connect(
  mapStateToProps,
  { fetchUsers }
)(Leaderboard);
