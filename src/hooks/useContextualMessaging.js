import { useMemo } from 'react';
import _ from 'lodash';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ATHENA_KEYS from '@/constants/athena';
import useAthena from '@/hooks/useAthena';
import { TrackingEventMappings } from '@/components/ShipmentTracker/trackingConstants';
import { snakeCaseToTitleCase } from '@/utils/string';
import CheckCircleOutlineOutlined from '@mui/icons-material/CheckCircleOutlineOutlined';

const infoTypeBackgroundColors = {
  success: '#006B2B',
  warning: '#FFC80C',
  information: '#1C49C2',
  [undefined]: '#1C49C2',
  [null]: '#1C49C2',
};

const infoTypeFontColors = {
  success: '#FFFFFF',
  warning: '#121212',
  information: '#FFFFFF',
  [undefined]: 'FFFFFF',
  [null]: 'FFFFFF',
};

const infoTypeIcons = {
  success: CheckCircleOutlineOutlined,
  warning: WarningAmberRoundedIcon,
  information: InfoOutlinedIcon,
  [undefined]: InfoOutlinedIcon,
  [null]: InfoOutlinedIcon,
};

export default function useContextualMessaging(trackingEvent) {
  const { getLang } = useAthena();

  const DEFAULT_INFO_TYPE =
    trackingEvent?.eventCode === ('DELIVERED' || '_DELIVERED') ? 'success' : 'information';

  return useMemo(() => {
    const eventCode = trackingEvent?.eventCode;
    const subEventCode = '_' + trackingEvent?.subEventCode;
    const eventMappings = getLang(ATHENA_KEYS.CONTEXTUAL_MESSAGING, {
      fallback: TrackingEventMappings,
    });

    const contextualMessage = eventMappings[eventCode + subEventCode];
    const title = !_.isEmpty(contextualMessage?.eventLabel)
      ? contextualMessage?.eventLabel
      : snakeCaseToTitleCase(eventCode);
    const infoType = contextualMessage?.infoType?.toLowerCase() ?? DEFAULT_INFO_TYPE;

    return {
      contextualMessage,
      eventMappings,
      infoType,
      title,
      alertFontColor: infoTypeFontColors[infoType],
      alertBackgroundColor: infoTypeBackgroundColors[infoType],
      AlertIcon: infoTypeIcons[infoType],
    };
  }, [getLang, trackingEvent]);
}
