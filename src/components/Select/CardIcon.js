import PropTypes from 'prop-types';
import AmexIcon from '@icons/amex.svg';
import DiscoverIcon from '@icons/discover.svg';
import MasterCardIcon from '@icons/mastercard.svg';
import VisaIcon from '@icons/visa.svg';
import PayPalIcon from '@icons/paypal.svg';
import GiftCardIcon from '@icons/giftcard.svg';

const icons = {
  AMEX: <AmexIcon />,
  DISCOVER: <DiscoverIcon />,
  MASTERCARD: <MasterCardIcon />,
  VISA: <VisaIcon />,
  PAYPAL: <PayPalIcon />,
  GIFTCARD: <GiftCardIcon />,
  [undefined]: () => null,
  [null]: () => null,
  '': () => null,
};

const CardIcon = ({ type = null }) => {
  return icons[type];
};

CardIcon.propTypes = {
  type: PropTypes.oneOf(['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER', 'PAYPAL', 'GIFTCARD']),
};

export default CardIcon;
