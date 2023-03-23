import PropTypes from 'prop-types';
import cn from 'classnames';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BoxIcon from '@icons/box.svg';
import ReplaceIcon from '@icons/replace.svg';
import DeniedIcon from '@icons/denied.svg';
import MastercardIcon from '@icons/mastercard-blue.svg';

const icons = {
  'Issues with Products Ordered': BoxIcon,
  'Issues with Delivery/Shipping': ReplaceIcon,
  'Issues with Payments': MastercardIcon,
  'Issue with Fraudulent Activity': DeniedIcon,
};

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    border: theme.borders.default,
    borderRadius: '0.5rem',
    background: 'white',
    '&.selected': {
      border: '1px solid #128ced !important',
      background: '#DDF0FF',
    },
    '&.disabled': {
      background: 'rgba(120, 120, 120, 0.6)',
      border: '1px solid rgba(120, 120, 120, 0.8)',
    },
    '&:hover': {
      cursor: 'pointer',
    },
    minWidth: theme.utils.fromPx(502),
  },
  buttonHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonIcon: {
    display: 'flex',
    width: theme.utils.fromPx(40),
    height: theme.utils.fromPx(40),
    background: theme.palette.blue.pastel,
    padding: theme.spacing(0.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    margin: `${theme.spacing(0.5)} ${theme.spacing(1)} ${theme.spacing(0.5)} ${theme.spacing(0.5)}`,
  },
  buttonTitle: {
    fontSize: theme.fonts.size.lg,
    color: theme.palette.gray.dark,
  },
  buttonDescription: {
    margin: `0 ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)}`,
    textAlign: 'left',
    fontSize: theme.fonts.size.md,
    color: '#4D4D4D',
  },
}));

const testId = 'multiple-choice-card';

const MultipleChoiceCard = ({
  label = '',
  subLabel: description = '',
  selected = false,
  disabled = false,
  onClick = () => null,
}) => {
  const classes = useStyles();

  const Icon = icons[label] || (() => null);

  return (
    <button
      data-testid={`${testId}-option`}
      data-testkey={`${testId}-option-${label}`}
      className={cn(classes.button, selected && 'selected', disabled && 'disabled')}
      onClick={onClick}
    >
      <div className={classes.buttonHeader}>
        <figure data-testid={`${testId}-option-${label}:icon`} className={classes.buttonIcon}>
          <Icon />
        </figure>
        <Typography
          data-testid={`${testId}-option-${label}:title`}
          variant="h3"
          className={classes.buttonTitle}
        >
          {label}
        </Typography>
      </div>

      <p
        data-testid={`${testId}-option-${label}:description`}
        className={classes.buttonDescription}
      >
        {description}
      </p>
    </button>
  );
};

MultipleChoiceCard.propTypes = {
  label: PropTypes.node,
  subLabel: PropTypes.node,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default MultipleChoiceCard;
