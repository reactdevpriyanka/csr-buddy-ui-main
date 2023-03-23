import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import OrderDetailsContext from '../OrderDetailsContext';
import PackageDetailsDialog from './PackageDetailsDialog';

jest.mock('date-fns', () => ({ format: jest.fn() }));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

useRouter.mockReturnValue({
  query: {
    id: '1075268420',
  },
});

const defaultProps = {
  type: 'Package',
  open: true,
  openDialog: jest.fn(),
  shipment: {
    id: '428396097',
    shippingModeCode: 'FLATRATE',
    timeShipped: '2022-04-25T00:00:00Z',
    trackingData: {
      shippingStep: 'PACKING_ITEMS',
      shippingStatus: 'UNKNOWN',
      progressPercentage: 20,
      packagesCountFromOrder: 1,
      displayEvents: [
        {
          code: 'ORDER_CREATED',
          date: '2021-07-21T14:58:37Z',
        },
        {
          code: 'ORDER_RELEASED',
          date: '2021-07-21T15:43:10Z',
        },
      ],
    },
    carrierDescription: 'Flat-Rate Shipping',
    trackingUrl: 'nullnull',
    fulfillmentCenterDetails: {
      id: 'AVP2',
      type: 'fulfillmentCenters',
      attributes: {
        fulfillmentCenterId: 'AVP2',
        displayName: 'AVP2',
        fulfillmentCenterType: 'NORMAL',
        address: {
          addressLine1: '999999 Place Rd',
          city: 'Jessup',
          state: 'PA',
          postcode: '123456',
          country: 'US',
          primaryAddress: false,
          verified: false,
        },
        fcEnabled: true,
        fulfillerId: 'da295753-1507-4ea7-a0e6-967b949dda72',
      },
    },
    shipmentItems: [
      {
        lineItemId: '1504574119',
        quantity: 2,
        shippedQuantity: 0,
        partNumber: '49395',
      },
    ],
  },
  release: {
    id: '385335514',
    status: 'MANIFESTED',
    releaseNumber: 4,
    shippingModeCode: 'FLATRATE',
    lineItemIds: ['1504574119'],
    shipmentIds: ['428396097'],
    timeCreated: '2022-04-25T13:53:28.898Z',
    timeUpdated: '2022-04-25T13:53:59.284Z',
  },
  orderNumber: '1075179348',
  orderDate: '2022-04-25T17:59:01.820762Z',
  packageNumber: 1,
  numberOfPackages: 1,
};

const wrappedComponent = () => (
  <OrderDetailsContext.Provider
    value={{
      totalProduct: { value: '52.95' },
      totalSalesTax: { value: '3.50' },
      totalShippingTax: { value: '0.00' },
      totalAdjustment: { value: '-6.29' },
      totalShipping: { value: '0.00' },
      totalBeforeTax: { value: '46.66' },
      total: { value: '50.16' },
      itemMap: {
        id: '1504574119',
        externalId: '392005315',
        status: 'SHIPPED',
        product: {},
        fulfillmentCenter: 'AVP2',
        fulfillmentStatus: 'SHIPPED',
        quantity: 2,
        totalProduct: { value: '31.98' },
        unitPrice: { value: '15.99' },
        can: false,
        food: false,
        shippingCharge: { value: '0.00' },
        totalAdjustment: { value: '0.00' },
        salesTax: { value: '2.40' },
        shippingTax: { value: '0.00' },
        currency: 'USD',
        bundleItem: false,
      },
    }}
  >
    <PackageDetailsDialog {...defaultProps} />
  </OrderDetailsContext.Provider>
);

describe('<PackageDetailsDialog />', () => {
  const render = renderWrap(wrappedComponent);

  test('it should render the package details dialog', () => {
    const { getByTestId } = render();
    expect(getByTestId('package-details-1')).toBeTruthy();
    expect(getByTestId('package-breakdown-1')).toBeTruthy();
  });
});
