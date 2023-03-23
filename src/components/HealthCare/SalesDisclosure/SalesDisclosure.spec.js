import React from 'react';
import { renderWrap } from '@utils';
import mockPets from '__mock__/pets/pets-with-insurance';
import { fireEvent } from '@testing-library/react';
import * as nextRouter from 'next/router';
import { DIALOGS } from '@/constants/dialogs';
import SalesDisclosure from '@/components/HealthCare/SalesDisclosure/SalesDisclosure';

const defaultProps = {
  pets: mockPets,
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

const setState = jest.fn();

describe('<SalesDisclosure />', () => {
  const render = (props = {}) => renderWrap(SalesDisclosure, { defaultProps, ...props })();

  beforeEach(() => {
    jest.spyOn(React, 'useState').mockImplementation((initState) => [initState, setState]);
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: jest.fn(),
      query: {
        activeDialog: DIALOGS.SALES_DISCLOSURE,
      },
    });
  });

  test('it should render the sales disclosure', () => {
    const { getByTestId } = render();

    expect(getByTestId('sales-disclosure:description')).toHaveTextContent(
      'Sales consent is required to purchase insurance plan',
    );
    const dialogBtn = getByTestId('sales-disclosure:open-script-btn');
    expect(dialogBtn).toBeTruthy();
    fireEvent.click(dialogBtn);
    expect(setState).toHaveBeenCalledWith(true);
  });
});
