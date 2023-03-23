/* eslint-disable jsx-a11y/anchor-is-valid */
import { formatGiftCardDate, formatGiftCardDeliveryDate } from '@/utils';
import { currencyFormatter, snakeCaseToTitleCase } from '@/utils/string';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PurchasedGiftCards = ({ giftcards, classes, customerId }) => {
  const getRedeemerName = (giftcard) => {
    if (giftcard?.redeemer?.fullName != null) {
      return giftcard.redeemer.fullName;
    }
    if (giftcard?.redeemer?.addresses && giftcard?.redeemer?.addresses.length > 0) {
      return giftcard.redeemer.addresses[0].fullName;
    }
    return '-';
  };
  return giftcards?.length > 0 ? (
    <table className={classes.table} data-testid="purchased-giftcards-table">
      <thead>
        <tr>
          <th>Card #</th>
          <th>Placed On</th>
          <th>Delivery</th>
          <th>Order #</th>
          <th>Redeemer</th>
          <th>Recipient</th>
          <th>Balance</th>
          <th>Status</th>
          <th>Replacement</th>
          <th>Original Order</th>
        </tr>
      </thead>
      <tbody>
        {giftcards
          .filter((giftcard) => giftcard?.type === 'PURCHASED')
          .map((giftcard) => (
            <tr key={giftcard?.id}>
              <td>
                {giftcard?.maskedAccountNumber?.slice(giftcard?.maskedAccountNumber?.length - 6) ??
                  '-'}
              </td>
              <td>{formatGiftCardDate(giftcard?.order?.timePlaced)}</td>
              <td>{formatGiftCardDeliveryDate(giftcard?.deliveryDate)}</td>
              <td>
                {giftcard?.order?.externalOrderId ? (
                  <Link
                    passHref
                    key={giftcard?.order?.id}
                    href={`/customers/${customerId}/orders/${giftcard.order.externalOrderId}`}
                  >
                    <a>{giftcard.order.externalOrderId}</a>
                  </Link>
                ) : (
                  <div>-</div>
                )}
              </td>
              <td>{getRedeemerName(giftcard) ?? '-'}</td>
              <td>{giftcard?.recipientEmail ?? '-'}</td>
              <td>
                {giftcard?.availableBalance?.value ? (
                  <>
                    {currencyFormatter(giftcard.availableBalance.value)}{' '}
                    {giftcard?.availableBalance?.currency ?? '-'}
                  </>
                ) : (
                  '-'
                )}
              </td>
              <td>{snakeCaseToTitleCase(giftcard?.status ?? '-')}</td>
              <td>{null ?? '-'}</td>
              <td>{'-'}</td>
            </tr>
          ))}
      </tbody>
    </table>
  ) : null;
};

PurchasedGiftCards.propTypes = {
  giftcards: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
  customerId: PropTypes.string,
};

export default PurchasedGiftCards;
