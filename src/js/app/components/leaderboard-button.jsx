import React from 'react';

class LeaderboardButton extends React.Component {
  constructor(props) {
    super(props);
    this._onActivate = this._onActivate.bind(this);
  }

  _onActivate() {
    if (this.props.onActivate) {
      this.props.onActivate();
    }
  }

  render() {
    return (
      <button
        className={this.props.isActive ? 'active' : ''}
        onClick={this._onActivate}
      >
        {this.props.label}
      </button>
    );
  }
}

export default LeaderboardButton;
