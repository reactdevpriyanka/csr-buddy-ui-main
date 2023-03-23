import { Slide } from '@mui/material';
import { forwardRef } from 'react';

export const SlideUpTransition = forwardRef(function Transition(props, ref) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide direction="up" ref={ref} {...props} />;
});
