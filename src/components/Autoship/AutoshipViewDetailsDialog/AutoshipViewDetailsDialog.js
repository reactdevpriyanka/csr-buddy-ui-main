/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { BaseDialog } from '@components/Base';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { OrderStatus } from '@/constants/OrderStatus';
import TableRow from '@mui/material/TableRow';
import { ActivityHeader, ProfileInfo } from '@/components/Card';
import AddressLabel from '@/components/Base/AddressLabel';
import { Link, TableFooter, Button } from '@material-ui/core';
import useEnv from '@/hooks/useEnv';
import { currencyFormatter } from '@/utils/string';
import useAthena from '@/hooks/useAthena';
import useEnactment from '@/hooks/useEnactment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FeatureFlag from '@/features/FeatureFlag';
import { getStat, makeSubtitle, renderTitle, showCardExpired, Status } from '../utils';
import AutoShipCardHeader from '../AutoShipCardHeader';
import { StyledTableCell, getImg } from './AutoshipViewDetailsDialogHelper';
import AutoshipSubTotals from './AutoshipSubTotals';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: `${theme.utils.fromPx(1200)}`,
    },
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: `${theme.utils.fromPx(24)}`,
    lineHeight: `${theme.utils.fromPx(28)}`,
    letterSpacing: '0.25%',
    color: '#000000',
  },
  dialogFooter: {
    display: 'grid',
    gridTemplateColumns: `${theme.utils.fromPx(300)} ${theme.utils.fromPx(300)} auto`,
    gridColumnGap: `${theme.utils.fromPx(20)}`,
    marginTop: `${theme.utils.fromPx(30)}`,
    marginLeft: `${theme.utils.fromPx(15)}`,
    marginBottom: `${theme.utils.fromPx(30)}`,
  },
  shippingInfo: {
    '& div:first-child': {
      marginBottom: '0px',
    },
  },
  subtotalValues: {
    textAlign: 'end',
    marginRight: `${theme.utils.fromPx(25)}`,
  },
  figure: {
    margin: '0',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row nowrap',
    '& div > img': {
      width: '100%',
      margin: '0',
      textAlign: 'center',
      display: 'block',
    },
  },
  container: {
    position: 'relative',
    width: theme.utils.fromPx(60),
    margin: '0',
    display: 'inline-grid',
    alignContent: 'center',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
  },
  partNumber: {
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: theme.typography.pxToRem(15),
    letterSpacing: '-0.03em',
    color: '#666666',
  },
  activityHeader: {
    backgroundColor: 'white',
    '&.primaryBackground': {
      backgroundColor: 'white',
    },
  },
  closeButton: {
    color: '#000',
  },
  modifyPaymentMethodButton: {
    marginRight: `${theme.utils.fromPx(10)} !important`,
    marginBottom: `${theme.utils.fromPx(10)} !important`,
    color: '#1C49C2 !important',
    letterSpacing: '-0.03em !important',
    textTransform: 'none !important',
  },
  exitToAppIcon: {
    marginLeft: '5px !important',
  },
  profileInfo: {
    marginLeft: '8px',
  },
}));

