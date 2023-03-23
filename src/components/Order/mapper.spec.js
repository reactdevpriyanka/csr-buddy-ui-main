import PaymentDetails from '@components/PaymentDetails';
import mapper from './mapper';

describe('mapper', () => {
  const order = {
    id: 123,
    lineItems: [
      {
        id: 1,
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
      {
        id: 2,
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
    ],
    payments: {
      paymentInstructions: [{ paymentMethod: 'Credit Card' }, { paymentMethod: 'PayPal' }],
    },
    timePlaced: new Date(),
    total: {
      value: 300,
    },
  };

  const onClick = jest.fn();

  it('maps the order object correctly', () => {
    const expectedOutput = {
      ...order,
      orderNumber: 123,
      itemMap: {
        1: {
          id: 1,
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
        2: {
          id: 2,
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
      },
      orderDate: order.timePlaced,
      paymentDetails: <PaymentDetails details={['Credit Card', 'PayPal']} id={order.id} />,
      total: 300,
      onClick,
    };

    expect(mapper({ order }, onClick)).toEqual(expectedOutput);
  });
});
