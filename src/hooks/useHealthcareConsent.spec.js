import axios from 'axios';
import { renderWrap } from '@utils';
import { act } from '@testing-library/react';
import * as nextRouter from 'next/router';
import useHealthcareConsent from './useHealthcareConsent';

describe('useHealthcareConsent', () => {
  const petId = '123456789';
  const customerId = '123123';
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: customerId,
    },
  });

  const requestSpy = jest.spyOn(axios, 'post');

  requestSpy.mockReturnValue(Promise.resolve({ data: true }));

  const TestComponent = () => {
    const { captureSalesDisclosure, captureQuoteConsent } = useHealthcareConsent();
    captureSalesDisclosure({ disclosure: true, petId: petId });
    captureQuoteConsent({ consent: true });
    return <div />;
  };

  const render = renderWrap(TestComponent);

  beforeEach(async () => {
    await act(async () => {
      render();
    });
  });

  afterEach(() => {
    requestSpy.mockReset();
  });

  test('it should POST to the sales-disclosure endpoint', () => {
    expect(requestSpy).toHaveBeenCalledWith(
      `/api/v1/customer/${customerId}/insurance/sales-disclosure`,
      { disclosure: true, petId: '123456789' },
      { headers: { 'Interaction-ID': 'UNKNOWN' } },
    );
  });

  test('it should POST to the quote consent endpoint', () => {
    expect(requestSpy).toHaveBeenCalledWith(
      `/api/v1/customer/${customerId}/insurance/quote-consent`,
      { consent: true },
      { headers: { 'Interaction-ID': 'UNKNOWN' } },
    );
  });
});
