import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import Button from '@components/Button';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPetProfile from './AddPetProfile';

describe('<AddPetProfile />', () => {
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  const render = renderWrap(AddPetProfile, {
    testId: 'add-pet-profile',
  });

  test('it should render add pet profile title', () => {
    const { getByText } = render();
    expect(getByText('Add a Pet')).toBeTruthy();
  });

  test('it should render get information', () => {
    const { getByText } = render();
    expect(getByText('General Information')).toBeTruthy();
  });

  test('it should render medication', () => {
    const { getByText } = render();
    expect(getByText('Any Medication?')).toBeTruthy();
  });

  test('it should render medication allergies', () => {
    const { getByText } = render();
    expect(getByText('Any Medication Allergies?')).toBeTruthy();
  });

  test('it should render health', () => {
    const { getByText } = render();
    expect(getByText('Any Health Conditions?')).toBeTruthy();
  });

  test('it should render food allergies', () => {
    const { getByText } = render();
    expect(getByText('Any Food Allergies?')).toBeTruthy();
  });

  describe('Pet weight', () => {
    test('it should render pet weight', () => {
      const { getByText, getByPlaceholderText } = render();
      expect(getByText('Weight')).toBeInTheDocument();
      expect(getByPlaceholderText('0.00 lbs')).toBeInTheDocument();
    });

    test('it should validate its input', async () => {
      const { getByTestId, getByText } = render();
      const input = getByTestId('add-pet-weight').querySelector('input');

      await userEvent.type(input, '0.1');
      expect(getByText('Weight must be greater than or equal to 1.')).toBeInTheDocument();

      await userEvent.clear(input);
      expect(getByText('Weight is a required field.')).toBeInTheDocument();
    });

    test('it should allow the user to clear the value (CSRBT-1077)', async () => {
      const { getByTestId } = render();
      const input = getByTestId('add-pet-weight').querySelector('input');

      await userEvent.type(input, '1');
      expect(input).toHaveValue(1);

      await userEvent.clear(input);
      expect(input).toHaveValue(null);
    });
  });

  describe('<ReactivateButton />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Save Pet',
      },
    });

    afterEach(() => onClick.mockReset());

    test('it should display Reactivate button', () => {
      const button = (props) => render(props).getByRole('button');
      expect(button()).toBeTruthy();
    });

    test('it should call `Save Pet`', () => {
      const { getByRole } = render({ button: 'Reactivate Pet' });
      const reactivatepet = getByRole('button', { className: 'reactivateButton' });
      expect(reactivatepet).toBeTruthy();
    });
  });

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

  describe('<PetType />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Pet Type',
      },
    });

    test('it should open a dropdown', () => {
      const { getByRole } = render({ button: 'Pet Type' });
      const petType = getByRole('button', { className: 'petType' });
      fireEvent.click(petType);
      expect(petType).toBeTruthy();
    });

    test('it should change dropdown value', () => {
      const { getByRole } = render({ button: 'Pet Type' });
      const petType = getByRole('button', { className: 'petType' });
      fireEvent.click(petType);
      fireEvent.mouseDown(petType);
      fireEvent.change(petType, { target: { value: 'Cat' } });
      expect(petType).toHaveValue('Cat');
    });
  });

  describe('<Birthday />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Big Day',
      },
    });

    test('it should call `DatePicker`', () => {
      const { getByRole } = render({ button: 'Big Day' });
      const birthday = getByRole('button', { className: 'birthday' });
      expect(birthday).toBeTruthy();
    });

    test('it should change date on `DatePicker`', () => {
      const { getByRole } = render({ button: 'Big Day' });
      const birthday = getByRole('button', { className: 'birthday' });
      fireEvent.click(birthday);
      fireEvent.mouseDown(birthday);
      fireEvent.change(birthday, { target: { value: '10-12-2020' } });
      expect(birthday).toHaveValue('10-12-2020');
    });
  });
});
