import { render } from '@testing-library/react';
import OrderMeta from './OrderMeta';

describe('OrderMeta', () => {
  it('renders the correct total price and total items', () => {
    const totalPrice = 1999; // $19.99
    const totalItems = 3;
    const { getByText } = render(<OrderMeta totalPrice={totalPrice} totalItems={totalItems} />);
    const priceText = getByText('$19.99');
    const itemsText = getByText('3 items');
    expect(priceText).toBeInTheDocument();
    expect(itemsText).toBeInTheDocument();
  });
});
