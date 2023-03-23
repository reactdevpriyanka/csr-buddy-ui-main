import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '&:first-of-type': {
      marginLeft: `-${theme.utils.fromPx(6)}`,
    },
    '&:not(:last-of-type)': {
      marginRight: `-${theme.utils.fromPx(10)}`,
    },
    display: 'inline-block',
    height: theme.utils.fromPx(25),
    width: theme.utils.fromPx(25),
    transform: 'scale(0.75)',
    clipPath:
      "path('M17.1 14.179l-.356.362.082.5.863 5.241c.004.046.008.11.008.209a.66.66 0 01-.109.386.264.264 0 01-.24.123.657.657 0 01-.333-.098l-.02-.012-.02-.01-4.494-2.468-.481-.264-.481.264-4.48 2.458-.008.005-.009.005a.756.756 0 01-.372.12.32.32 0 01-.149-.031.289.289 0 01-.105-.096.673.673 0 01-.104-.382c0-.035.004-.103.024-.231l.858-5.218.082-.501-.356-.362-3.655-3.713C3.04 10.23 3 10.077 3 9.961c0-.162.048-.232.093-.277.061-.061.196-.146.447-.189l5.016-.762.526-.08.228-.48 2.243-4.735.005-.01.005-.011a.908.908 0 01.245-.352A.286.286 0 0112 3c.082 0 .139.022.194.065.066.05.154.151.233.33l.005.012.006.01 2.252 4.756.228.48.526.08 5.028.764c.242.041.374.124.434.185.046.046.094.117.094.28 0 .122-.044.283-.274.524L17.1 14.179z')",
  },
}));

const Star = ({ percentage = 0, className = null }) => {
  const classes = useStyles();
  const style = {
    background: `linear-gradient(to right, #FF9800 ${percentage}%, transparent ${percentage}%, transparent 100%)`,
  };
  return <span className={cn([classes.root, className])} style={style} />;
};

Star.propTypes = {
  className: PropTypes.string,
  percentage: PropTypes.number,
};

export default Star;
