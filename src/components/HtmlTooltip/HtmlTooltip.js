import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: '#031657', //todo move to theme?
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(12),
    marginBottom: '2px',
    padding: theme.utils.fromPx(14),
  },
  arrow: {
    color: '#031657',
  },
}));

/* just a tooltip for styling consistency */
const HtmlToolTip = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <Tooltip
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      classes={classes}
    >
      <div>{children}</div>
    </Tooltip>
  );
};

HtmlToolTip.propTypes = {
  children: PropTypes.element.isRequired,
};

export default HtmlToolTip;
