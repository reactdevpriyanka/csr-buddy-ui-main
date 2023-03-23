import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import { snakeCaseToTitleCase } from '@/utils/string';
import { useMemo } from 'react';
import _groupBy from 'lodash/groupBy';

export const getContactReason = (details) => {
  if (details?.tertiary) return snakeCaseToTitleCase(details.tertiary);
  else if (details?.secondary) return snakeCaseToTitleCase(details.secondary);
  else if (details?.primary) return snakeCaseToTitleCase(details.primary);
  else return null;
};

export const getContactChannelIcon = (channel) => {
  switch ((channel || '').toLowerCase()) {
    case 'chat':
      return <ForumIcon />;
    case 'email':
    case 'online form':
      return <EmailIcon />;
    default:
      return <PhoneCallbackIcon />;
  }
};

export const useShippingAppeasements = (appeasements) => {
  return useMemo(() => {
    let includeShippingConcession = appeasements.some(
      (appeasement) => appeasement?.description === 'shipping',
    );

    if (!includeShippingConcession) {
      return appeasements;
    }

    let mergedAppeasements = [];
    let shippingAppeasements = appeasements.filter(
      ({ actions }) => actions?.[0]?.type === 'SHIPPING_CONCESSION',
    );
    let shippingAppeasementsGroupedById = _groupBy(
      shippingAppeasements,
      (appeasement) => appeasement.appeasementId,
    );

    // filter out shipping concession appeasements before we push merged shipping appeasements in
    mergedAppeasements = appeasements.filter(
      ({ actions }) => actions?.[0]?.type !== 'SHIPPING_CONCESSION',
    );

    // Merge the shipping concessions (dummy shipping line item is added in ConcessionTable on submit)
    for (const appeasementId in shippingAppeasementsGroupedById) {
      let mergedShippingAppeasement = shippingAppeasementsGroupedById[appeasementId].reduce(
        (merged, currAppeasement) => {
          return { ...currAppeasement, ...merged };
        },
        {},
      );

      mergedAppeasements.push(mergedShippingAppeasement);
    }

    return mergedAppeasements;
  }, [appeasements]);
};
