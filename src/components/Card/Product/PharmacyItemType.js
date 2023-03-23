import PropTypes from 'prop-types';
import Sticker from '@/components/Sticker';
import TooltipPrimary from '@/components/TooltipPrimary';
import { formatItemType } from '../utils';
import TooltipTitle from './TooltipTitle';

export default function PharmacyItemType({ classes, tag, vetContactInfo, ...props }) {
  return (
    <Sticker>
      <TooltipPrimary
        title={
          <TooltipTitle>
            {vetContactInfo?.clinicName ? (
              <div className={classes.tagSection}>
                <p className={classes.tagTitle}>Clinic Name: </p>
                {vetContactInfo?.clinicName}
              </div>
            ) : null}
            {vetContactInfo?.contactVet ? (
              <div className={classes.tagSection}>
                <p className={classes.tagTitle}>Vet Contacted: </p>
                {vetContactInfo.contactVet === 'true' ? 'Yes' : 'No'}
              </div>
            ) : null}
            {vetContactInfo?.vetProfileId ? (
              <div className={classes.tagSection}>
                <p className={classes.tagTitle}>Vet Profile ID: </p>
                {vetContactInfo.vetProfileId}
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
  );
}

PharmacyItemType.propTypes = {
  classes: PropTypes.object,
  'data-testid': PropTypes.string,
  tag: PropTypes.string,
  vetContactInfo: PropTypes.shape({
    clinicName: PropTypes.string,
    contactVet: PropTypes.oneOf(['true', 'false']),
    petName: PropTypes.string,
    vetProfileId: PropTypes.string,
  }),
};
