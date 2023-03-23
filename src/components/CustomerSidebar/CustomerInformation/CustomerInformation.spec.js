import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import customerNoPrimaryAddress from '__mock__/customers/nessa+noprimaryaddress';
import customerNoAddress from '__mock__/customers/nessa+noaddress';
import customerNoEmail from '__mock__/customers/nessa+noemail';
import useOrderDetails from '@/hooks/useOrderDetails';
import { useRouter } from 'next/router';
import customerData from '__mock__/customers/happy';
import * as features from '@/features';
import * as nextRouter from 'next/router';
import { waitFor } from '@testing-library/dom';
import CustomerInformation from './CustomerInformation';

jest.mock('@/hooks/useCustomer');
jest.mock('@/hooks/useOrderDetails');
jest.mock('@/hooks/useEnactment');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

describe('<CustomerInformation />', () => {
  const render = renderWrap(CustomerInformation);
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  test('it should render the customer information', () => {
    expect(render()).toMatchSnapshot();
  });

  describe('when customer has no primary address', () => {
    describe('and no addresses on file', () => {
      beforeEach(() => {
        useCustomer.mockReturnValue({
          data: customerNoAddress,
          error: null,
        });
      });

      test('it should render no location', () => {
        const { getByTestId } = render();
        expect(getByTestId('customer:location:label')).toHaveTextContent('Location:');
        expect(getByTestId('customer:location:value')).toHaveTextContent('');
      });
    });

    describe('but has at least one address', () => {
      beforeEach(() => {
        useCustomer.mockReturnValue({
          data: customerNoPrimaryAddress,
          error: null,
        });
      });

      test('it should render first address on file', () => {
        const { getByTestId } = render();
        expect(getByTestId('customer:location:value')).toHaveTextContent('Hollywood, FL');
        expect(getByTestId('customer:phoneNumber:value')).toHaveTextContent('(555)456-3320');
      });
    });
  });

  describe('when customer is loading', () => {
    beforeAll(() => {
      useCustomer.mockReturnValue({
        error: null,
        data: null,
      });
    });

    test('it should render a loader', () => {
      const { getByTestId } = render();
      expect(getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('when error has occurred', () => {
    beforeAll(() => {
      useCustomer.mockReturnValue({
        error: 'Some nasty bug',
        data: null,
      });
    });

    test('it should render nothing', () => {
      const { container } = render();
      expect(container.childNodes).toHaveLength(0);
    });
  });

  describe('with missing email', () => {
    beforeAll(() => {
      useCustomer.mockReturnValue({
        data: customerNoEmail,
        error: null,
      });
    });

    test('it should render empty email field', () => {
      const { getByTestId } = render();
      expect(getByTestId('customer:email:value')).toHaveTextContent('');
    });
  });

  describe('with valid email', () => {
    beforeAll(() => {
      useCustomer.mockReturnValue({
        data: customerNoPrimaryAddress,
        error: null,
      });
    });

    test('it should render email field', () => {
      const { getByTestId } = render();
      expect(getByTestId('customer:email:value')).toHaveTextContent('nbobbins@chewy.net');
    });
  });

  describe('Should show address book button', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({
        data: customerData,
        error: null,
      });
      useOrderDetails.mockReturnValue({
        error: null,
        data: {
          ordersFor12MonthRollingPeriod: 20,
        },
      });
      useRouter.mockReturnValue({
        query: {
          id: '123123',
        },
      });
    });

    test('it should show address book button', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => true);
      const { getByTestId } = render();
      expect(getByTestId('customer-addressbook-icon')).toBeInTheDocument();
    });

    test('it should not show address book icon if feature flag is off', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => false);
      const { queryByTestId } = render();
      expect(queryByTestId('customer-addressbook-icon')).not.toBeInTheDocument();
    });

    test('it should show address book when icon is clicked', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => true);
      const { getByTestId } = render();
      expect(getByTestId('customer-addressbook-icon')).toBeInTheDocument();
      render.trigger.click(getByTestId('customer-addressbook-icon'));
      expect(getByTestId('customer-addressbook-dialog')).toBeInTheDocument();
    });
  });

  it('edit pressed pushes customerInformationEditor to router', async () => {
    useCustomer.mockReturnValue({
      data: customerData,
      error: null,
    });

    const pushMock = jest.fn();

    useRouter.mockReturnValue({
      query: {
        id: '123123',
      },
      push: pushMock,
    });

    const { getByTestId } = render();

    render.trigger.click(getByTestId('edit-customer-info'));

    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    expect(pushMock.mock.calls[0][0]).toMatchObject({
      query: {
        id: '123123',
        interactionPanel: 'customerInformationEditor',
      },
    });
  });

  it('gift card links route to /customers/:customerId/giftcards-promotions', async () => {
    useCustomer.mockReturnValue({
      data: customerData,
      error: null,
    });

    const pushMock = jest.fn();

    useRouter.mockReturnValue({
      query: {
        id: '123123',
      },
      push: pushMock,
    });

    const { getByTestId } = render();

    render.trigger.click(getByTestId('gift-cards-and-promotions-link'));

    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    expect(pushMock).toHaveBeenCalledWith(`/customers/123123/giftcards-promotions`);
  });

  it('reset password click launches reset password modal', () => {
    useCustomer.mockReturnValue({
      data: customerData,
      error: null,
    });

    useRouter.mockReturnValue({
      query: {
        id: '123123',
      },
    });

    const { queryByTestId, getByTestId } = render();

    render.trigger.click(getByTestId('reset-password-link'));

    expect(queryByTestId('reset-password-modal')).toBeInTheDocument();
  });
});
