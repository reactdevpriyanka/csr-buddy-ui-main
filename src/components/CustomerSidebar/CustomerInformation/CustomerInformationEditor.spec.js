import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import customer from '__mock__/customers/happy';
import usePanels from '@/hooks/usePanels';
import { fireEvent, waitFor, within } from '@testing-library/react';
import * as nextRouter from 'next/router';
import * as useAgentInteractions from '@/hooks/useAgentInteractions';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import CustomerInformationEditor from './CustomerInformationEditor';

jest.mock('@/hooks/usePanels');
jest.mock('@/hooks/useCustomer');

const mockEnqueueSnackbar = jest.fn().mockResolvedValue({});

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueueSnackbar,
    };
  },
}));

const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
jest
  .spyOn(useAgentInteractions, 'default')
  .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));

const mutateCustomerMock = jest.fn();
mutateCustomerMock.mockResolvedValue({});

describe('<CustomerInformationEditor />', () => {
  const render = renderWrap(CustomerInformationEditor);

  const navigateToPanel = jest.fn();

  usePanels.mockReturnValue({ navigateToPanel });

  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  afterEach(() => {
    navigateToPanel.mockReset();
    mockEnqueueSnackbar.mockReset();
    captureInteractionMock.mockReset();
    mutateCustomerMock.mockClear();
  });

  it('Renders <ErrorOverview /> if error useCustomer', () => {
    useCustomer.mockReturnValue({
      data: customer,
      error: 'yes',
      mutate: mutateCustomerMock,
    });
    const targetText = 'An error has occurred while loading data for this customer';
    const { queryByText } = render();

    expect(queryByText(targetText)).toBeTruthy();
    expect(queryByText('Try Again')).toBeTruthy();
  });

  it('Renders <Loader /> while data has not arrived (undefined)', () => {
    useCustomer.mockReturnValue({
      data: undefined,
      error: null,
      mutate: mutateCustomerMock,
    });
    const { getByTestId } = render();

    expect(getByTestId('loader')).toBeInTheDocument();
  });

  describe('when customer details are edited', () => {
    describe('and information is returned', () => {
      beforeEach(() => {
        useCustomer.mockReturnValue({
          data: customer,
          error: null,
          mutate: mutateCustomerMock,
        });
      });
      test('it should render all details', () => {
        const { getByTestId } = render();
        expect(getByTestId('edit-email').querySelector('input')).toHaveValue(customer.email);
        expect(getByTestId('edit-fullName').querySelector('input')).toHaveValue(
          customer.customerFullName,
        );
        expect(getByTestId('edit-status').querySelector('input')).toHaveValue(customer.status);
        expect(getByTestId('edit-location').querySelector('input')).toHaveValue('Cloverdale, IN');
      });
      test('it should render save and cancel buttons', () => {
        const { getByTestId } = render();
        expect(getByTestId('cancel-edit')).toBeTruthy();
        expect(getByTestId('save-edit')).toBeTruthy();
        expect(getByTestId('save-edit')).toBeDisabled();
      });

      it('should display warning text if status is changed', () => {
        const { getByText, getByTestId, queryByTestId } = render();
        const statusSelect = within(getByTestId('edit-status')).getByRole('button');
        fireEvent.click(statusSelect);
        fireEvent.mouseDown(statusSelect);
        expect(queryByTestId(`edit-status:ACTIVE`)).toBeTruthy();
        expect(queryByTestId(`edit-status:INACTIVE`)).toBeTruthy();
        fireEvent.click(getByTestId(`edit-status:INACTIVE`));
        const expectedNote =
          "Inactive does not erase or cancel the account; Inactive prevents the customer/ CSR from accessing the customer's Chewy account. Ask customer if they want to cancel active Autoship orders and cancel them for the customer.";
        expect(getByText(expectedNote)).toBeInTheDocument();
      });
    });
  });

  describe('when cancel button is clicked', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({
        data: customer,
        error: null,
        mutate: mutateCustomerMock,
      });
    });
    test('it should return to customer interaction screen', () => {
      const { getByTestId } = render();
      getByTestId('cancel-edit').click();
      expect(navigateToPanel).toHaveBeenCalled();
    });
  });

  describe('when saving an edit', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({
        data: customer,
        error: null,
        updateCustomer: (id, data, ons) => {
          ons();
          return new Promise((resolve, reject) => {
            return resolve({ data: {} });
          });
        },
        mutate: mutateCustomerMock,
      });
    });

    test('invalid email doesnt enable save', () => {
      const { getByText, getByTestId } = render();
      const emailField = getByTestId('edit-email');
      fireEvent.change(emailField.querySelector('input'), { target: { value: '23@23' } });
      expect(getByTestId('edit-email').querySelector('input')).toHaveValue('23@23');
      expect(getByText('Invalid email')).toBeTruthy();
      expect(getByTestId('save-edit')).toBeDisabled();
    });
    test('valid email enables save', () => {
      const { queryByText, getByTestId } = render();
      const emailField = getByTestId('edit-email');
      fireEvent.change(emailField.querySelector('input'), { target: { value: '23@23' } });
      expect(getByTestId('edit-email').querySelector('input')).toHaveValue('23@23');
      fireEvent.change(emailField.querySelector('input'), { target: { value: '23@23.com' } });
      expect(getByTestId('edit-email').querySelector('input')).toHaveValue('23@23.com');
      expect(queryByText('Invalid email')).toBeNull();
      expect(getByTestId('save-edit')).toBeEnabled();
    });
    test('invalid fullName doesnt enable save', () => {
      const { getByText, getByTestId } = render();
      const nameField = getByTestId('edit-fullName');
      fireEvent.change(nameField.querySelector('input'), { target: { value: '' } });
      expect(getByTestId('edit-fullName').querySelector('input')).toHaveValue('');
      expect(getByText('Invalid name')).toBeTruthy();
      expect(getByTestId('save-edit')).toBeDisabled();
    });
    test('valid fullName enables save', () => {
      const { queryByText, getByTestId } = render();
      const nameField = getByTestId('edit-fullName');
      fireEvent.change(nameField.querySelector('input'), { target: { value: '' } });
      expect(getByTestId('edit-fullName').querySelector('input')).toHaveValue('');
      fireEvent.change(nameField.querySelector('input'), { target: { value: 'name' } });
      expect(getByTestId('edit-fullName').querySelector('input')).toHaveValue('name');
      expect(queryByText('Invalid name')).toBeNull();
      expect(getByTestId('save-edit')).toBeEnabled();
    });

    test('save valid values and snackbar', async () => {
      const { findByText, getByTestId } = render();
      const nameField = getByTestId('edit-fullName');
      fireEvent.change(nameField.querySelector('input'), { target: { value: 'name' } });
      const emailField = getByTestId('edit-email');
      fireEvent.change(emailField.querySelector('input'), { target: { value: 'a@b.c' } });
      getByTestId('save-edit').click();

      await waitFor(() => {
        expect(findByText('Edit Customer Details')).toBeTruthy();
        expect(findByText('Failed to Update Customer Details')).toBeTruthy();
        expect(mockEnqueueSnackbar).toHaveBeenCalled();
      });
      expect(mockEnqueueSnackbar.mock.calls[0][0]).toMatchObject({
        messageHeader: 'Success',
        variant: SNACKVARIANTS.SUCCESS,
        messageSubheader: `Successfully updated Customer Details`,
      });
    });

    test('on save customer Interaction and mutate Customer are invoked', async () => {
      const { getByTestId } = render();
      const nameField = getByTestId('edit-fullName');
      fireEvent.change(nameField.querySelector('input'), { target: { value: 'name' } });
      const emailField = getByTestId('edit-email');
      fireEvent.change(emailField.querySelector('input'), { target: { value: 'a@b.c' } });
      getByTestId('save-edit').click();

      await waitFor(() => {
        expect(mutateCustomerMock).toHaveBeenCalled();
        expect(captureInteractionMock).toHaveBeenCalled();
      });

      expect(mutateCustomerMock).toHaveBeenCalledWith();
      expect(captureInteractionMock.mock.calls[0][0]).toMatchObject({
        type: 'CUSTOMER_PROFILE_UPDATED',
        subjectId: customer.id,
        action: 'UPDATE',
      });
    });

    test('failed updateCustomer invokes error toast', async () => {
      useCustomer.mockReturnValue({
        data: customer,
        error: null,
        updateCustomer: (id, data) =>
          new Promise((resolve, reject) => {
            return reject({});
          }),
        mutate: mutateCustomerMock,
      });
      const { getByTestId } = render();
      const nameField = getByTestId('edit-fullName');
      fireEvent.change(nameField.querySelector('input'), { target: { value: 'name' } });
      const emailField = getByTestId('edit-email');
      fireEvent.change(emailField.querySelector('input'), { target: { value: 'a@b.c' } });
      getByTestId('save-edit').click();

      await waitFor(() => expect(mockEnqueueSnackbar).toHaveBeenCalled());

      expect(mockEnqueueSnackbar.mock.calls[0][0]).toMatchObject({
        messageHeader: 'Error',
        variant: SNACKVARIANTS.ERROR,
        messageSubheader: `Failed to update Customer Details`,
      });
    });

    test('valid phone number enables save', () => {
      const { queryByText, getByTestId } = render();
      const phoneField = getByTestId('edit-phone');
      fireEvent.change(phoneField.querySelector('input'), { target: { value: 2222222222 } });
      expect(getByTestId('edit-phone').querySelector('input')).toHaveValue(2222222222);
      fireEvent.change(phoneField.querySelector('input'), { target: { value: 2222222222 } });
      expect(getByTestId('edit-phone').querySelector('input')).toHaveValue(2222222222);
      expect(queryByText('Invalid phone')).toBeNull();
      expect(getByTestId('save-edit')).toBeEnabled();
    });
  });
});
