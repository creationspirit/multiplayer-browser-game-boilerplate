import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IRootState } from '../types';
import Navbar from './fragments/Navbar';
import { fetchAchievements } from '../thunks/achievements';

export interface IProfileProps {
  fetchAchievements: () => void;
  achievements: any[];
}

class Leaderboard extends Component<IProfileProps> {
  componentDidMount() {
    this.props.fetchAchievements();
  }

  renderAchievements = () => {
    if (this.props.achievements.length === 0) {
      return <p>No available achievements at the moment.</p>;
    }
    const stages = this.props.achievements.map((achievement: any) => {
      return (
        <div
          className={`ui card ${achievement.completed ? 'orange' : 'achievement-uncompleted'}`}
          key={achievement.id}
        >
          <div className="content">
            <div className="header">{achievement.name}</div>
            <div className="meta">{achievement.reward} XP</div>
            <div className="description">{achievement.description}</div>
          </div>
        </div>
      );
    });
    return <div className="ui four cards">{stages}</div>;
  };

  render() {
    return (
      <div className="ui container">
        <Navbar />
        <div className="ui raised segment">
          <h3 className="ui header">
            <i className="gem outline icon" />
            <div className="content">
              Achievements
              <div className="sub header">Display for your hard earned achievements</div>
            </div>
          </h3>
          {this.renderAchievements()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ achievements }: IRootState) => {
  return {
    achievements: achievements.achievements,
  };
};

export default connect(
  mapStateToProps,
  { fetchAchievements }
)(Leaderboard);
