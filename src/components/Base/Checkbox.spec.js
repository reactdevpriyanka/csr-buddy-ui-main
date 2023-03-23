import { renderWrap } from '@utils';
import Checkbox from './Checkbox';

describe('<Checkbox />', () => {
  const defaultProps = {
    label: 'Do you want to have a cheese danish?',
  };

  const render = renderWrap(Checkbox, {
    defaultProps,
  });

  test('it should always call onChoose when mounted and required', () => {
    const onChoose = jest.fn();

    render({ onChoose, required: true });

    expect(onChoose).toHaveBeenCalled();
  });
});
