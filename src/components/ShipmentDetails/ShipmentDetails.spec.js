import { renderWrap } from '@/utils';
import { useRouter } from 'next/router';
import useCustomer from '@/hooks/useCustomer';
import happyCustomer from '../../../__mock__/customers/happy';
import ShipmentDetails from './ShipmentDetails';

const defaultProps = {
  currentShipment: {
    id: '72580231',
    nickname: 'c40b1313-e8b8-4158-acb4-2f915c7bfb2a',
    fullName: 'Eric Natelson',
    addressLine1: '4201 N DALE MABRY HWY',
    city: 'TAMPA',
    state: 'FL',
    postcode: '33607-6103',
    country: 'US',
    primaryAddress: false,
  },
  currentPayment: null,
  editable: true,
  orderNumber: 1975555282,
  toggleEdit: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useCustomer');
jest.mock('@/hooks/useAgentInteractions');

describe('<ShipmentDetails />', () => {
  const render = renderWrap(ShipmentDetails, { defaultProps });

  const push = jest.fn();

  useRouter.mockImplementation(() => ({
    push,
    pathname: '/',
    route: '/',
    asPath: '/',
    query: { id: '123' },
  }));

  useCustomer.mockReturnValue(happyCustomer);

  test('it should display shipment details', () => {
    const { getByTestId } = render();
    expect(getByTestId(`shipment-details-${defaultProps.orderNumber}`)).toBeTruthy();
  });

  test('it should display save edit button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`save-edit-btn-${defaultProps.orderNumber}`)).toBeTruthy();
  });

  test('it should display switch address select', () => {
    const { getByTestId } = render();
    expect(getByTestId(`switch-address-select-${defaultProps.orderNumber}`)).toBeTruthy();
  });
});
