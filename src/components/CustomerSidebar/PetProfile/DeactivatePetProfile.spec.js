import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import Button from '@components/Button';
import { fireEvent } from '@testing-library/react';

describe('<DeactivatePetProfile />', () => {
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  //for testing
  describe('<Button />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Save Pet',
      },
    });

    afterEach(() => onClick.mockReset());

    test('it should display button', () => {
      const button = (props) => render(props).getByRole('button');
      expect(button()).toBeTruthy();
    });

    test('it should call `Save Pet`', () => {
      const { getByRole } = render({ button: 'Save Pet' });
      const savepet = getByRole('button', { className: 'submitButton' });
      expect(savepet).toBeTruthy();
    });
  });

  describe('<CancelButton />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Cancel',
      },
    });

    test('it should find `Cancel button`', () => {
      const { getByRole } = render({ button: 'Cancel' });
      const cancelBtn = getByRole('button', { className: 'cancelButton' });
      expect(cancelBtn).toBeTruthy();
    });
  });

  describe('<PetDeactivateReason />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Reason for Deactivation',
      },
    });

    test('it should open a dropdown', () => {
      const { getByRole } = render({ button: 'Reason for Deactivation' });
      const petDeactivateReason = getByRole('button', { className: 'petDeactivateReason' });
      fireEvent.click(petDeactivateReason);
      expect(petDeactivateReason).toBeTruthy();
    });

    test('it should change dropdown value', () => {
      const { getByRole } = render({ button: 'Reason for Deactivation' });
      const petDeactivateReason = getByRole('button', { className: 'petDeactivateReason' });
      fireEvent.click(petDeactivateReason);
      fireEvent.mouseDown(petDeactivateReason);
      fireEvent.change(petDeactivateReason, { target: { value: 'Other' } });
      expect(petDeactivateReason).toHaveValue('Other');
    });
  });
});
