import PropTypes from 'prop-types';
import Pill from '@components/Pill';
import { makeStyles } from '@material-ui/core';
import capitalize from 'lodash/capitalize';
import TooltipPrimary from '../TooltipPrimary';

const useStyles = makeStyles((theme) => ({
  tooltipText: {
    fontSize: theme.typography.pxToRem(16),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'white',
  },
  outerContainer: {
    cursor: 'pointer !important',
  },
}));

const getDisplayText = (tag) => {
  switch (tag.name) {
    case 'STATUS':
      return capitalize(tag.value);
    case 'WEIGHT_LIMIT':
      return `${tag.displayName} ${tag.value} lbs`;
    default:
      return tag.displayName;
  }
};

const getPillType = (tag) => {
  if (
    (tag.name === 'STATUS' && tag.value === 'INACTIVE') ||
    ['DISCOUNT_ABUSER', 'RETURNS_ABUSER', 'SUSPECTED_FRAUD'].includes(tag.name)
  ) {
    return 'specialtag';
  }

  return 'tag';
};

const Tag = ({ data }) => {
  const classes = useStyles();

  const tooltipTitle = <span className={classes.tooltipText}>{data.description}</span>;

  return (
    <Pill type={getPillType(data)}>
      <TooltipPrimary aria-label={data.description} arrow placement="bottom" title={tooltipTitle}>
        <span key={data.name} className={classes.outerContainer}>
          {getDisplayText(data)}
        </span>
      </TooltipPrimary>
    </Pill>
  );
};

Tag.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
  }),
};

export default Tag;
