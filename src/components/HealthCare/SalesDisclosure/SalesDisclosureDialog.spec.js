import { renderWrap } from '@utils';
import mockPets from '__mock__/pets/pets-with-insurance';
import * as nextRouter from 'next/router';
import { DIALOGS } from '@/constants/dialogs';
import { fireEvent } from '@testing-library/react';
import SalesDisclosureDialog from './SalesDisclosureDialog';

const defaultProps = {
  pets: mockPets,
  open: true,
  onClose: jest.fn(),
};

describe('<SalesDisclosureDialog />', () => {
  const render = (props = {}) => renderWrap(SalesDisclosureDialog, { defaultProps, ...props })();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: jest.fn(),
      query: {
        activeDialog: DIALOGS.SALES_DISCLOSURE,
      },
    });
  });

  test('it should render the sales disclosure dialog, select a different tab, render a different script', () => {
    const { getByTestId } = render();
    expect(getByTestId('tab-lemonade')).toBeTruthy();
    expect(getByTestId('tab-trupanion')).toBeTruthy();
    expect(getByTestId('tab-lemonade')).toHaveClass('Mui-selected');
    expect(getByTestId('tab-trupanion')).not.toHaveClass('Mui-selected');
    expect(getByTestId('pet-consent-script:lemonade')).toBeTruthy();
    fireEvent.click(getByTestId('tab-trupanion'));
    expect(getByTestId('tab-trupanion')).toHaveClass('Mui-selected');
    expect(getByTestId('tab-lemonade')).not.toHaveClass('Mui-selected');
    expect(getByTestId('pet-consent-script:trupanion')).toBeTruthy();
  });

  test('it should try to click the disabled "Agree" button, fail, amke a pet selection, and click an enabled "agree" button', () => {
    const { getByTestId } = render();
    const agreeBtn = getByTestId('base-dialog-ok-button');
    fireEvent.click(agreeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(0);
    fireEvent.click(getByTestId(`pet-consent-selection:${defaultProps.pets[0].id}`));
    expect(agreeBtn).not.toHaveClass('Mui-disabled');
  });
});
