import { act } from '@testing-library/react';
import axios from 'axios';
import _keyBy from 'lodash/keyBy';
import systemTags from '__mock__/tags/system';
import systemTagsOutput from '__mock__/tags/system+output';
import { renderWrap } from '@utils';
import * as useAthena from '@/hooks/useAthena';
import useSystemTags from './useSystemTags';

describe('useSystemTags', () => {
  const requestSpy = jest.spyOn(axios, 'get');

  requestSpy.mockReturnValue(Promise.resolve({ data: systemTags }));

  const athenaSpy = jest.spyOn(useAthena, 'default');

  athenaSpy.mockReturnValue({
    lang: {
      'feature.explorer.whitelistedTags': Object.keys(_keyBy(systemTags, 'name')),
    },
  });

  let output = {};

  const TestComponent = () => {
    output = useSystemTags();
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
    expect(requestSpy).toHaveBeenCalledWith('/api/v1/tags');
  });

  test('it should return system tags', async () => {
    expect(output).toHaveProperty('data', systemTagsOutput);
  });
});
