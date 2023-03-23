import { renderWrap } from '@utils';
import mockPets from '__mock__/pets/pets-with-insurance';
import * as nextRouter from 'next/router';
import { fireEvent } from '@testing-library/react';
import TrupanionPortalDialog from './TrupanionPortalDialog';

const defaultProps = {
  pets: mockPets,
  open: true,
  onClose: jest.fn(),
};

describe('<TrupanionPortalDialog />', () => {
  const render = (props = {}) => renderWrap(TrupanionPortalDialog, { defaultProps, ...props })();

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: jest.fn(),
    });
  });

  describe('it should render expanded accordion', () => {
    test('it should render accordion title', () => {
      const { getByText, getByTestId } = render();
      expect(getByTestId('insuredpets:accordion:summary')).toBeTruthy();
      expect(getByText('Insured Pets (0)')).toBeInTheDocument();
    });

    test('it should render accordion details', () => {
      const { getByTestId } = render();
      const comp = getByTestId('insuredpets:accordion:details');
      expect(comp).toBeTruthy();
    });
  });
  test('it should try to click the "Leave Trupanion Portal" button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`base-dialog-ok-button`)).toBeTruthy();
    const agreeBtn = getByTestId('base-dialog-ok-button');
    fireEvent.click(agreeBtn);
  });
});
