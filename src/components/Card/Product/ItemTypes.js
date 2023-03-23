import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import { getAttributes } from '@/components/Order/OrderDetailsView/utils';
import Sticker from '@/components/Sticker';
import TooltipPrimary from '@/components/TooltipPrimary';
import useAthena from '@/hooks/useAthena';
import useFeature from '@/features/useFeature';
import { formatItemType } from '../utils';

const useStyles = makeStyles((theme) => ({
  tagTitle: {
    fontWeight: 'bold',
    margin: `0 ${theme.utils.fromPx(5)} 0 0`,
  },
  tagsection: {
    display: 'flex',
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'white',
  },
  tooltipTagtitle: {
    fontWeight: 'bold',
    fontStyle: 'bold',
    fontSize: theme.typography.pxToRem(13),
    fontFamily: 'Roboto',
    margin: `0 ${theme.utils.fromPx(8)} 0 0`,
  },
}));

export default function ItemTypes({
  bundleItem,
  tags = [],
  vetContactInfo,
  product = {},
  minMaxDates = {},
  appointmentInfo = {},
}) {
  const classes = useStyles();
  const { getLang } = useAthena();
  const vetDietTagEnabled = useFeature('feature.explorer.vetDietTagEnabled');

  const getTitleElem = (title) => {
    return <span className={classes.tooltipText}>{title}</span>;
  };

  return (bundleItem ? [...tags, 'BUNDLED'] : tags).map((tag) => {
    const key = `${tag}`;
    const testId = `product:itemtype:pill:${key}`;
    if (!vetDietTagEnabled && tag.includes('VET_DIET')) return null;
    return tag.includes('VET_DIET') ? (
      <Grid item xs="auto" key={key}>
        <Sticker key={testId}>
          <TooltipPrimary
            title={getTitleElem(
              <>
                {vetContactInfo?.clinicName != null && (
                  <div className={classes.tagsection}>
                    <p
                      data-testid={`tag:tooltip:title:label:${testId}`}
                      className={classes.tooltipTagtitle}
                    >
                      {getLang('ClinicName', { fallback: 'Clinic Name' })}:{' '}
                    </p>{' '}
                    {vetContactInfo?.clinicName}
                  </div>
                )}
                {vetContactInfo?.petName != null && (
                  <div className={classes.tagsection}>
                    <p
                      data-testid={`tag:tooltip:title:label:${testId}`}
                      className={classes.tooltipTagtitle}
                    >
                      {getLang('PetName', { fallback: 'Pet Name' })}:{' '}
                    </p>{' '}
                    {vetContactInfo?.petName}
                  </div>
                )}
              </>,
            )}
            placement="bottom"
          >
            <span data-testid={testId} className={classes.tagTitle}>
              {formatItemType(tag)}
            </span>
          </TooltipPrimary>
        </Sticker>
      </Grid>
    ) : (
      <Grid item xs="auto" key={key}>
        <Sticker
          key={key}
          data-testid={`stickerContainer:${testId}`}
          className={
            tag.includes('OUT_OF_STOCK') ||
            tag.includes('FORCED_BACK_ORDER') ||
            tag.includes('DISCONTINUED')
              ? 'red'
              : 'default'
          }
          toolTip={getAttributes(
            tag,
            appointmentInfo,
            vetContactInfo,
            product,
            minMaxDates,
            testId,
          )}
        >
          <span data-testid={testId} className={classes.tagTitle}>
            {formatItemType(tag)}
          </span>
        </Sticker>
      </Grid>
    );
  });
}

ItemTypes.propTypes = {
  bundleItem: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
  vetContactInfo: PropTypes.shape({
    clinicName: PropTypes.string,
    contactVet: PropTypes.oneOf(['true', 'false']),
    petName: PropTypes.string,
    vetProfileId: PropTypes.string,
  }),
  product: PropTypes.object,
  minMaxDates: PropTypes.shape({
    maxDeliveryDate: PropTypes.string,
    minDeliveryDate: PropTypes.string,
  }),
  appointmentInfo: PropTypes.shape({
    id: PropTypes.string,
    endTime: PropTypes.string,
    reason: PropTypes.string,
    timeZone: PropTypes.string,
    type: PropTypes.string,
  }),
};
