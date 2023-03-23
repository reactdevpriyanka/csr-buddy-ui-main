import useReturnReasons from '@/hooks/useReturnReasons';
import { fireEvent, within } from '@testing-library/react';
import { renderWrap } from '@utils';
import singleItemData from '__mock__/gwf/refund-replace-table/single-table-item';
import giftCardTableData from '__mock__/gwf/refund-replace-table/gift-cards';
import returnReasons from '__mock__/gwf/refund-replace-table/return-reasons';
import userEvent from '@testing-library/user-event';
import { parseReasons } from '@/utils/returnReasons';
import { waitFor } from '@testing-library/dom';
import ReplaceRefundTable from './ReplaceRefundTable';

jest.mock('@/hooks/useReturnReasons');

describe('<ReplaceRefundTable />', () => {
  useReturnReasons.mockReturnValue(parseReasons(returnReasons));

  const render = renderWrap(ReplaceRefundTable, {
    defaultProps: {
      ...singleItemData,
      onChoose: jest.fn(),
      onValidityChange: jest.fn(),
      saveToHistory: jest.fn(),
    },
  });

  beforeEach(() => {
    fireEvent.click(window);
  });

  test('it should render the ReplaceRefundTable and increment an item to be refunded/replaced, select other for primary reasons', async () => {
    const { getByTestId, getByText, getByRole, queryByText, queryAllByText } = render();
    expect(getByTestId('replace-refund-table:root')).toBeTruthy();
    expect(getByTestId('gwf:multi-item-quantity-plus:399537212')).toBeTruthy();
    expect(getByText('of 1')).toBeTruthy();
    expect(getByTestId('multi-item:valid-text')).toHaveTextContent('Select a quantity to continue');
    fireEvent.click(getByTestId('gwf:multi-item-quantity-plus:399537212'));
    expect(getByTestId('multi-item:valid-text')).toHaveTextContent(
      'Complete all return reasons to continue',
    );

    expect(queryByText('Additional Comments (optional)')).not.toBeInTheDocument();

    // example of selecting mui dropdown
    const returnReasonDropdown = within(getByTestId('return-reasons:primary:399537212')).getByRole(
      'button',
    );
    expect(returnReasonDropdown).toBeTruthy();
    fireEvent.mouseDown(returnReasonDropdown);
    const otherOption = within(getByRole('listbox')).getByTestId('return-reason:OTHER');
    userEvent.click(otherOption);
    await waitFor(() =>
      expect(queryAllByText('Additional Comments (optional)')[0]).toBeInTheDocument(),
    );
  });

  test('it should increment, select a primary, secondary, and tertiary return reasons', async () => {
    const { getByTestId, getByRole, queryByText, queryAllByText } = render();

    fireEvent.click(getByTestId('gwf:multi-item-quantity-plus:399537212'));

    // Select primary reason
    const primaryReason = getByTestId('return-reasons:primary:399537212');
    const returnReasonPrimaryDropdown = within(primaryReason).getByRole('button');
    expect(returnReasonPrimaryDropdown).toBeTruthy();
    fireEvent.mouseDown(returnReasonPrimaryDropdown);
    const fulfillmentOption = within(getByRole('listbox')).getByTestId('return-reason:FULFILLMENT');
    userEvent.click(fulfillmentOption);
    expect(queryByText('Additional Comments (optional)')).not.toBeInTheDocument();

    // Select secondary reason
    const secondaryReason = getByTestId('return-reasons:secondary:399537212');
    const returnReasonSecondaryDropdown = within(secondaryReason).getByRole('button');
    expect(returnReasonSecondaryDropdown).toBeTruthy();
    fireEvent.mouseDown(returnReasonSecondaryDropdown);
    const otherOption = within(getByRole('listbox')).getByTestId(
      'return-reason:SHIPPED_WRONG_ITEM',
    );
    userEvent.click(otherOption);
    expect(queryByText('Additional Comments (optional)')).not.toBeInTheDocument();

    // Select tertiary reason
    const tertiaryReason = getByTestId('return-reasons:tertiary:399537212');
    const returnReasonTertiaryDropdown = within(tertiaryReason).getByRole('button');
    expect(returnReasonTertiaryDropdown).toBeTruthy();
    fireEvent.mouseDown(returnReasonTertiaryDropdown);
    const wrongColorOption = within(getByRole('listbox')).getByTestId(
      'return-reason:FULFILLMENT_WRONG_COLOR',
    );
    userEvent.click(wrongColorOption);

    await waitFor(() =>
      expect(queryAllByText('Additional Comments (optional)')[0]).toBeInTheDocument(),
    );
  });

  test('it should select all and select a retrun reason from select all row and check send back checkbox', async () => {
    const { getByTestId, getByRole } = render();
    expect(getByTestId('select-all-button')).toBeTruthy();
    userEvent.click(getByTestId('select-all-button'));

    // Select primary reason
    const primaryReason = getByTestId('return-reasons:primary:select-all');
    const returnReasonPrimaryDropdown = within(primaryReason).getByRole('button');
    expect(returnReasonPrimaryDropdown).toBeTruthy();
    fireEvent.mouseDown(returnReasonPrimaryDropdown);
    const otherOption = within(getByRole('listbox')).getByTestId('return-reason:OTHER');
    userEvent.click(otherOption);

    const sendBackSelectAllCheckbox = getByTestId('send-back:select-all').querySelector(
      'input[type="checkbox"]',
    );
    const shelterDonationSelectAllCheckbox = getByTestId(
      'donate-to-shelter:select-all',
    ).querySelector('input[type="checkbox"]');

    expect(sendBackSelectAllCheckbox).toHaveProperty('checked', false);
    expect(shelterDonationSelectAllCheckbox).toHaveProperty('checked', false);

    userEvent.click(sendBackSelectAllCheckbox);

    expect(sendBackSelectAllCheckbox).toHaveProperty('checked', true);
    expect(shelterDonationSelectAllCheckbox).toHaveProperty('checked', false);
    expect(shelterDonationSelectAllCheckbox).toHaveAttribute('disabled');

    userEvent.click(sendBackSelectAllCheckbox); // uncheck Send Back checkbox
    userEvent.click(shelterDonationSelectAllCheckbox);

    expect(sendBackSelectAllCheckbox).toHaveProperty('checked', false);
    expect(sendBackSelectAllCheckbox).toHaveAttribute('disabled');
    expect(shelterDonationSelectAllCheckbox).toHaveProperty('checked', true);

    await waitFor(() =>
      expect(getByTestId('return-reason:additional-commentsselect-all')).toBeInTheDocument(),
    );
  });

  test('select all + send back', () => {
    const { getByTestId, getByRole } = render({ ...giftCardTableData });
    fireEvent.click(getByTestId('gwf:multi-item-quantity-plus:390962107'));

    // Select primary reason
    const primaryReason = getByTestId('return-reasons:primary:390962107');
    const returnReasonPrimaryDropdown = within(primaryReason).getByRole('button');
    expect(returnReasonPrimaryDropdown).toBeTruthy();
    fireEvent.mouseDown(returnReasonPrimaryDropdown);
    const otherOption = within(getByRole('listbox')).getByTestId('return-reason:OTHER');
    userEvent.click(otherOption);

    const newEmailTextFieldContainer = getByTestId('new-recipient-email:1503398745');
    const newEmailTextField = within(newEmailTextFieldContainer).getByRole('textbox');
    expect(newEmailTextField).toBeTruthy();
    fireEvent.change(newEmailTextField, { target: { value: 'newemail@chewy.com' } });
    expect(newEmailTextField.value).toBe('newemail@chewy.com');
  });
});
