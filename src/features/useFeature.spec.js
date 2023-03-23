import { renderWrap } from '@utils';
import useSWR from 'swr';
import useFeature from './useFeature';

jest.mock('swr');
jest.unmock('./useFeature');

describe('useFeature', () => {
  let enabled = null;

  const ComponentWithFeatureFlag = () => {
    enabled = useFeature('spicyNewProductFeature');
    return null;
  };

  const render = renderWrap(ComponentWithFeatureFlag);

  const resolveFeaturesSuccess = (data) => {
    useSWR.mockReturnValue({ data, error: null });
  };

  const resolveFeaturesError = (error) => {
    useSWR.mockReturnValue({ data: null, error });
  };

  beforeEach(() => {
    enabled = null;
  });

  it('should determine if feature is enabled', () => {
    resolveFeaturesSuccess({ spicyNewProductFeature: true });
    render();
    expect(enabled).toBe(true);
  });

  it('should determine if feature is disabled', () => {
    resolveFeaturesSuccess({ spicyNewProductFeature: false });
    render();
    expect(enabled).toBe(false);
  });

  it('should fail closed if feature flag is not present', () => {
    resolveFeaturesSuccess({});
    render();
    expect(enabled).toBe(false);
  });

  it('should fail closed if feature flags not found', () => {
    resolveFeaturesSuccess();
    render();
    expect(enabled).toBe(false);
  });

  it('should fail closed if request results in error', () => {
    resolveFeaturesError(new Error('failed'));
    render();
    expect(enabled).toBe(false);
  });
});
