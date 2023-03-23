import { renderWrap } from '@/utils';
import { fireEvent } from '@testing-library/react';
import SplitButton from './SplitButton';

const menuItems = [
  {
    label: 'Send Order Confirmation',
    action: () => {},
    display: true,
    disabled: false,
  },
  {
    label: 'Send Order Invoice',
    action: () => {},
    display: true,
    disabled: false,
  },
];

const defaultProps = {
  label: 'Fix Issue',
  action: () => {},
  disabled: false,
  menuItems: menuItems,
  menuIcon: null,
};

describe('<SplitButton />', () => {
  const render = renderWrap(SplitButton, { defaultProps });

  test('it should display a split button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`split-button-group`)).toBeInTheDocument();
    expect(getByTestId(`split-button-label`)).toBeInTheDocument();
    expect(getByTestId(`split-button-menu-button`)).toBeInTheDocument();
  });

  test('it should render two menu items', () => {
    const { getByText, getByTestId } = render();
    const button = getByTestId('split-button-menu-button');
    fireEvent.click(button);
    const sendOrderConfirmation = getByText('Send Order Confirmation');
    expect(sendOrderConfirmation).toBeInTheDocument();
    const sendOrderInvoice = getByText('Send Order Invoice');
    expect(sendOrderInvoice).toBeInTheDocument();
  });
});
