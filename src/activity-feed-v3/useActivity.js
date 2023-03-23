import { useContext } from 'react';
import ActivityContext from './ActivityContext';

export default function useActivity() {
  return useContext(ActivityContext);
}
