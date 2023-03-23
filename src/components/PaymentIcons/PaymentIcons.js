import DiscoverIcon from '@icons/discover.svg';
import AmexIcon from '@icons/amex.svg';
import MasterCardIcon from '@icons/mastercard.svg';
import VisaIcon from '@icons/visa.svg';
import GiftCardIcon from '@icons/gift-card.svg';
import ApplePayIcon from '@icons/applepay.svg';
import PaypalIcon from '@icons/paypal.svg';
import GooglePayIcon from '@icons/googlepay.svg';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

// see PaymentMethodType enum in OMS
const paymentIcons = {
  // card.type
  AMEX: <AmexIcon />,
  DISCOVER: <DiscoverIcon />,
  MASTERCARD: <MasterCardIcon />,
  VISA: <VisaIcon />,
  GIFTCARD: <GiftCardIcon />,
  GIFT_CARD: <GiftCardIcon />,

  // service.serviceName
  APPLEPAY: <ApplePayIcon />,
  APPLE_PAY: <ApplePayIcon />,
  PAYPAL: <PaypalIcon />,
  PREPAY: <GiftCardIcon />,
  GOOGLEPAY: <GooglePayIcon />,
  GOOGLE_PAY: <GooglePayIcon />,
  ACCOUNTBALANCE: <AccountBalanceWalletOutlinedIcon />,
  ACCOUNT_BALANCE: <AccountBalanceWalletOutlinedIcon />,
  UNKNOWN: <HelpOutlineOutlinedIcon />,
};

export default paymentIcons;
