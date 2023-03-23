import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getContactReason } from '@/components/InteractionSummary/utils';
import Appeasement from './Appeasement';

const Appeasements = ({ appeasements, orderId }) => {
  const appeasementsForOrder = useMemo(
    () => appeasements.filter((appeasement) => appeasement?.appeasementId === orderId),
    [orderId],
  );

  return appeasementsForOrder?.map(({ actions, description, details, appeasementId }) => (
    <Appeasement
      key={`${appeasementId}-${description}`}
      actions={actions}
      description={description}
      actionDescription={getContactReason(details)}
      comment={details?.comment}
      itemId={details?.itemId}
    />
  ));
};

Appeasements.propTypes = {
  appeasements: PropTypes.array,
  orderId: PropTypes.string,
};

export default Appeasements;
