import React from 'react';
import LeaderboardSort from './../../api/leaderboard-sort.js';
import SortCriteria from './../../api/sort-criteria.js';

class LeaderboardTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboardData: this.props.leaderboardData,
      sortCriteria: this.props.initialSortCriteria || SortCriteria.RECENT,
      //  Reverse sort is ascending
      reverseSort: false
    };

    this._setSortCriteria = this._setSortCriteria.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState((prevState, props) => {
      const dataChanged = prevState.leaderboardData !== props.leaderboardData;

      return {
        sortCriteria: dataChanged
          ? props.initialSortCriteria
          : prevState.sortCriteria,
        reverseSort: dataChanged ? false : prevState.reverseSort
      };
    });
  }

  _setSortCriteria(criteria) {
    this.setState((prevState, props) => {
      if (prevState.sortCriteria !== criteria) {
        return {
          sortCriteria: criteria,
          reverseSort: false
        };
      } else {
        return {
          reverseSort: !prevState.reverseSort
        };
      }
    });
  }

  _sort() {
    const primaryCriteria = this.state.sortCriteria;
    const secondaryCriteria = SortCriteria.RANK;
    const reverseSort = this.state.reverseSort;
    const sortedData = this.props.leaderboardData.concat();

    LeaderboardSort.sortByCriteria(
      sortedData,
      primaryCriteria,
      secondaryCriteria,
      reverseSort
    );

    return sortedData;
  }

  render() {
    const getHeader = (label, sortCriteria, title = '') => {
      let sortArrow = null;
      if (sortCriteria === this.state.sortCriteria) {
        if (this.state.reverseSort) {
          sortArrow = (
            <i
              class="fa fa-arrow-circle-down"
              aria-hidden="true"
              title="Descending order"
            />
          );
        } else {
          sortArrow = (
            <i
              class="fa fa-arrow-circle-up"
              aria-hidden="true"
              title="Ascending order"
            />
          );
        }
      }

      return (
        <th
          onClick={() => this._setSortCriteria(sortCriteria)}
          className="sortable"
          title={title}
        >
          <span>
            {label}
            {sortArrow}
          </span>
        </th>
      );
    };

    let rows = null;
    if (this.props.leaderboardData) {
      rows = this._sort().map(function(data) {
        return (
          <tr key={data.username}>
            <td>{data.rank}</td>
            <td>{data.username}</td>
            <td>{data.recent}</td>
            <td>{data.alltime}</td>
          </tr>
        );
      });
    }

    return (
      <table>
        <thead>
          <tr>
            {getHeader('Rank ', SortCriteria.RANK)}
            {getHeader('Name ', SortCriteria.USERNAME)}
            {getHeader(
              'Recent ',
              SortCriteria.RECENT,
              'Points in past 30 days'
            )}
            {getHeader('All-time ', SortCriteria.ALLTIME)}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default LeaderboardTable;
