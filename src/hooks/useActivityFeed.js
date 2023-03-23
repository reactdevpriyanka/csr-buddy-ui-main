import { useContext } from 'react';
import { ActivityFeedContext } from '@/components/ActivityFeed';

export default function useActivityFeed() {
  return useContext(ActivityFeedContext) || {};
}
