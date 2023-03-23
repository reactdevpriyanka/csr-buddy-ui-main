import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import useSubscription from '@/hooks/useSubscription';
import products from '__mock__/activities/autoship-products';
import cancelReasons from '__mock__/activities/cancel-reasons';
import autoshipOrder from '__mock__/activities/autoship-order';
import Button from '@components/Button';
import { fireEvent } from '@testing-library/react';
import AutoshipCard from './AutoshipCard';

jest.mock('@/hooks/useSubscription');

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

describe('<AutoshipCard />', () => {
  /**
   * TODO
   * Consider refactoring to reduce dependency on `useRouter` in subcomponents...
   * maybe just write a hook that's easily testable?
   */
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
    pathname: '/autoship',
  });

  beforeEach(() => {
    useSubscription.mockReturnValue({
      data: autoshipOrder,
      error: null,
    });
  });

  const render = renderWrap(AutoshipCard, {
    testId: 'change-nfd',
    defaultProps: {
      id: '123123',
      name: 'Toys for Pups',
      status: 'ACTIVE',
      frequency: 'Every 6 weeks',
      nextFulfillmentDate: '2021-04-08T13:15:00.260Z',
      lastShipmentDate: '2021-03-08T12:24:56.393Z',
      paymentDetails: 'Mastercard ending in 0351',
      products,
      action: '/subscriptions/123123',
      cancelReasons,
      swfLink: '/app/su?logonId=admin&switchUserId=12345',
    },
  });

  test('it should render next shipment date', () => {
    const { getByText } = render();
    expect(getByText(/next shipment on 4\/8\/2021/i)).toBeTruthy();
  });

  test('it should render last shipment date', () => {
    const { getByText } = render();
    expect(getByText(/last shipment on 3\/8\/2021/i)).toBeTruthy();
  });

  test('it should render payment details', () => {
    const { getByText } = render();
    expect(getByText('Mastercard ending in 0351')).toBeTruthy();
  });

  describe('<Google Pay />', () => {
    const render = renderWrap(AutoshipCard, {
      defaultProps: {
        paymentDetails: 'Google Pay',
      },
    });

    test('it should render Google Pay', () => {
      const { getByText } = render();
      expect(getByText('Google Pay')).toBeTruthy();
    });
  });

  describe('with cancelled autoship', () => {
    const cancelled = (props = {}) =>
      render({
        cancelDate: '2021-04-09T14:00:00.000Z',
        status: 'CANCELED',
        ...props,
      });

    test('it should render cancelled title', () => {
      const { getByText } = cancelled();

      expect(getByText('Cancelled Autoship "Toys for Pups"')).toBeTruthy();
    });

    test('it should render cancelled subtitle', () => {
      const { getAllByText } = cancelled();

      expect(getAllByText(/cancelled on 4\/9\/2021/i)).toHaveLength(2);
    });
  });

  describe('with isUpcoming={true}', () => {
    test('it should render upcoming autoship notification', () => {
      const { getByText } = render({ isUpcoming: true });

      expect(getByText('Upcoming Shipment for "Toys for Pups" Autoship')).toBeTruthy();
    });
  });

  describe('<Button />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Change NFD',
      },
    });

    afterEach(() => onClick.mockReset());

    test('it should display button', () => {
      const button = (props) => render(props).getByRole('button');
      expect(button()).toBeTruthy();
    });

    test('it should call `DatePicker`', () => {
      const { getByRole } = render({ button: 'Change NFD' });
      const nfdElement = getByRole('button', { className: 'btnChangeNfd' });
      expect(nfdElement).toBeTruthy();
    });

    test('it should change date on `DatePicker`', () => {
      const { getByRole } = render({ button: 'Change NFD' });
      const nfdDate = getByRole('button', { className: 'btnChangeNfd' });
      fireEvent.click(nfdDate);
      fireEvent.mouseDown(nfdDate);
      fireEvent.change(nfdDate, { target: { value: '10-12-2020' } });
      expect(nfdDate).toHaveValue('10-12-2020');
    });
  });
  describe('<NewButton />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Change Frequency',
      },
    });

    test('it should find `Frequency button`', () => {
      const { getByRole } = render({ button: 'Change NFD' });
      const nfdElement = getByRole('button', { className: 'btnChangeFrequency' });
      expect(nfdElement).toBeTruthy();
    });
  });

  describe('<RescheduleButton />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Reschedule',
      },
    });

    test('it should open Dialog', () => {
      const { getByRole } = render({ button: 'Reschedule' });
      const rescheduleDialog = getByRole('button', { className: 'btnChangeFrequency' });
      fireEvent.click(rescheduleDialog);
      expect(rescheduleDialog).toBeTruthy();
    });

    test('it should change Date Calendar', () => {
      const { getByRole } = render({ button: 'date' });
      const date = getByRole('button', { className: 'date' });
      fireEvent.click(date);
      fireEvent.mouseDown(date);
      fireEvent.change(date, { target: { value: '10-12-2020' } });
      expect(date).toHaveValue('10-12-2020');
    });
  });
  describe('<ModifyAutohipbtn />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Modify Autoship',
      },
    });

    test('it should open Dialog', () => {
      const { getByRole } = render({ button: 'Modify Autoship' });
      const modifyAutoshipDialog = getByRole('button', { className: 'btnModifyAutoship' });
      fireEvent.click(modifyAutoshipDialog);
      expect(modifyAutoshipDialog).toBeTruthy();
    });
  });

  global.window = { location: { pathname: '/app/su?logonId=admin&switchUserId=12345' } };

  describe('<SFWLoginbtn />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Login',
      },
    });

    test('it should open Dialog', () => {
      const { getByRole } = render({ button: 'Login' });
      const LoginLink = getByRole('button', { className: 'btnSfwLogin' });
      fireEvent.click(LoginLink);
      expect(LoginLink).toBeTruthy();
      expect('/app/su?logonId=admin&switchUserId=12345').toEqual(
        '/app/su?logonId=admin&switchUserId=12345',
      );
    });
  });
});
