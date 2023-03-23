import axios from 'axios';
import { act } from '@testing-library/react';
import { useRouter } from 'next/router';
import { renderWrap } from '@utils';
import * as swr from 'swr';
import useSystemTags from '@/hooks/tags/useSystemTags';
import systemTags from '__mock__/tags/system+output';
import customerTags from '__mock__/tags/customer';
import customerTagsOutput from '__mock__/tags/customer+output';
import useCustomerTags from './useCustomerTags';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('axios');
jest.mock('@/hooks/tags/useSystemTags');

describe('hooks/useCustomerTags', () => {
  useRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  useSystemTags.mockReturnValue({ data: systemTags });

  let output = {};

  const TestComponent = () => {
    output = useCustomerTags();
    return <div />;
  };

  const render = renderWrap(TestComponent);

  afterEach(() => {
    output = null;
  });

  it('should request the correct URL', async () => {
    const promise = Promise.resolve({ data: [] });
    axios.get.mockReturnValueOnce(promise);

    render();

    await act(async () => await promise);

    expect(axios.get).toHaveBeenCalledWith('/api/v1/customer/123123/tags?appliedTagsOnly=true');
  });

  describe('with customer having 0 tags', () => {
    const promise = Promise.resolve({ data: [] });

    beforeEach(async () => {
      axios.get.mockReturnValueOnce(promise);
      render();
      await act(async () => await promise);
    });

    test('it should return empty tags list', async () => {
      await expect(promise).resolves.toEqual({ data: [] });
      expect(output).toHaveProperty('data', []);
    });
  });

  describe('with customer having N tags', () => {
    const spy = jest.spyOn(swr, 'default');

    beforeEach(async () => {
      spy.mockReturnValue({ data: customerTags });
      render();
    });

    test('it should return correct number of tags', async () => {
      expect(output).toHaveProperty('data');
      expect(output.data).toHaveLength(customerTagsOutput.length);
    });

    test('it should return correct tags data', () => {
      expect(output).toHaveProperty('data', customerTagsOutput);
    });
  });
});