const AutoshipViewDetailsDialog = ({
  id,
  isOpen,
  openDialog,
  subscriptionData,
  paymentDetails,
  products = [],
  startDate,
  isUpcoming,
  name,
  nextFulfillmentDate,
  lastShipmentDate,
  cancelDate,
  lastOrderStatus,
  status,
  frequency,
  autoshipTotals,
  orderFees,
}) => {
  const classes = useStyles();
  const { sfwUrl: baseURL } = useEnv();
  const { getLang } = useAthena();

  const pageName = 'Autoship View Details Dialog - VT';

  const handleCloseDialog = useCallback(() => {
    openDialog(false);
  }, [openDialog]);

  const getDescription = (rowData) => {
    return (
      <div className={classes.description}>
        <Link
          target="_blank"
          rel="noopener"
          className={classes.btnModifyAutoship}
          data-testid={`product:catalogEntryId:link:${id}`}
          aria-label={`ITEM #${rowData.id}`}
          underline="none"
          href={`${baseURL}/app/dp/${rowData.catalogEntryId}`}
        >
          <span
            data-testid={`product:catalogEntryId:${rowData.id}`}
            className={classes.partNumber}
          >{`ITEM #${rowData.id}`}</span>
        </Link>

        <span>{rowData.title}</span>
        <span>{`Qty: ${rowData.quantity}`}</span>
      </div>
    );
  };

  const findImgUrl = (sku, rowData) => {
    const url = products.find((item) => item.id === rowData.id);
    return url?.thumbnail;
  };

  const columns = [
    {
      id: 'sku',
      label: 'Products',
      minWidth: 60,
      format: (value, rowData) =>
        getImg({ thumbnail: findImgUrl(value, rowData), classes: classes }),
    },
    { id: 'title', label: '', minWidth: 100, format: (value, rowData) => getDescription(rowData) },
    {
      id: 'unitPrice',
      label: 'Unit Price',
      minWidth: 100,
      format: (value) => currencyFormatter(value?.value),
    },
    {
      id: 'totalDiscountAdjustment',
      label: 'Line Discount',
      minWidth: 170,
      align: 'right',
      format: (value) => currencyFormatter(value?.value),
    },
    {
      id: 'totalProduct',
      label: 'Total',
      minWidth: 170,
      align: 'right',
      format: (value) => currencyFormatter(value?.value),
    },
  ];

  const showLastShipmentDeclined = lastOrderStatus === OrderStatus.PAYMENT_REQUIRES_REVIEW;
  const isCardExpired = useMemo(() => showCardExpired(subscriptionData), [subscriptionData]);
  const stat = useMemo(() => getStat(isUpcoming, status), [isUpcoming, status]);
  const isCancelled = stat === Status.CANCELLED;

  const coloradoRetailDeliveryFee = useMemo(() => {
    const fee = orderFees?.find(({ type = '' }) => type === 'RDF_CO');
    return fee?.amount?.value;
  }, [orderFees]);

  const { openEnactmentPage } = useEnactment();

  const openChangePaymentMethodPage = useCallback(
    (id) => {
      openEnactmentPage(`/app/subs/change-payment/${id}`);
    },
    [openEnactmentPage],
  );

  const header = (
    <ActivityHeader
      showActionIcon={false}
      headerSection={<AutoShipCardHeader classes={classes} />}
      title={renderTitle({ name, stat, classes, isDetails: true, getLang })}
      subtitle={makeSubtitle({
        date: isCancelled ? cancelDate : nextFulfillmentDate,
        stat,
        lastShipmentDate,
        startDate,
        showCardExpired: isCardExpired,
        showLastShipmentDeclined,
        frequency,
        subscriptionId: subscriptionData?.id,
        getLang,
      })}
      orderTotal={subscriptionData?.total.value}
      className={isCancelled ? classes.cancelled : classes.activityHeader}
    />
  );

  const subscriptionId = subscriptionData?.id;

  return isOpen ? (
    <BaseDialog
      data-testid="autoship-view-details"
      open={isOpen}
      onClose={handleCloseDialog}
      contentClassName={classes.dialog}
      hideButtonPanel={true}
      closeLabel="Cancel"
      okLabel="Reschedule"
      dialogTitle={header}
      pageName={pageName}
      headerClassName={classes.activityHeader}
      closeButtonClassName={classes.closeButton}
    >
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" data-testid="autoship-view-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionData.items.map((row, rowIndex) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.itemId}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={`${row.itemId}-${column.id}`} align={column.align}>
                          {column.format(value, products[rowIndex])}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell align="left" colSpan={5}>
                  <div className={classes.dialogFooter}>
                    <div>
                      <ProfileInfo className={classes.profileInfo} header="Payment:">
                        {paymentDetails}{' '}
                      </ProfileInfo>
                      <FeatureFlag flag="feature.innovationday.storefront.deeplinking">
                        <Button
                          data-testid="modify-payment-button"
                          variant="text"
                          className={classes.modifyPaymentMethodButton}
                          onClick={() => openChangePaymentMethodPage(subscriptionId)}
                        >
                          Modify Payment Method <ExitToAppIcon className="exitToAppIcon" />
                        </Button>
                      </FeatureFlag>
                    </div>
                    <div>
                      {subscriptionData?.shippingAddress && (
                        <div className={classes.shippingInfo}>
                          <AddressLabel
                            title="Billing Address:"
                            value={{ ...subscriptionData.shippingAddress }}
                          />
                        </div>
                      )}
                    </div>
                    <AutoshipSubTotals
                      subscriptionData={subscriptionData}
                      autoshipTotals={autoshipTotals}
                      coloradoRetailDeliveryFee={coloradoRetailDeliveryFee}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </BaseDialog>
  ) : null;
};

AutoshipViewDetailsDialog.propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func,
  subscriptionData: PropTypes.object,
  paymentDetails: PropTypes.object,
  startDate: PropTypes.string,
  products: PropTypes.array.isRequired,
  isUpcoming: PropTypes.bool,
  cancelDate: PropTypes.string,
  name: PropTypes.string,
  nextFulfillmentDate: PropTypes.string,
  lastShipmentDate: PropTypes.string,
  lastOrderStatus: PropTypes.string,
  status: PropTypes.string,
  frequency: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autoshipTotals: PropTypes.object,
  orderFees: PropTypes.arrayOf(PropTypes.object),
};

export default AutoshipViewDetailsDialog;
