import { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AssignmentIcon from '@icons/check-outline.svg';

const useStyles = makeStyles((theme) => ({
  root: {},
  confirmation: {
    ...theme.fonts.normal,
    color: theme.palette.green.dark,
    fontWeight: 600,
    display: 'none',
    textTransform: 'uppercase',
    '&.shown': {
      display: 'inline',
    },
  },
}));

export default function CopyableText({
  copyOnDoubleClick,
  children,
  Component = 'span',
  confirmation = (
    <span style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
      <AssignmentIcon style={{ alignContent: 'center', width: 16, height: 16 }} /> {'Copied'}
    </span>
  ),
}) {
  const classes = useStyles();

  const messageRef = useRef(null);

  const handleCopy = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
      navigator.clipboard.writeText(event.target.textContent);
      messageRef.current?.classList.add('shown');
      setTimeout(() => {
        messageRef.current?.classList.remove('shown');
      }, 900);
    }
  }, []);

  return (
    <span>
      {!copyOnDoubleClick && (
        <Component onClick={handleCopy}>
          {children}
          <span className={classes.confirmation} ref={messageRef}>
            {confirmation}
          </span>
        </Component>
      )}
      {copyOnDoubleClick && (
        <Component onDoubleClick={handleCopy}>
          {children}
          <span className={classes.confirmation} ref={messageRef}>
            {confirmation}
          </span>
        </Component>
      )}
    </span>
  );
}

CopyableText.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  confirmation: PropTypes.node,
  copyOnDoubleClick: PropTypes.bool,
};
