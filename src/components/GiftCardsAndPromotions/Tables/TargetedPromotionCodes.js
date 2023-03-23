import { formatShipmentInfoDate } from '@/utils';
import { snakeCaseToTitleCase } from '@/utils/string';
import PropTypes from 'prop-types';

const TargetedPromotionCodes = ({ promotions, classes }) => {
  return promotions?.length > 0 ? (
    <table className={classes.table} data-testid="targeted-promotion-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Code</th>
          <th>Name</th>
          <th>Status</th>
          <th>Transferable</th>
          <th>Valid Date Range</th>
        </tr>
      </thead>
      <tbody>
        {promotions.map((promotion) => (
          <tr key={promotion?.id}>
            <td>{promotion?.promotionCodeId ?? '-'}</td>
            <td>{promotion?.code ?? '-'}</td>
            <td>{promotion?.promotionName ?? '-'}</td>
            <td>{snakeCaseToTitleCase(promotion?.status) ?? '-'}</td>
            {promotion?.transferable !== null ? (
              <td>{promotion.transferable ? 'True' : 'False'}</td>
            ) : (
              <td>-</td>
            )}
            <td>
              {formatShipmentInfoDate(promotion?.validFrom)} -{' '}
              {formatShipmentInfoDate(promotion?.validUntil)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : null;
};

TargetedPromotionCodes.propTypes = {
  promotions: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
};

export default TargetedPromotionCodes;
