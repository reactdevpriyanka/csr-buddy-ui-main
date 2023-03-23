import renderWrap from '@/utils/renderWrap';
import { useRouter } from 'next/router';
import * as useReturnDetails from '@/hooks/useReturnDetails';
import CreateNewLabelsDialog from './CreateNewLabelsDialog';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '1234',
  },
  pathname: '/autoship',
});

describe('<CreateNewLabelsDialog />', () => {
  const useReturnDetailsSpy = jest.spyOn(useReturnDetails, 'default');
  useReturnDetailsSpy.mockReturnValue({
    useReturnLabels: () => {
      return {
        data: [
          {
            returnId: '01229b2f-a789-44b5-91a6-a80d5096e8f3',
            timeCreated: '2023-01-31T22:22:25.163843Z',
            destination: {
              type: 'CFC',
              code: 'AVP1',
              vendorName: 'Chewy Returns AVP1',
              address: {
                contactName: 'Chewy Returns AVP1',
                phoneNumber: '566-935-4844',
                street1: '600 New Commerce Blvd',
                street2: 'Suite R',
                city: 'Hanover Township',
                state: 'PA',
                postcode: '18706',
                country: 'US',
              },
            },
            received: false,
          },
        ],
      };
    },
  });

  const render = renderWrap(CreateNewLabelsDialog, {
    defaultProps: {
      isOpen: true,
      handleClose: jest.fn(),
      returnId: '123',
      orderId: '456',
    },
  });

  test('it should render the CreateNewLabelsDialog component', () => {
    const { getByTestId } = render();
    expect(getByTestId('address:600 New Commerce Blvd')).toBeTruthy();
    expect(getByTestId('destination:AVP1')).toBeTruthy();
  });
});
