import { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@components/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
  ActivityHeader,
  Card,
  GridContent,
  Product,
  ProfileInfo,
  SplitContent,
} from '@components/Card';
import { getDynamicString } from '@/utils/string';
import useSubscription from '@/hooks/useSubscription';
import { formatDate, getDayDateTimeTime } from '@utils/dates';
// eslint-disable-next-line import/no-unresolved
import { OrderStatus } from '@/constants/OrderStatus';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@material-ui/core';
import useSubscriptions from '@/hooks/useSubscriptions';
import useFeature from '@/features/useFeature';
import useAthena from '@/hooks/useAthena';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';
import useEnactment from '@/hooks/useEnactment';
import SplitButton from '../Button/SplitButton';
import TooltipPrimary from '../TooltipPrimary';
import ModalContext, { MODAL } from '../ModalContext';
import AutoshipSideInfo from './AutoshipSideInfo';
import AutoshipShipNowDialog from './AutoshipActionDialogs/AutoshipShipNowDialog';
import AutoshipRescheduleDialog from './AutoshipActionDialogs/AutoshipRescheduleDialog';
import AutoshipCancelDialog from './AutoshipActionDialogs/AutoshipCancelDialog';
import AutoshipSkipNextDialog from './AutoshipActionDialogs/AutoshipSkipNextDialog';
import { AutoshipChangeFrequencyDialog } from './AutoshipActionDialogs';
import {
  frequencyUomMapper,
  frequencyUomTypeMapper,
  frequencyUomTypesConst,
  getFrequency,
  MAX_NUM_DAYS,
  MAX_NUM_MONTHS,
  MAX_NUM_WEEKS,
  MIN_NUM_DAYS,
  MIN_NUM_MONTHS,
  MIN_NUM_WEEKS,
} from './constants';
import { getStat, makeSubtitle, renderTitle, showCardExpired, Status } from './utils';
import AutoShipCardHeader from './AutoShipCardHeader';
import AutoshipBlocks from './AutoshipBlocks';

const useStyles = makeStyles((theme) => ({
  root: {},
  cardDisabled: {
    pointerEvents: 'none',
  },
  profileInfo: {
    display: 'grid',
    gap: `${theme.utils.fromPx(10)}`,
    gridTemplateColumns: `${theme.utils.fromPx(300)} auto auto`,
    alignItems: 'center',
    background: '#F5F5F5',
    padding: `${theme.utils.fromPx(15)}`,
  },
  cancelled: {
    opacity: '0.4',
  },
  profileInfoHeader: {
    marginLeft: '50px',
  },
  form: {
    '& .MuiFormControl-root': {
      width: '-webkit-fill-available',
    },
  },
  btnChangeFrequency: {
    marginTop: '0px',
  },
  cancelReasonMenu: {
    '& .MuiMenuItem-root': {
      fontSize: `${theme.utils.fromPx(14)}`,
    },
    '& .MuiList-root': {
      backgroundColor: theme.palette.blue.dark,
      color: theme.palette.white,
      '&:hover': {
        backgroundColor: '#010B39',
      },
    },
  },
  btnModifyAutoship: {
    color: '#1C49C2',
    border: '2px solid transparent',
    '&:focus, &:hover': {
      textDecoration: 'underline',
      border: '2px solid',
    },
  },
  textField: {
    width: 120,
  },
  textField2: {
    width: 240,
  },
  inputLabel: {
    minWidth: 300,
  },
  rescheduleDialogTitle: {
    marginTop: theme.spacing(1),
    display: 'grid',
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  dialogContainer: {
    height: '700px',
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    fontSize: 20,
  },
  dialogInnerTitle: {
    alignContent: 'center',
    display: 'grid',
  },
  closeButton: {
    color: theme.palette.white,
    marginRight: '-12px',
  },
  dialogContent: {
    marginBottom: theme.utils.fromPx(20),
  },
  dialogActions: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  headerAction: {
    padding: theme.spacing(2),
    margin: `-${theme.spacing(2)}`,
  },
  inputComponent: {
    width: '250px',
    border: '1px solid #D3D4D0',
    borderRadius: '5px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 0 0 rgba(170,170,170,0.01)',
    display: 'flex',
  },
  buttonMargin: {
    marginTop: '12px',
  },
  btnSfwLogin: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    marginTop: '12px',
    marginBottom: '12px',
    minWidth: '20px',
    width: '70px',
    display: 'inline-block',
  },
  btnSfwAutoship: {
    marginTop: '12px',
    minWidth: '40px',
    width: '300px',
    display: 'inline-block',
  },
  actions: {},
  cancelMenuItem: {
    color: '#F9BBC7',
  },
  exitToAppIcon: {
    marginLeft: '5px !important',
  },
  autoshipLabelIcon: {
    display: 'inline-block',
    marginLeft: theme.utils.fromPx(3),
    height: theme.utils.fromPx(14),
    lineHeight: 2,
  },
  autoshipLabel: {
    ...theme.fonts.bodyBold,
    color: theme.palette.black.dark,
    display: 'inline-block',
    marginLeft: theme.utils.fromPx(3),
    lineHeight: 0.05,
    fontSize: 12,
  },
  autoshipContainerIcon: {
    alignSelf: 'center',
  },
  autoshipContainer: {
    display: 'inline-flex',
    paddingLeft: '5px',
    backgroundColor: '#f5f5f5',
    borderLeftColor: '#EF6C00',
    borderLeftStyle: 'solid',
    borderLeftWidth: '5px',
  },
  autoshipLabelIconLg: {
    width: '40px',
    height: '40px',
  },
  cancelledHeaderTitle: {
    color: theme.palette.red.dark,
  },
  products: {
    paddingTop: theme.spacing(1),
  },
}));

