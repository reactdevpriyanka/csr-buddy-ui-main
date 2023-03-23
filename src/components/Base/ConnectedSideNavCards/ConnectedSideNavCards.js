import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  dottedConnectingLine: {
    position: 'relative',
    stroke: 'grey',
    strokeDasharray: '4, 3',
    left: '50%',
    transform: 'translateX(-50%)',
    '&:last-child': {
      display: 'none',
    },
  },
}));

const ConnectedSideNavCards = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      {children}
      <svg className={classes.dottedConnectingLine} width="1" height="24">
        <line x1="0" y1="0" x2="0" y2="24" />
      </svg>
    </>
  );
};

ConnectedSideNavCards.propTypes = {
  children: PropTypes.object,
};

export default ConnectedSideNavCards;
