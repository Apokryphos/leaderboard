const test = require('tape');
import LeaderboardService from './../src/js/api/leaderboard-service.js';
import LeaderboardSort from './../src/js/api/leaderboard-sort.js';
import SortCriteria from './../src/js/api/sort-criteria.js';

test('getSortCriteria', function(t) {
  const obj = {
    rank: 1,
    username: 'test',
    alltime: 1000,
    recent: 50
  };

  t.equal(LeaderboardSort.getSortCriteria(obj, SortCriteria.RANK), obj.rank);
  t.equal(
    LeaderboardSort.getSortCriteria(obj, SortCriteria.USERNAME),
    obj.username
  );
  t.equal(
    LeaderboardSort.getSortCriteria(obj, SortCriteria.ALLTIME),
    obj.alltime
  );
  t.equal(
    LeaderboardSort.getSortCriteria(obj, SortCriteria.RECENT),
    obj.recent
  );
  t.end();
});

function testSort(t, data, sortCriteria, reverse) {
  const sortedData = LeaderboardSort.sortByCriteria(
    data,
    sortCriteria,
    SortCriteria.RANK,
    reverse
  );

  const compare = reverse ? (a, b) => b <= a : (a, b) => a <= b;

  let last = null;
  for (let d = 0; d < sortedData.length; ++d) {
    const current = sortedData[d];
    if (last) {
      t.comment(
        `#${current.rank} RECENT:${current.recent} ALLTIME:${current.alltime}`
      );

      t.equal(
        compare(
          LeaderboardSort.getSortCriteria(last, sortCriteria),
          LeaderboardSort.getSortCriteria(current, sortCriteria)
        ),
        true
      );

      t.equal(compare(last.rank, current.rank), true);
    } else {
      t.pass();
      t.pass();
    }
    last = current;
  }
}

test('Sorting leaderboard data', function(t) {
  const runTest = function(sortCriteria, reverse = false) {
    return data => {
      testSort(t, data, sortCriteria, reverse);
    };
  };

  t.plan(800);
  LeaderboardService.getAlltimeLeaderboards(runTest(SortCriteria.ALLTIME));
  LeaderboardService.getAlltimeLeaderboards(runTest(SortCriteria.ALLTIME, true));
  LeaderboardService.getRecentLeaderboards(runTest(SortCriteria.RECENT));
  LeaderboardService.getRecentLeaderboards(runTest(SortCriteria.RECENT, true));
});
