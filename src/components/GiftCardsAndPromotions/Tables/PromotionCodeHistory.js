/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import PropTypes from 'prop-types';

const PromotionCodeHistory = ({ promotions, classes, customerId }) => {
  return promotions?.length > 0 ? (
    <table className={classes.table} data-testid="promotion-code-history-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Order #</th>
        </tr>
      </thead>
      <tbody>
        {promotions.map((promotion) => (
          <tr key={promotion?.promotionId}>
            <td>{promotion?.promotionId ?? '-'}</td>
            <td>{promotion?.promotionName ?? '-'}</td>
            <td>
                {promotion?.orderId  ? (
                  <Link
                    passHref
                    key={promotion?.orderId}
                    href={`/customers/${customerId}/orders/${promotion?.orderId}`}
                  >
                    <a>{promotion?.orderId}</a>
                  </Link>
                ) : (
                  <div>-</div>
                )}
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : null;
};

PromotionCodeHistory.propTypes = {
  promotions: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
  customerId: PropTypes.string,
};

export default PromotionCodeHistory;
