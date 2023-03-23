import { getDynamicString } from '@/utils/string';
import { formatDate, isCardExpired } from '@utils/dates';

export const renderTitle = ({ name, stat, classes, isDetails = false, getLang }) => {
  let defaultStr = `Autoship "${name}" Details`;

  if (isDetails) {
    return getDynamicString({
      key: 'autoshipCardTitle',
      fallback: defaultStr,
      substitutions: [name],
      getLang,
    });
  }

  if (stat === Status.CANCELLED) {
    defaultStr = `Cancelled Autoship "${name}"`;
    return (
      <span className={classes.cancelledHeaderTitle}>
        {getDynamicString({
          key: 'autoshipCardCancelTitle',
          fallback: defaultStr,
          substitutions: [name],
          getLang,
        })}
      </span>
    );
  } else if (stat === Status.UPCOMING) {
    defaultStr = `Upcoming Shipment for "${name}" Autoship`;
    return getDynamicString({
      key: 'autoshipCardUpcomingTitle',
      fallback: defaultStr,
      substitutions: [name],
      getLang,
    });
  }
  // else { // fix this after BE type data is avilable
  //   defaultStr = `"${name}" Autoship created`;
  //   return getDynamicString({
  //     key: 'autoshipCardCreatedTitle',
  //     fallback: defaultStr,
  //     substitutions: [name],
  //     getLang,
  //   });
  // }
  else {
    defaultStr = `Upcoming Shipment for "${name}" Autoship`;
    return getDynamicString({
      key: 'autoshipCardUpcomingTitle',
      fallback: defaultStr,
      substitutions: [name],
      getLang,
    });
  }
};

export const Status = {
  UPCOMING: Symbol.for('UPCOMING'),
  CANCELLED: Symbol.for('CANCELED'),
  CREATED: Symbol.for('CREATED'),
};

export const getStat = (isUpcoming, status) =>
  isUpcoming ? Status.UPCOMING : status === 'CANCELED' ? Status.CANCELLED : Status.CREATED;

export const makeSubtitle = ({
  date,
  stat,
  lastShipmentDate,
  startDate,
  showCardExpired,
  showLastShipmentDeclined,
  frequency,
  subscriptionId,
  getLang,
}) => {
  let subtitle = [];

  if (frequency) {
    subtitle.push({ text: `Frequency: ${frequency}` });
  }

  let defaultStr = `Cancelled on ${formatDate(date, false)}`;
  let shipmentDefaultStr = `Next shipment on ${formatDate(date, false)}`;

  const nextDateStr =
    stat === Status.CANCELLED
      ? getDynamicString({
          key: 'autoshipNextDate',
          fallback: defaultStr,
          substitutions: [`${formatDate(date, false)}`],
          getLang,
        })
      : getDynamicString({
          key: 'shipNextDate',
          fallback: shipmentDefaultStr,
          substitutions: [`${formatDate(date, false)}`],
          getLang,
        });

  subtitle.push({
    text: nextDateStr,
  });

  // eslint-disable-next-line unicorn/no-array-push-push
  subtitle.push({ text: `Last shipment on ${formatDate(lastShipmentDate, false)}` });

  if (showCardExpired) {
    subtitle.push({
      text: 'Upcoming shipment will not ship out due to expired card.',
      isError: true,
    });
  }

  if (showLastShipmentDeclined) {
    subtitle.push({
      text: 'Last shipment was declined due to expired card.',
      isError: true,
    });
  }

  if (subscriptionId) {
    subtitle.push({
      text: `Autoship ID: ${subscriptionId}`,
    });
  }

  return subtitle;
};

export const showCardExpired = (subscriptionData) => {
  return subscriptionData?.paymentMethods?.some(({ type, card }) => {
    // Skip showing "expired card" message if PayPal:
    if (type === 'PAYPAL' || !card?.expirationMonth || !card?.expirationYear) {
      return false;
    }
    const { expirationMonth, expirationYear } = card;
    return isCardExpired(expirationMonth, expirationYear);
  });
};

export const getPromotions = (subscriptionData) => {
  return subscriptionData.promotions.reduce((result, item) => {
    const tmpAdjments = item.adjustments.filter((item) => item.type === 'PROMOTION');

    for (const adjustment of tmpAdjments) {
      const obj = result[adjustment.code];

      if (obj) {
        obj.value += adjustment.amount;
      } else {
        result[adjustment.code] = {
          promotion: adjustment.description,
          value: adjustment.amount,
          code: adjustment.code,
        };
      }
    }

    return result;
  }, {});
};
