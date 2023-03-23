import { renderWrap } from '@utils';
import PopoverOrderItem from './PopoverOrderItem';

describe('<PopoverOrderItem />', () => {
  const render = renderWrap(PopoverOrderItem, {
    testId: 'autoship-container-card',
    defaultProps: {
      orderId: '1070051333',
      orderTotal: '31.33',
      frequency: 'Every 4 weeks',
      status: 'READY_TO_RELEASE',
    },
  });

  test('it should render 2 line items', () => {
    const { getByText } = render();

    expect(getByText('Order #1070051333')).toBeTruthy();
    expect(getByText('Frequency: Every 4 weeks')).toBeTruthy();
    expect(getByText('Order Total')).toBeTruthy();
    expect(getByText('$31.33')).toBeTruthy();
    expect(getByText('Status')).toBeTruthy();
    expect(getByText('READY_TO_RELEASE')).toBeTruthy();
  });
});
