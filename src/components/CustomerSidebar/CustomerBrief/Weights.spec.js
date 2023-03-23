import { renderWrap } from '@utils';
import Weights from './Weights';

describe('<Weights />', () => {
  const onChange = jest.fn();

  const render = renderWrap(Weights, {
    defaultProps: {
      onChange,
    },
  });

  afterEach(() => onChange.mockReset());

  test('it should call onChange when clicked', () => {
    const { getByLabelText } = render();
    render.trigger.click(getByLabelText('20 lbs'));
    expect(onChange).toHaveBeenCalled();
  });
});
