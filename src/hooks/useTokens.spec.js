import { act } from '@testing-library/react';
import axios from 'axios';
import tokens from '__mock__/tokens/tokens';
import { renderWrap } from '@utils';
import { useTokens } from './useTokens';

describe('useTokens', () => {
  const requestSpy = jest.spyOn(axios, 'put');

  requestSpy.mockReturnValue(Promise.resolve({ data: tokens }));

  let output = {};

  const TestComponent = () => {
    output = useTokens();
    return <div />;
  };

  const render = renderWrap(TestComponent);

  beforeEach(async () => {
    await act(async () => {
      render();
    });
  });

  afterEach(() => {
    output = {};
    requestSpy.mockReset();
  });

  test('it should request the correct URL', () => {
    expect(requestSpy).toHaveBeenCalledWith('/gateway/configuration/tokens');
  });

  test('it should return tokens', async () => {
    expect(output).toHaveProperty('data', tokens);
  });
});
