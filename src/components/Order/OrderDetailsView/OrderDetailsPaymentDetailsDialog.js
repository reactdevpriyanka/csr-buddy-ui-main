import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { BaseDialog } from '@components/Base';
import useAthena from '@/hooks/useAthena';
import OrderDetailsPaymentProperties from './OrderDetailsPaymentProperties';
import OrderDetailsPaymentInstructionDetails from './OrderDetailsPaymentInstructionDetails';
import OrderDetailsPaymentTotal from './OrderDetailsPaymentTotal';
import OrderDetailsPaymentHistory from './OrderDetailsPaymentHistory';
import OrderDetailsPaymentCredits from './OrderDetailsPaymentCredits';
import OrderDetailsPaymentCanceled from './OrderDetailsPaymentCanceled';

const useStyles = makeStyles((theme) => ({
  baseDialog: {
    '& .MuiPaper-root': {
      maxWidth: '72rem',
    },
    '& .MuiDialogContent-root': {
      maxWidth: '1100px',
      padding: '16px 16px 16px 16px',
    },
    '& .MuiDialogTitle-root': {
      padding: '1rem 1.75rem',
      backgroundColor: theme.palette.gray[375],
    },
  },
  paymentRow: {
    display: 'grid',
    gridTemplateColumns: '33% 33% auto',
    gridColumnGap: '2rem',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    marginBottom: '0.313rem',
  },

  paymentCreditRow: {
    marginTop: '20px',
  },
  header: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '25px',
    color: '#031657',
  },
}));

const OrderDetailsPaymentDetailsDialog = ({ paymentDetail, isOpen = false, openDialog }) => {
  const classes = useStyles();

  const pageName = 'Order Details Payment Details Dialog - VT';

  const { getLang } = useAthena(); // athena config

  const handleClose = () => {
    openDialog({ open: false });
  };

  return isOpen ? (
    <BaseDialog
      data-testid="orderDetailsPaymentDetailsDialog"
      contentClassName={classes.baseDialog}
      open={isOpen}
      dialogTitle={
        <span className={classes.header}>
          {getLang('orderPaymentDetails', { fallback: 'Payment Details' })}
        </span>
      }
      onClose={handleClose}
      hideButtonPanel={true}
      pageName={pageName}
    >
      <div className={classes.paymentRow}>
        <OrderDetailsPaymentProperties paymentDetail={paymentDetail} />
        <OrderDetailsPaymentInstructionDetails paymentDetail={paymentDetail} />
        <OrderDetailsPaymentTotal paymentDetail={paymentDetail} />
      </div>
      <div>
        <OrderDetailsPaymentHistory paymentDetail={paymentDetail} />
      </div>
      <div className={classes.paymentCreditRow}>
        <OrderDetailsPaymentCredits paymentDetail={paymentDetail} />
      </div>
      <div className={classes.paymentCreditRow}>
        <OrderDetailsPaymentCanceled paymentDetail={paymentDetail} />
      </div>
    </BaseDialog>
  ) : null;
};

OrderDetailsPaymentDetailsDialog.propTypes = {
  paymentDetail: PropTypes.object,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
};

export default OrderDetailsPaymentDetailsDialog;
