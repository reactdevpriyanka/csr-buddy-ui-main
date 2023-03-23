import { renderWrap } from '@utils';
import Checkbox from './Checkbox';

describe('<Checkbox />', () => {
  const onChange = jest.fn();

  const render = renderWrap(Checkbox, {
    defaultProps: {
      name: 'IS_FINAL_FORM',
      displayName: "Is this the customer's final form?",
      onChange,
    },
  });

  describe('when changed', () => {
    test('it should call onChange', () => {
      const { getByLabelText } = render();
      render.trigger.click(getByLabelText("Is this the customer's final form?"));
      expect(onChange).toHaveBeenCalled();
    });
  });
});
