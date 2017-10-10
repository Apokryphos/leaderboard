require('es6-promise').polyfill();
require('isomorphic-fetch');
import LeaderboardSort from './leaderboard-sort.js';
import SortCriteria from './sort-criteria.js';

module.exports = (function() {
  const allTimeEndpoint =
    'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';

  const recentEndpoint =
    'https://fcctop100.herokuapp.com/api/fccusers/top/recent';

  const fetchData = function(
    endpoint,
    sortPrimaryCriteria,
    sortSecondaryCriteria,
    callback
  ) {
    fetch(endpoint)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (callback) {
          //  Sort data first
          LeaderboardSort.sortByCriteria(
            data,
            sortPrimaryCriteria,
            sortSecondaryCriteria
          );

          //  Assign rankings using default order
          let rank = 1;
          data.map(function(obj) {
            obj.rank = rank++;
            return obj;
          });

          callback(data);
        }
      }).catch(function(ex) {
        console.error('Fetch failed.');
        console.error(ex);
        return null;
      });
  };

  const getAlltimeLeaderboards = function(callback) {
    fetchData(
      allTimeEndpoint,
      SortCriteria.ALLTIME,
      SortCriteria.RECENT,
      callback
    );
  };

  const getRecentLeaderboards = function(callback) {
    fetchData(
      recentEndpoint,
      SortCriteria.RECENT,
      SortCriteria.ALLTIME,
      callback
    );
  };

  return {
    getAlltimeLeaderboards,
    getRecentLeaderboards
  };
})();
