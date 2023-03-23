import { ActivityType } from './ActivityType';

export default function getPrefetchUrl({ activityCategory, activityId }) {
  return `/api/v3/${ActivityType[activityCategory]}/${activityId}`;
}
