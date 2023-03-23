import { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ModalContext from '@components/ModalContext';
import CloseIcon from '@icons/close.svg';

const useStyles = makeStyles((theme) => ({
  heading: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.blue.dark,
    color: theme.palette.white,
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    padding: `${theme.utils.fromPx(24)} ${theme.utils.fromPx(16)}`,
  },
  closeBtn: {
    cursor: 'pointer',
    border: 0,
    background: 'transparent',
    color: 'white',
    marginLeft: 'auto',
    '& svg > path': {
      fill: 'currentColor',
    },
  },
}));

const ModalSideHeader = ({ text, onClose = () => {} }) => {
  const { setModal } = useContext(ModalContext);

  const handleClose = () => {
    onClose();
    setModal(null);
  };

  const classes = useStyles();
  return (
    <div className={classes.heading}>
      {text}
      <button onClick={handleClose} className={classes.closeBtn}>
        <CloseIcon />
      </button>
    </div>
  );
};

ModalSideHeader.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClose: PropTypes.func,
};

export default ModalSideHeader;
