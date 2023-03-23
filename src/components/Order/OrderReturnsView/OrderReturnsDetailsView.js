/* eslint-disable no-unused-vars */
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import useOrder from '@/hooks/useOrder';
import useReturnDetails from '@/hooks/useReturnDetails';
import useAllowableReturnActions from '@/hooks/useAllowableReturnActions';
import * as blueTriangle from '@utils/blueTriangle';
import { Typography } from '@material-ui/core';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useEffect, useMemo, useState } from 'react';
import useAthena from '@/hooks/useAthena';
import BreadCrumbNavBar from '@/components/BreadCrumbs/BreadCrumbNavBar';
import useFeature from '@/features/useFeature';
import { OrderDetailsViewProperties } from '../OrderDetailsView';
import ReturnDetailsViewLabels from './ReturnDetailsViewLabels';
import ReturnDetailsViewHeader from './ReturnDetailsViewHeader';
import ReturnDetailsViewSummary from './ReturnDetailsViewSummary';
import OrderDetailsReturnCredits from './OrderDetailsReturnCredits';
import { ReturnDetailsSummary } from '.';
import ReplacementOrderDetails from './ReplacementOrderDetails';
import ReturnDetailsItems from './ReturnDetailsItems';
import ReturnRefundDetails from './ReturnRefundDetails';
import ConcessionDetailsSummary from './ConcessionDetailsSummary';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.utils.fromPx(16),
  },
  buttonPanel: {
    display: 'flex',
    justifyContent: 'right',
    columnGap: '1px',
    marginTop: theme.utils.fromPx(16),
  },
  breadCrumbLink: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(18),
    letterSpacing: theme.utils.fromPx(0.16),
    color: '#2661CE',
    '&:focus, &:hover': {
      cursor: 'pointer',
    },
    '& .MuiBreadcrumbs-li': {
      fontSize: theme.utils.fromPx(12),
      lineHeight: theme.utils.fromPx(18),
      letterSpacing: theme.utils.fromPx(0.16),
    },
  },
  breadCrumbStaticText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(18),
    letterSpacing: theme.utils.fromPx(0.16),
  },
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    color: '#666666',
  },
  heading: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: theme.utils.fromPx(20),
    lineHeight: theme.utils.fromPx(25),
    color: '#031657',
  },
  btnTxt: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#1C49C2',
    textTransform: 'none',
  },
  button: {
    background: '#FFFFFF',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    opacity: '1',
    float: 'right',
    height: '40px',
    padding: '14px 20px 14px 20px',
    border: '1px solid #1C49C2 !important',
    borderRadius: '0px',
    backgroundColor: 'white',
    '&:hover': {
      background: '#B8D7F3',
    },
  },
}));

const OrderReturnsDetailsView = ({
  submitter,
  remoteIp,
  comment,
  businessChannel,
  submitterDetail,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { id: customerId, orderId, returnId } = router.query;
  const href = `/customers/${customerId}/activity`;
  const orderPage = `/customers/${customerId}/orders/${orderId}`;

  const { data: orderData } = useOrder(orderId);

  const { data: returnData } = useReturnDetails();

  const { getLang } = useAthena(); // athena config

  const { isActionAllowed } = useAllowableReturnActions(returnId);

  const dynamicBreadcrumbProviderEnabled = useFeature(
    'feature.explorer.dynamicBreadcrumbProviderEnabled',
  );

  const breadcrumb = useMemo(() => {
    return {
      id: 'order-returns-details',
      title: `${returnData?.type} #${returnData?.id}`,
      link: `/customers/${customerId}/orders/${orderId}/order-returns-details/${returnData?.id}`,
    };
  }, [orderId, customerId, returnData]);

  const [componentInitialized, setComponentInitialized] = useState(false);
  const pageName = 'Order Returns View - VT';

  useEffect(() => {
    // do component load work
    setComponentInitialized(true);
    blueTriangle.start(pageName);
  }, []);

  useEffect(() => {
    if (componentInitialized) {
      // do component unload
      blueTriangle.end(pageName);
    }
  }, [componentInitialized]);

  if (!returnData) {
    return null;
  }

  const isReplacement = returnData?.type === 'REPLACEMENT';
  const isRefund = returnData?.type === 'REFUND';
  const isConcession = !['REPLACEMENT', 'REFUND'].includes(returnData?.type);

  return (
    <div data-testid="orderReturnsDetailsView" className={classes.root}>
      {!dynamicBreadcrumbProviderEnabled ? (
        <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrumbLink}>
          <Link className={classes.breadCrumbLink} href={href}>
            {getLang('returnACTIVITYFEED', { fallback: 'ACTIVITY FEED' })}
          </Link>
          <Link
            className={classes.breadCrumbLink}
            data-testid="order:returns:link"
            href={orderPage}
          >
            {`ORDER #${returnData?.orderId}`}
          </Link>
          <Typography
            className={classes.breadCrumbStaticText}
            data-testid="order:returns:staticText"
          >
            {returnData?.type} #{returnData?.id}
          </Typography>
        </Breadcrumbs>
      ) : (
        <BreadCrumbNavBar breadcrumb={breadcrumb} />
      )}
      <ReturnDetailsViewHeader
        returnData={returnData}
        isActionAllowed={isActionAllowed}
        orderId={orderId}
      />
      <ReturnDetailsViewSummary returnData={returnData} />
      <ReturnDetailsSummary returnData={returnData} />
      {(isReplacement || isRefund) && <ReturnDetailsItems returnData={returnData} />}
      <ReturnDetailsViewLabels
        returnData={returnData}
        returnId={returnId}
        orderId={orderId}
        isActionAllowed={isActionAllowed}
      />
      {isConcession && <ConcessionDetailsSummary returnData={returnData} />}
      {(isConcession || isRefund) && <ReturnRefundDetails returnData={returnData} />}
      {isReplacement && <ReplacementOrderDetails returnData={returnData} />}
      {(isConcession || isRefund) && <OrderDetailsReturnCredits returnData={returnData} />}
      <OrderDetailsViewProperties
        submitter={orderData?.submitter}
        channel={orderData?.businessChannel}
        remoteIp={orderData?.remoteIp}
        comment={orderData?.comment}
        submitterDetail={orderData?.submitterDetail}
      />
    </div>
  );
};

OrderReturnsDetailsView.propTypes = {
  submitter: PropTypes.string.isRequired,
  remoteIp: PropTypes.string.isRequired,
  businessChannel: PropTypes.string.isRequired,
  submitterDetail: PropTypes.object.isRequired,
  comment: PropTypes.string.isRequired,
};

export default OrderReturnsDetailsView;
