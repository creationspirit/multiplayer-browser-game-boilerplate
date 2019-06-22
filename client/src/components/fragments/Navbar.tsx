import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { IRootState } from '../../types';
import { logout } from '../../thunks/auth';

interface INavbarProps {
  logout: () => void;
  user: any;
}

class Navbar extends Component<INavbarProps> {
  render() {
    const { user } = this.props;
    return (
      <div className="navbar">
        <div className="navbar-left">
          <h4 className="ui header">
            <i className="icon terminal" />
            <div className="content">
              {user.stats.loc}
              <div className="sub header">Lines of code</div>
            </div>
          </h4>

          <div className="exp-bar">
            <Progress value={user.stats.experience} indicating={true} progress={true} size="small">
              Level {user.stats.level}
            </Progress>
          </div>
        </div>
        <div className="ui secondary menu menu-header">
          <Link to="/" className="ui item">
            Home
          </Link>
          <Link to="/me" className="ui item">
            Profile
          </Link>
          <Link to="/leaderboard" className="ui item">
            Leaderboard
          </Link>
          <Link to="/store" className="ui item">
            Store
          </Link>
          <a className="ui item" onClick={this.props.logout}>
            Logout
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }: IRootState) => {
  return { user: auth.user };
};

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
