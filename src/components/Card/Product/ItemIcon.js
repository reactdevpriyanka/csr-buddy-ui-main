import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FeatureFlag } from '@/features';
import RxOrderIcon from '@icons/rx.svg';
import VetDietIcon from '@icons/vetdiet.svg';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: '0.85rem',
    height: '0.85rem',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '0.25rem',
    fill: theme.palette.blue[800],
  },
}));

export default function ItemIcon({ attributes = [] }) {
  const classes = useStyles();

  if (attributes.includes('PHARMACEUTICAL')) {
    return (
      <FeatureFlag flag="feature.explorer.pharmacyIconEnabled">
        <span data-testid="item-icon:rx-order">
          <RxOrderIcon className={classes.icon} />
        </span>
      </FeatureFlag>
    );
  } else if (attributes.includes('VET_DIET')) {
    return (
      <FeatureFlag flag="feature.explorer.vetDietTagEnabled">
        <span data-testid="item-icon:vet-diet">
          <VetDietIcon className={classes.icon} />
        </span>
      </FeatureFlag>
    );
  } else {
    return null;
  }
}

ItemIcon.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.string),
};
