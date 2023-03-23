import PropTypes from 'prop-types';
import Sticker from '@/components/Sticker';
import TooltipPrimary from '@/components/TooltipPrimary';
import { FeatureFlag } from '@/features';
import { formatItemType } from '../utils';
import TooltipTitle from './TooltipTitle';

export default function VetDietItemType({ classes, tag, vetContactInfo, ...props }) {
  return (
    <FeatureFlag flag="feature.explorer.vetDietTagEnabled">
      <Sticker>
        <TooltipPrimary
          title={
            <TooltipTitle>
              {vetContactInfo?.clinicName ? (
                <div className={classes.tagSection}>
                  <p className={classes.tagTitle}>Clinic Name: </p> {vetContactInfo?.clinicName}
                </div>
              ) : null}
              {vetContactInfo?.petName ? (
                <div className={classes.tagSection}>
                  <p className={classes.tagTitle}>Pet Name: </p>
                  {vetContactInfo?.petName}
                </div>
              ) : null}
            </TooltipTitle>
          }
          placement="bottom"
        >
          <span data-testid={props['data-testid']}>{formatItemType(tag)}</span>
        </TooltipPrimary>
      </Sticker>
    </FeatureFlag>
  );
}

VetDietItemType.propTypes = {
  classes: PropTypes.object,
  'data-testid': PropTypes.string,
  tag: PropTypes.string,
  vetContactInfo: PropTypes.shape({
    clinicName: PropTypes.string,
    petName: PropTypes.string,
  }),
};
