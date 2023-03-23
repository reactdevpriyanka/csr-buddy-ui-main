import axios from 'axios';
import { useRouter } from 'next/router';
import AutoshipIcon from '@icons/autoship-logowithtext.svg';
import RxOrderIcon from '@icons/rx-logowithtext.svg';
import VetDietIcon from '@icons/vetdiet-logowithtext.svg';
import useSWR from 'swr';

export const ASSETS = {
  AUTOSHIP: <AutoshipIcon />,
  RX_ORDER: <RxOrderIcon />,
  VET_DIET: <VetDietIcon />,
};

export const defaultDataValues = [
  {
    name: 'AUTOSHIP',
    displayName: 'Autoship',
    description: 'Customer has tried autoship within the past 364 days',
    icon: ASSETS['AUTOSHIP'],
  },
  {
    name: 'RX_ORDER',
    displayName: 'Rx',
    description: 'Customer has made a pharmacy order within the past 364 days',
    icon: ASSETS['RX_ORDER'],
  },
  {
    name: 'VET_DIET',
    displayName: 'VetDiet',
    description: 'Customer has placed a vet diet order in the last 364 days',
    icon: ASSETS['VET_DIET'],
  },
];

export const useCustServices = () => {
  const router = useRouter();

  const { id: customerId } = router.query;

  return useSWR(`/api/v1/customer/${customerId}/services`, async (url) =>
    axios
      .get(url)
      .then(({ data }) => data.map((service) => ({ ...service, icon: ASSETS[service.name] }))),
  );
};
