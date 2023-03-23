import PropTypes from 'prop-types';
import ChevronDown from '@icons/chevron.down.svg';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `0 ${theme.utils.fromPx(22)} 0 0`,
    padding: 0,
    background: 'transparent',
    border: 0,
    cursor: 'pointer',
  },
}));

const Icon = ({ onClick = () => null }) => {
  const classes = useStyles();

  return (
    <button className={classes.root} onClick={onClick}>
      <ChevronDown />
    </button>
  );
};

Icon.propTypes = {
  onClick: PropTypes.func,
};

export default Icon;
