import { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import TooltipPrimary from '@/components/TooltipPrimary';

const useStyles = makeStyles((theme) => ({
  tooltipArrow: {
    //the tooltip when there is an arrow
    backgroundColor: theme.palette.primary.main,
    padding: 12,
  },
  arrow: {
    //the arrow itself
    color: theme.palette.primary.main,
  },
  iconButton: {
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main,
    padding: '4px',
    border: `4px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    '&.iconButtonIsOpen': {
      color: theme.palette.white,
      backgroundColor: '#1C49C2',
    },
  },
}));

const SummaryPopperButton = ({ classes: classesProp = {}, icon, children, tempDisabled, keys }) => {
  const { iconButton: classIconButton = '' } = classesProp;
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    if (tempDisabled) {
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <span>
      <TooltipPrimary
        arrow
        classes={{
          tooltipArrow: classes.tooltipArrow,
          arrow: classes.arrow,
        }}
        title={children}
      >
        <IconButton
          className={classnames(classes.iconButton, classIconButton, { iconButtonIsOpen: isOpen })}
          variant="outlined"
          onMouseOver={handleOpen}
          onMouseOut={handleClose}
          data-testid={`summary-poppup-button-${keys}`}
        >
          {icon}
        </IconButton>
      </TooltipPrimary>
    </span>
  );
};

SummaryPopperButton.propTypes = {
  classes: PropTypes.object,
  tempDisabled: PropTypes.bool,
  icon: PropTypes.element,
  children: PropTypes.element.isRequired,
  keys: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SummaryPopperButton;
