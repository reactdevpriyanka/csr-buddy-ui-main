import { format, isBefore } from 'date-fns';

export default function mapActivitiesByDate(activities) {
  const orderedKeys = new Set([]);

  const table = {};

  if (!activities || activities.length === 0) {
    return [];
  }

  const ordered = [...activities].sort((a, b) => {
    return isBefore(new Date(a.activityTimestamp), new Date(b.activityTimestamp)) ? 1 : -1;
  });

  for (const activity of ordered) {
    if (!activity.activityTimestamp) continue;

    const tableKey = format(new Date(activity.activityTimestamp), 'MMMM yyyy');
    if (!table[tableKey]) {
      table[tableKey] = [];
    }
    table[tableKey].push(activity);
    orderedKeys.add(tableKey);
  }

  return [...orderedKeys].map((key) => {
    return {
      date: key,
      activities: table[key],
    };
  });
}