const AutoshipCard = ({
  action,
  status,
  cancelDate,
  isUpcoming = false,
  frequency,
  fulfillmentFrequency,
  fulfillmentFrequencyUom,
  id,
  name,
  nextFulfillmentDate,
  lastShipmentDate,
  lastOrderStatus,
  paymentDetails,
  products = [],
  shippingAddress,
  autoshipTotals,
  blocks = [],
  orderFees,
}) => {
  const classes = useStyles();
  const { getLang } = useAthena();

  const AUTOSHIP_RESEND_EMAIL_FEATURE_FLAG = 'feature.explorer.autoshipResendEmailEnabled';
  const enableResendEmail = useFeature(AUTOSHIP_RESEND_EMAIL_FEATURE_FLAG);

  const [newFulfillmentFrequency, setNewFulfillmentFrequency] = useState(fulfillmentFrequency);

  const [newFulfillmentFrequencyUom, setNewFulfillmentFrequencyUom] = useState(
    fulfillmentFrequencyUom,
  );

  const [openChangeFrequencyAutoshipDialog, setOpenChangeFrequencyAutoshipDialog] = useState(false);
  const [openAutoshipCancleDialog, setOpenAutoshipCancleDialog] = useState(false);
  const [openAutoshipRescheduleDialog, setOpenAutoshipRescheduleDialog] = useState(false);
  const [openAutoshipSkipNextDialogDialog, setOpenAutoshipSkipNextDialogDialog] = useState(false);
  const [openShipNowDialog, setOpenShipNowDialog] = useState(false);
  const { id: customerId } = useSanitizedRouter();
  const { useSubscriptionCancelReasons, resendSubscriptionEmail } = useSubscriptions();
  const { data: subscriptionData } = useSubscription(id);
  const { openEnactmentPage } = useEnactment();
  const startDate =
    subscriptionData?.timePlaced && new Date(subscriptionData.timePlaced).toISOString();

  useEffect(() => {
    setNewFulfillmentFrequency(fulfillmentFrequency);
    setNewFulfillmentFrequencyUom(fulfillmentFrequencyUom);
  }, [fulfillmentFrequency, fulfillmentFrequencyUom]);

  const isCardExpired = useMemo(() => showCardExpired(subscriptionData), [subscriptionData]);

  const showLastShipmentDeclined = lastOrderStatus === OrderStatus.PAYMENT_REQUIRES_REVIEW;

  const { data: cancelReasons = [] } = useSubscriptionCancelReasons();
  const { setModal, modal } = useContext(ModalContext);

  const { captureInteraction } = useAgentInteractions();

  const postInteraction = useCallback(
    (type, data, action) => {
      captureInteraction({
        subjectId: id,
        type: type,
        action: action,
        currentVal: data,
        prevVal: {},
      });
    },
    [id, captureInteraction],
  );
  const isAutoshipContainerShown = modal === MODAL.AUTOSHIPCONTAINER;

  const onDetailsClick = useCallback(
    (name) => {
      const frequency = getFrequency(newFulfillmentFrequency, newFulfillmentFrequencyUom);

      setModal(isAutoshipContainerShown ? null : MODAL.AUTOSHIPCONTAINER, {
        props: {
          subscriptionId: id,
          customerId: customerId,
          subscriptionName: name,
          frequency: frequency,
        },
      });
    },
    [isAutoshipContainerShown, setModal],
  );

  const captureEmailInteraction = useCallback(() => {
    const data = {
      name: name,
      eventType: 'NOTIFICATION',
      customerId: customerId,
      subscriptionId: subscriptionData?.id,
      notificationType: 'AUTOSHIP_CREATED',
    };
    postInteraction('AUTOSHIP_NOTIFICATION_RESENT', data, 'UPDATE');
  }, [name, customerId, subscriptionData]);

  const onSendEmail = useCallback(() => {
    resendSubscriptionEmail(subscriptionData?.id, customerId, captureEmailInteraction);
  }, [subscriptionData, customerId]);

  const stat = useMemo(() => getStat(isUpcoming, status, [isUpcoming, status]));

  const isCancelled = stat === Status.CANCELLED;

  const onChangeSubscription = useCallback(
    (id) => {
      openEnactmentPage(`/app/subs/manager/view/${id}`);
    },
    [openEnactmentPage],
  );

  const manageOrderMenuItems = [
    {
      key: 'Ship Now',
      label: 'Ship Now',
      action: () => {
        setOpenShipNowDialog(true);
      },
      display: !isCancelled,
      disabled: false,
    },
    {
      key: 'Modify Autoship',
      label: 'Modify Autoship',
      action: () => {
        onChangeSubscription(id);
      },
      display: !isCancelled,
      disabled: false,
      menuItemIcon: <ExitToAppIcon className="exitToAppIcon" />,
    },
    {
      key: 'Skip Next Shipment',
      label: 'Skip Next Shipment',
      action: () => {
        setOpenAutoshipSkipNextDialogDialog(true);
      },
      display: !isCancelled,
      disabled: false,
    },
    {
      key: 'Resend Email',
      label: 'Resend Email',
      action: () => {
        onSendEmail();
      },
      display: enableResendEmail,
      disabled: false,
    },
    {
      key: 'Divider 1',
      label: '',
      display: true,
      disabled: false,
      isDivider: true,
    },
    {
      key: 'Cancel Autoship',
      label: 'Cancel Autoship',
      action: () => {
        setOpenAutoshipCancleDialog(true);
      },
      display: !isCancelled,
      disabled: false,
      menuItemClasses: classes.cancelMenuItem,
    },
  ];

  const nextDate = isCancelled ? cancelDate : nextFulfillmentDate;
  let defaultStr = `Cancelled on ${formatDate(nextDate, false)}`;
  const nextDateStr =
    stat === Status.CANCELLED
      ? getDynamicString({
          key: 'autoshipNextDate',
          fallback: defaultStr,
          substitutions: [`${formatDate(nextDate, false)}`],
          getLang,
        })
      : `${getDayDateTimeTime(nextDate)}`;

  const header = (
    <ActivityHeader
      action={
        <SplitButton
          label="Manage Autoship"
          menuItems={manageOrderMenuItems}
          menuIcon={<ArrowDropDownIcon data-dd-action-name="Manage AS Overflow" />}
        />
      }
      status={status}
      subscriptionId={id}
      showActionIcon={false}
      autoshipCard={true}
      headerSection={<AutoShipCardHeader classes={classes} />}
      title={renderTitle({ name, stat, classes, getLang })}
      subtitle={makeSubtitle({
        date: isCancelled ? cancelDate : nextFulfillmentDate,
        stat,
        lastShipmentDate,
        startDate,
        showCardExpired: isCardExpired,
        showLastShipmentDeclined,
        getLang,
      })}
      className={isCancelled ? classes.cancelled : ''}
    />
  );

  const handleOnClickModifyAutoshipBtn = () => {
    setOpenAutoshipRescheduleDialog(true);
  };

  const getMenuItemsByUOM = (uom, minItems, maxItems) => {
    const menuItems = [];

    // Add Days menu items
    for (let index = minItems; index <= maxItems; index++) {
      const element = {
        id: index,
        value: `${index}-${uom}`,
        label: getFrequency(index, uom),
        disabled: false,
      };
      menuItems.push(element);
    }

    return menuItems;
  };
  const frequencyUomMenuItems = useMemo(() => {
    const menuItems = [
      {
        id: 0,
        value: 0,
        label: frequencyUomTypeMapper[newFulfillmentFrequencyUom],
        disabled: true,
      },
    ];

    const days = getMenuItemsByUOM(frequencyUomTypesConst.DAY, MIN_NUM_DAYS, MAX_NUM_DAYS);
    const weeks = getMenuItemsByUOM(frequencyUomTypesConst.WEEK, MIN_NUM_WEEKS, MAX_NUM_WEEKS);
    const months = getMenuItemsByUOM(frequencyUomTypesConst.MON, MIN_NUM_MONTHS, MAX_NUM_MONTHS);

    return [...menuItems, ...days, ...weeks, ...months];
  }, [newFulfillmentFrequencyUom, newFulfillmentFrequency]);

  const handleChangeFrequency = (event) => {
    const tmpFrequency = event.target.value.split('-')[0];
    const tmpFrequencyUOM = event.target.value.split('-')[1];

    setNewFulfillmentFrequency(tmpFrequency);
    setNewFulfillmentFrequencyUom(tmpFrequencyUOM);
    setOpenChangeFrequencyAutoshipDialog(true);
  };

  const onCancelChangeFrequency = useCallback((tmpFrequency, tmpFrequencyUOM) => {
    setNewFulfillmentFrequency(tmpFrequency);
    setNewFulfillmentFrequencyUom(tmpFrequencyUOM);
  }, []);

  const isSelectableItem = useMemo(() => {
    if (frequencyUomTypesConst.DAY === newFulfillmentFrequencyUom) {
      return newFulfillmentFrequency >= MIN_NUM_DAYS && newFulfillmentFrequency <= MAX_NUM_DAYS;
    } else if (frequencyUomTypesConst.WEEK === newFulfillmentFrequencyUom) {
      return newFulfillmentFrequency >= MIN_NUM_WEEKS && newFulfillmentFrequency <= MAX_NUM_WEEKS;
    } else {
      return newFulfillmentFrequency >= MIN_NUM_MONTHS && newFulfillmentFrequency <= MAX_NUM_MONTHS;
    }
  }, [newFulfillmentFrequency, newFulfillmentFrequencyUom]);

  const showBlocks = blocks.filter((block) => !block.resolved).length > 0;
  const showAutoshipOrderBlock = useFeature('feature.explorer.autoshipOrderBlockBannerEnabled');

  const content = (
    <>
      <div className={cn(classes.profileInfo, isCancelled ? classes.cancelled : '')}>
        <form className={classes.form}>
          <FormControl variant="outlined">
            {isSelectableItem ? (
              <>
                <InputLabel shrink>Frequency</InputLabel>
                <Select
                  value={`${newFulfillmentFrequency}-${newFulfillmentFrequencyUom}`}
                  onChange={handleChangeFrequency}
                  data-testid="change-frequency-uom"
                  input={<OutlinedInput notched label="Frequency" />}
                >
                  {frequencyUomMenuItems?.map(({ id, value, label, disabled }) => (
                    <MenuItem key={id} value={value} disabled={disabled}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </>
            ) : (
              <TooltipPrimary
                title="To change the frequency use the Reschedule link"
                className={classes.tooltip}
              >
                <TextField
                  label="Frequency"
                  value={`${newFulfillmentFrequency} ${frequencyUomMapper[newFulfillmentFrequencyUom]}`}
                  name="fulfillmentFrequency"
                  data-testid="change-frequency"
                  variant="outlined"
                  disabled
                />
              </TooltipPrimary>
            )}
          </FormControl>
        </form>
        <ProfileInfo
          className={classes.profileInfoHeader}
          header="Next Order on:"
          disabled={isCancelled}
        >
          {nextDateStr}
        </ProfileInfo>

        <Button
          className={classes.btnModifyAutoship}
          onClick={handleOnClickModifyAutoshipBtn}
          data-testid="modify-autoship"
          aria-label="Reschedule"
        >
          <span>Reschedule</span>
        </Button>
      </div>
      <div className={classes.products}>
        <GridContent disabled={isCancelled}>
          {products?.map(
            ({ id, title, quantity, thumbnail, price, catalogEntryId, partNumber }) => (
              <Product
                key={id}
                id={id}
                title={title}
                price={price}
                quantity={quantity}
                thumbnail={thumbnail}
                partNumber={partNumber}
                catalogEntryId={catalogEntryId}
              />
            ),
          )}
        </GridContent>
      </div>
    </>
  );

  const actions = (
    <>
      <AutoshipSideInfo
        subscriptionData={subscriptionData}
        products={products}
        paymentDetails={paymentDetails}
        onSeeHistory={onDetailsClick}
        startDate={startDate}
        isCancelled={isCancelled}
        isUpcoming={isUpcoming}
        name={name}
        nextFulfillmentDate={nextFulfillmentDate}
        lastShipmentDate={lastShipmentDate}
        cancelDate={cancelDate}
        lastOrderStatus={lastOrderStatus}
        status={status}
        frequency={getFrequency(fulfillmentFrequency, fulfillmentFrequencyUom)}
        autoshipTotals={autoshipTotals}
        orderFees={orderFees}
      />
      <AutoshipSkipNextDialog
        name={name}
        customerId={customerId}
        subscriptionId={id}
        isOpen={openAutoshipSkipNextDialogDialog}
        openDialog={setOpenAutoshipSkipNextDialogDialog}
        postInteraction={postInteraction}
      />
      <AutoshipShipNowDialog
        id={id}
        name={name}
        customerId={customerId}
        frequency={frequency}
        nextFulfillmentDate={nextFulfillmentDate}
        isOpen={openShipNowDialog}
        openDialog={setOpenShipNowDialog}
        postInteraction={postInteraction}
      />
      <AutoshipRescheduleDialog
        id={id}
        name={name}
        customerId={customerId}
        frequency={frequency}
        nextFulfillmentDate={nextFulfillmentDate}
        startDate={startDate}
        fulfillmentFrequency={fulfillmentFrequency}
        fulfillmentFrequencyUom={fulfillmentFrequencyUom}
        isOpen={openAutoshipRescheduleDialog}
        openDialog={setOpenAutoshipRescheduleDialog}
        postInteraction={postInteraction}
      />
      <AutoshipCancelDialog
        id={id}
        name={name}
        customerId={customerId}
        cancelReasons={cancelReasons}
        isOpen={openAutoshipCancleDialog}
        openDialog={setOpenAutoshipCancleDialog}
        postInteraction={postInteraction}
      />

      <AutoshipChangeFrequencyDialog
        id={id}
        name={name}
        customerId={customerId}
        fulfillmentFrequency={fulfillmentFrequency}
        fulfillmentFrequencyUom={fulfillmentFrequencyUom}
        newFulfillmentFrequency={newFulfillmentFrequency}
        newFulfillmentFrequencyUom={newFulfillmentFrequencyUom}
        isOpen={openChangeFrequencyAutoshipDialog}
        openDialog={setOpenChangeFrequencyAutoshipDialog}
        postInteraction={postInteraction}
        onCancel={onCancelChangeFrequency}
      />
    </>
  );

  return (
    <Card
      disabledCard={isCancelled}
      header={header}
      className={isCancelled ? classes.cardDisabled : ''}
      id={`AutoshipCard_${id}`}
      data-testid={`autoshipDetailsCard_${id}`}
    >
      {showBlocks && showAutoshipOrderBlock && (
        <AutoshipBlocks blocks={subscriptionData?.blocks} id={subscriptionData?.id} />
      )}
      <SplitContent actionsClassName={classes.actions} actions={actions} content={content} />
    </Card>
  );
};

AutoshipCard.propTypes = {
  action: PropTypes.string,
  cancelDate: PropTypes.string,
  frequency: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fulfillmentFrequency: PropTypes.number,
  fulfillmentFrequencyUom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  status: PropTypes.string,
  isUpcoming: PropTypes.bool,
  name: PropTypes.string,
  nextFulfillmentDate: PropTypes.string,
  lastShipmentDate: PropTypes.string,
  lastOrderStatus: PropTypes.string,
  paymentDetails: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  products: PropTypes.array.isRequired,
  shippingAddress: PropTypes.object,
  autoshipTotals: PropTypes.object,
  blocks: PropTypes.arrayOf(PropTypes.object),
  orderFees: PropTypes.arrayOf(PropTypes.object),
};

export default AutoshipCard;
