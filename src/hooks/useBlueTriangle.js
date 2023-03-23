import * as blueTriangle from '@utils/blueTriangle';
import { useEffect } from 'react';

export const useBlueTriangle = (pageName) => {
  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);
};
