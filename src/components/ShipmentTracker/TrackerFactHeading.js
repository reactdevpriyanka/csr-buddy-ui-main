import PropTypes from 'prop-types';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutline from '@icons/info.outline-circle.svg';
import { Popout } from '@components/Notifications';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    margin: 0,
  },
  heading: {
    color: theme.palette.gray.medium,
    display: 'inline',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(16),
    marginBottom: theme.utils.fromPx(6),
    textDecoration: 'none',
  },
  help: {
    '& > svg': {
      verticalAlign: 'middle',
      width: theme.utils.fromPx(16),
      height: 'auto',
      marginLeft: theme.utils.fromPx(4),
    },
  },
}));

const TrackerFactHeading = ({ heading = '', help = null }) => {
  const classes = useStyles();

  const [visible, setVisible] = useState(false);

  const onMouseEnter = () => setVisible(true);
  const onMouseLeave = () => setVisible(false);

  return (
    <p className={classes.root}>
      <strong className={classes.heading}>{heading}</strong>
      {help && (
        <span className={classes.help} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <InfoOutline />
          <Popout visible={visible} data-testid={`tracker:value-${heading}`} as="span">
            {help}
          </Popout>
        </span>
      )}
    </p>
  );
};

TrackerFactHeading.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  help: PropTypes.string,
};

export default TrackerFactHeading;
