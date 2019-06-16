import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { IRootState } from '../types';
import { login } from '../thunks/auth';

interface ILoginProps {
  login: (edgarToken: string) => void;
  loginError: string | null;
  isAuthenticating: boolean;
  isLoggedIn: boolean;
}

class Login extends Component<ILoginProps> {
  state = {
    token: '',
  };

  handleChange = (event: { target: HTMLInputElement }) => {
    this.setState({
      token: event.target.value,
    });
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.login(this.state.token);
  };

  render() {
    const { loginError, isAuthenticating, isLoggedIn } = this.props;

    if (isLoggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <div className="login-content">
        <h2 className="ui center aligned icon header">
          <i className="circular gamepad icon" />
          <div className="content">
            The Game
            <div className="sub header">Submit your Edgar token to enter The Game</div>
          </div>
        </h2>
        <form
          className={`ui massive form ${loginError ? 'error' : ''}`}
          onSubmit={this.handleSubmit}
        >
          <div className={`field ${loginError ? 'error' : ''}`}>
            <div className="ui left icon input">
              <input type="text" placeholder="Token" onChange={this.handleChange} />
              <i className="lock icon" />
            </div>
          </div>
          <button
            type="submit"
            className={`ui fluid orange massive submit button ${isAuthenticating ? 'loading' : ''}`}
          >
            Enter
          </button>
          <div className="ui error small message">{loginError}</div>
        </form>

        <div className="ui message signup-message">
          Don't have a token? <a href="http://localhost:1337">Go to Edgar</a> to create one
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }: IRootState) => {
  return {
    isAuthenticating: auth.isAuthenticating,
    loginError: auth.error,
    isLoggedIn: !!auth.user,
  };
};

export default connect(
  mapStateToProps,
  { login }
)(Login);
