const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class DateFeed {
  table = {};

  orderedKeys = new Set([]);

  constructor(activities) {
    if (!activities || activities.length === 0) return;
    const orderedActivities = [...activities].sort((a, b) => {
      const d1 = this.getStartDate(a);
      const d2 = this.getStartDate(b);
      return d1 > d2 ? -1 : d1 < d2 ? 1 : 0;
    });

    for (const activity of orderedActivities) {
      const start = this.getStartDate(activity);
      const startDate = new Date(start);
      if (Number.isNaN(startDate.getTime())) {
        // validating invaid date
        continue;
      }
      const key = new Date(`${startDate.getFullYear()}/${startDate.getMonth() + 1}/01`).getTime();
      this.orderedKeys.add(key);
      if (this.table[key]) {
        this.table[key].push(activity);
      } else {
        this.table[key] = [activity];
      }
    }
  }

  activities() {
    /**
     * TODO (jpemberton1-chwy)
     *
     * I *think* I remember seeing an interesting implementation of
     * correctly ordering numbers in O(n) time but I can't find my
     * bookmark for this right now, so in order to get this moving
     * I've decided to just use 'sort' here...
     *
     * The data should already be optimally sorted by the backend,
     * so we should be able to say 'parse the date and then add a key
     * to the table' and be done, it should just be an O(n) grouping
     * algorithm but the test data is not realistic in this way.
     *
     * I'm going to work on simulating this functionality, but
     * will need `sort` here to continue working on styles.
     */
    return [...this.orderedKeys].map((key) => {
      return {
        date: this.formatDate(key),
        activities: this.table[key],
      };
    });
  }

  formatDate(key) {
    const d = new Date(Number(key));
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  getStartDate(activity) {
    if (activity.data.autoship) {
      return activity.createdAt;
    }
    return activity.data.order?.timePlaced;
  }
}
