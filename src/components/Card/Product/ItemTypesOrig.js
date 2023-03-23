import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import PharmacyItemType from './PharmacyItemType';
import VetDietItemType from './VetDietItemType';
import BaseItemType from './BaseItemType';

const useStyles = makeStyles((theme) => ({
  tagSection: {
    display: 'flex',
  },
  tagTitle: {
    fontWeight: 'bold',
    margin: `0 ${theme.utils.fromPx(5)} 0 0`,
  },
}));

export default function ItemTypesOrig({ bundleItem, tags = [], vetContactInfo }) {
  const classes = useStyles();

  return (bundleItem ? [...tags, 'BUNDLED'] : tags).map((tag) => {
    const key = `${tag}`;
    const testId = `product:itemtype:pill:${key}`;
    let itemType;

    switch (tag) {
      case 'PHARMACY':
        itemType = (
          <PharmacyItemType
            classes={classes}
            data-testid={testId}
            tag={tag}
            vetContactInfo={vetContactInfo}
          />
        );
        break;
      case 'VET_DIET':
        itemType = (
          <VetDietItemType
            classes={classes}
            data-testid={testId}
            tag={tag}
            vetContactInfo={vetContactInfo}
          />
        );
        break;
      default:
        itemType = <BaseItemType tag={tag} data-testid={testId} />;
    }

    return (
      <Grid item xs="auto" key={key}>
        {itemType}
      </Grid>
    );
  });
}

ItemTypesOrig.propTypes = {
  bundleItem: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
  vetContactInfo: PropTypes.shape({
    clinicName: PropTypes.string,
    contactVet: PropTypes.oneOf(['true', 'false']),
    petName: PropTypes.string,
    vetProfileId: PropTypes.string,
  }),
};
