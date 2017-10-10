import React from 'react';
import LeaderboardButton from './components/leaderboard-button.jsx';
import LeaderboardTable from './components/leaderboard-table.jsx';
import LeaderboardService from './../api/leaderboard-service.js';
import SortCriteria from './../api/sort-criteria.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //  Overrides component sort order whenever leaderboard data changes
      initialSortCriteria: null,
      leaderboardData: null,
      showAlltime: false
    };

    this._fetchAlltime = this._fetchAlltime.bind(this);
    this._fetchRecent = this._fetchRecent.bind(this);
    this._updateData = this._updateData.bind(this);

    this._alltimeLeaderboardData = null;
    this._recentLeaderboardData = null;
  }

  componentWillMount() {
    this._fetchRecent();
  }

  _fetchAlltime() {
    this.setState({
      initialSortCriteria: SortCriteria.ALLTIME,
      showAlltime: true
    });

    if (this._alltimeLeaderboardData === null) {
      LeaderboardService.getAlltimeLeaderboards(data => {
        this._alltimeLeaderboardData = data;
        this._updateData(this._alltimeLeaderboardData);
      });
    } else {
      this._updateData(this._alltimeLeaderboardData);
    }
  }

  _fetchRecent() {
    this.setState({
      initialSortCriteria: SortCriteria.RECENT,
      showAlltime: false
    });

    if (this._recentLeaderboardData === null) {
      LeaderboardService.getRecentLeaderboards(data => {
        this._recentLeaderboardData = data;
        this._updateData(this._recentLeaderboardData);
      });
    } else {
      this._updateData(this._recentLeaderboardData);
    }
  }

  _updateData(data) {
    this.setState({
      leaderboardData: data
    });
  }

  render() {
    return (
      <div>
        <h1>freeCodeCamp Leaderboard</h1>
        <LeaderboardButton
          label="Past 30 Days"
          isActive={!this.state.showAlltime}
          onActivate={this._fetchRecent}
        />
        <LeaderboardButton
          label="All-time"
          isActive={this.state.showAlltime}
          onActivate={this._fetchAlltime}
        />
        <LeaderboardTable
          leaderboardData={this.state.leaderboardData}
          initialSortCriteria={this.state.initialSortCriteria}
        />
      </div>
    );
  }
}

export default App;
