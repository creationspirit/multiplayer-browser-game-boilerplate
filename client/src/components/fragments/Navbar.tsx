import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';
import { connect } from 'react-redux';

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
          <a className="ui item">Profile</a>
          <a className="ui item">Store</a>
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
