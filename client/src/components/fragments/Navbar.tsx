import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { IRootState } from '../../types';
import { logout } from '../../thunks/auth';

interface INavbarProps {
  logout: () => void;
}

class Navbar extends Component<INavbarProps> {
  render() {
    return (
      <div className="navbar">
        <div className="navbar-left">
          <h4 className="ui header">
            <i className="icon terminal" />
            <div className="content">
              4332145
              <div className="sub header">Lines of code</div>
            </div>
          </h4>

          <div className="exp-bar">
            <Progress percent={30} indicating={true} progress={true} size="small">
              Level 1
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

const mapStateToProps = ({ gameClient }: IRootState) => {
  return {};
};

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
