import { renderWrap } from '@utils';
import useFeature from './useFeature';
import FeatureFlag from './FeatureFlag';

jest.mock('./useFeature');

describe('<FeatureFlag />', () => {
  const render = renderWrap(FeatureFlag);

  it('should render children if flag enabled', () => {
    useFeature.mockReturnValue(true);

    const { getByText } = render({
      flag: 'spicyNewProductFeature',
      children: <div>{'I am a super cool feature'}</div>,
    });

    expect(getByText('I am a super cool feature')).toBeInTheDocument();
  });

  it('should not render children if flag disabled', () => {
    useFeature.mockReturnValue(false);

    const { queryByText } = render({
      flag: 'spicyNewProductFeature',
      children: <div>{'I am a super cool new feature'}</div>,
    });

    expect(queryByText('I am a super cool new feature')).not.toBeInTheDocument();
  });

  describe('with fallback', () => {
    it('should render fallback if provided flag is false', () => {
      useFeature.mockReturnValue(false);

      const { queryByText } = render({
        flag: 'spicyNewProductFeature',
        children: <div>{'I am a super cool new feature'}</div>,
        fallback: <div>{'This feature is disabled'}</div>,
      });

      expect(queryByText('This feature is disabled')).toBeInTheDocument();
    });
  });
});
