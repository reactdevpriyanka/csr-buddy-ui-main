import { fireEvent } from '@testing-library/react';
import { renderWrap } from '@utils';
import mockPets from '__mock__/pets/pets-with-insurance';
import React from 'react';
import * as nextRouter from 'next/router';
import { DIALOGS } from '@/constants/dialogs';
import ReactDOM from 'react-dom';
import QuoteConsentDisclosure from './QuoteConsentDisclosure';

const defaultProps = {
  pets: mockPets,
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

const setState = jest.fn();

describe('<QuoteConsentDisclosure />', () => {
  const render = (props = {}) => renderWrap(QuoteConsentDisclosure, { defaultProps, ...props })();

  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
  });

  beforeEach(() => {
    jest.spyOn(React, 'useState').mockImplementation((initState) => [initState, setState]);
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: jest.fn(),
      query: {
        activeDialog: DIALOGS.QUOTE_CONSENT,
      },
    });
  });

  test('it should render the quote consent disclosure', () => {
    const { getByTestId } = render();
    expect(getByTestId('quote-disclosure:description')).toHaveTextContent(
      'Quote consent is required to see insurance plan pricing',
    );
    expect(getByTestId('quote-disclosure:open-script-btn')).toBeTruthy();
    expect(getByTestId('quote-disclosure:shop-for-plans')).toBeTruthy();
    fireEvent.click(getByTestId('quote-disclosure:open-script-btn'));
    expect(setState).toHaveBeenCalledWith(true);
  });
});
