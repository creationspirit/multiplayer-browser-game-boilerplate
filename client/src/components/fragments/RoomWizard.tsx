import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Progress } from 'semantic-ui-react';

import { IRootState } from '../../types';
import { fetchStages } from '../../thunks/stages';

interface IRoomWizardProps {
  loading: boolean;
  stages: [];
  error: string | null;
  fetchStages: () => void;
}

class RoomWizard extends Component<IRoomWizardProps> {
  state = { stage: null, difficulty: null, mode: null };

  componentDidMount() {
    this.props.fetchStages();
  }

  setStage = (stageId: number) => {
    this.setState({ stage: stageId });
  };

  setDifficulty = (difficultyId: number) => {
    this.setState({ difficulty: difficultyId });
  };

  setMode = (modeId: number) => {
    this.setState({ mode: modeId });
  };

  renderStages = () => {
    if (this.props.stages.length === 0) {
      return <p>No available stages at the moment.</p>;
    }

    const stages = this.props.stages.map((stage: any) => {
      return (
        <div
          className={`ui card ${this.state.stage === stage.edgarId ? 'raised stage-selected' : ''}`}
          key={stage.edgarId}
          onClick={() => this.setStage(stage.edgarId)}
        >
          <div className="content">
            <div className="header">{stage.title}</div>
            <div className="description">{stage.description}</div>
          </div>
          <div className="extra content">
            <Progress percent={30} indicating={true} size="tiny" />
            <span className="right floated">Beginner</span>
            <span>
              <i className="terminal icon" />
              124 LOC
            </span>
          </div>
        </div>
      );
    });

    return <div className="ui four cards">{stages}</div>;
  };

  renderDifficulty = () => {
    return (
      <div className="room-wizard-difficulty">
        <div className="ui sub header">Choose difficulty</div>
        <button
          className={`fluid ui button ${this.state.difficulty === 1 ? 'orange' : ''}`}
          onClick={() => this.setDifficulty(1)}
        >
          Beginner
        </button>
        <button
          className={`fluid ui button ${this.state.difficulty === 2 ? 'orange' : ''}`}
          onClick={() => this.setDifficulty(2)}
        >
          Intermediate
        </button>
        <button
          className={`fluid ui button ${this.state.difficulty === 3 ? 'orange' : ''}`}
          onClick={() => this.setDifficulty(3)}
        >
          Master
        </button>
      </div>
    );
  };

  renderMode = () => {
    return (
      <div className="room-wizard-mode">
        <div className="ui sub header">Choose mode</div>
        <button
          className={`fluid ui button ${this.state.mode === 1 ? 'orange' : ''}`}
          onClick={() => this.setMode(1)}
        >
          Co-op
        </button>
        <button
          className={`fluid ui button ${this.state.mode === 2 ? 'orange' : ''}`}
          onClick={() => this.setMode(2)}
        >
          Battle
        </button>
      </div>
    );
  };

  render() {
    return (
      <div className="ui raised segment create-room-segment">
        <h3 className="ui header">Create new room</h3>
        <div className="ui sub header">Choose stage</div>
        {this.renderStages()}
        {this.state.stage && this.renderDifficulty()}
        {this.state.difficulty && this.renderMode()}
        {this.state.mode && (
          <Link to={{ pathname: '/game/new', state: this.state }}>
            <div className="ui primary fluid large button">Create new room</div>
          </Link>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ stages }: IRootState) => {
  return {
    loading: stages.loading,
    stages: stages.stages,
    error: stages.error,
  };
};

export default connect(
  mapStateToProps,
  { fetchStages }
)(RoomWizard);
