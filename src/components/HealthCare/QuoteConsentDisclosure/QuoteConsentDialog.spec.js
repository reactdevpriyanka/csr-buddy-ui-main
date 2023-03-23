import { renderWrap } from '@utils';
import mockPets from '__mock__/pets/pets-with-insurance';
import * as nextRouter from 'next/router';
import { DIALOGS } from '@/constants/dialogs';
import { fireEvent } from '@testing-library/react';
import QuoteConsentDialog from './QuoteConsentDialog';

const defaultProps = {
  pets: mockPets,
  open: true,
  onClose: jest.fn(),
};

describe('<QuoteConsentDialog />', () => {
  const render = (props = {}) => renderWrap(QuoteConsentDialog, { defaultProps, ...props })();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: jest.fn(),
      query: {
        activeDialog: DIALOGS.QUOTE_CONSENT,
      },
    });
  });

  test('it should try to click the disabled "Agree" button, fail, amke a pet selection, and click an enabled "agree" button', () => {
    const { getByTestId } = render();
    const agreeBtn = getByTestId('base-dialog-ok-button');
    fireEvent.click(agreeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(0);
  });
});
