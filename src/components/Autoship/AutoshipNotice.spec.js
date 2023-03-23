import { renderWrap } from '@utils';
import AutoshipNotice from './AutoshipNotice';

describe('<AutoshipNotice />', () => {
  const items = [
    { id: 1, strong: 'Shipping address', weak: 'updated' },
    { id: 2, strong: 'Payment details', weak: 'updated' },
    { id: 3, strong: 'Royal Canine', weak: 'item added' },
    { id: 4, strong: "Beggin' Strips!", weak: 'Quantity updated (2)' },
  ];

  const render = renderWrap(AutoshipNotice, {
    defaultProps: {
      id: 123123,
      items,
      name: 'Toys for Pups',
      updatedAt: '2021-04-08T09:00:00.000Z',
    },
  });

  test('it should render title', () => {
    const { getByText } = render();
    expect(getByText('"Toys for Pups" Autoship Updated')).toBeTruthy();
  });

  test('it should render all items', () => {
    const { container } = render();
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(4);
  });

  test('it should render correct text for items', () => {
    const { container } = render();
    const [first, second, third, fourth] = container.querySelectorAll('li');
    expect(first).toHaveTextContent('Shipping address updated');
    expect(second).toHaveTextContent('Payment details updated');
    expect(third).toHaveTextContent('Royal Canine item added');
    expect(fourth).toHaveTextContent("Beggin' Strips! Quantity updated (2)");
  });
});
