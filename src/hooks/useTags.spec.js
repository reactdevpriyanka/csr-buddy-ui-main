import { useRouter } from 'next/router';
import { renderWrap } from '@utils';
import useCustomerTags from '@/hooks/tags/useCustomerTags';
import { updateTag } from '@/services/tags';
import customerTagsOutput from '__mock__/tags/customer+output';
import useTags from './useTags';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/tags/useCustomerTags');
jest.mock('@/services/tags');

describe('useTags', () => {
  useRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  useCustomerTags.mockReturnValue({
    data: [],
    mutate: jest.fn(),
    error: null,
  });

  let output = {};

  const TestComponent = () => {
    output = useTags();
    return <div />;
  };

  const render = renderWrap(TestComponent);

  beforeEach(() => {
    render();
  });

  afterEach(() => {
    output = {};
  });

  test('it should return empty tags if no tags applied', () => {
    expect(output).toHaveProperty('tags', []);
  });

  describe('when tags are applied', () => {
    beforeEach(() => {
      useCustomerTags.mockReturnValueOnce({
        data: customerTagsOutput,
        error: null,
        mutate: jest.fn(),
      });

      render();
    });

    test('it should return applied tags for customer', () => {
      expect(output).toHaveProperty('tags', customerTagsOutput);
    });
  });

  describe('when updating customer tag', () => {
    const mutate = jest.fn();

    const updatePromise = Promise.resolve();

    beforeEach(() => {
      useCustomerTags.mockReturnValue({
        data: [
          { displayName: 'HEARING_IMPAIRED', active: true },
          { displayName: 'IS_NIGHT_OWL', active: true },
        ],
        error: null,
        mutate,
      });

      updateTag.mockReturnValue(updatePromise);
    });

    afterEach(() => mutate.mockReset());

    test('it should call update tag with expected arguments', () => {
      expect(output).toHaveProperty('updateCustomerTags');

      output.updateCustomerTags({
        displayName: 'HEARING_IMPAIRED',
        active: false,
      });

      expect(updateTag).toHaveBeenCalledWith({
        customerId: '123123',
        tag: {
          displayName: 'HEARING_IMPAIRED',
          active: false,
        },
      });
    });

    test('it should mutate the cache with expected data', () => {
      output.updateCustomerTags({
        displayName: 'HEARING_IMPAIRED',
        active: false,
      });

      return updatePromise.then(() => {
        expect(mutate).toHaveBeenCalledWith([
          { displayName: 'HEARING_IMPAIRED', active: false },
          { displayName: 'IS_NIGHT_OWL', active: true },
        ]);
      });
    });
  });

  describe('when error is present', () => {
    beforeEach(() => {
      useCustomerTags.mockReturnValueOnce({
        data: null,
        error: 'There was a problem',
        mutate: jest.fn(),
      });

      render();
    });

    test('it should return error', () => {
      expect(output).toHaveProperty('error', 'There was a problem');
    });
  });
});
