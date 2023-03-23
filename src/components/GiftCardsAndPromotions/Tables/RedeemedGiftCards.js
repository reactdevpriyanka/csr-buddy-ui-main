import { formatShipmentInfoDate } from '@/utils';
import { currencyFormatter, snakeCaseToTitleCase } from '@/utils/string';
import PropTypes from 'prop-types';

const RedeemedGiftCards = ({ giftcards, classes }) => {
  const getPurchaserName = (giftcard) => {
    if (giftcard?.purchaser?.fullName != null) {
      return giftcard.purchaser.fullName;
    }
    if (giftcard?.purchaser?.addresses && giftcard?.purchaser?.addresses.length > 0) {
      return giftcard.purchaser.addresses[0].fullName;
    }
    return '-';
  };

  return giftcards?.length > 0 ? (
    <table className={classes.table} data-testid="redeemed-giftcards-table">
      <thead>
        <tr>
          <th>Card #</th>
          <th>Redeemed On</th>
          <th>Purchaser</th>
          <th>Balance</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {giftcards.map((giftcard) => (
          <tr key={giftcard?.id}>
            <td>
              {giftcard?.maskedAccountNumber?.slice(giftcard?.maskedAccountNumber?.length - 6) ??
                '-'}
            </td>
            <td>{formatShipmentInfoDate(giftcard?.redeemedDate, false)}</td>
            <td>{getPurchaserName(giftcard) ?? '-'}</td>
            <td>
              {giftcard?.availableBalance?.value ? (
                <>
                  {currencyFormatter(giftcard.availableBalance.value)}{' '}
                  {giftcard?.availableBalance?.currency}
                </>
              ) : (
                '-'
              )}
            </td>
            <td>{snakeCaseToTitleCase(giftcard?.status) ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : null;
};

RedeemedGiftCards.propTypes = {
  giftcards: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
};

export default RedeemedGiftCards;
