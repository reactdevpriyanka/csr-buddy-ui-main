import { renderWrap } from '@utils';
import LabelValueField from './LabelValueField';

describe('<LabelValueField />', () => {
  const render = renderWrap(LabelValueField, {
    testId: 'lvf',
    defaultProps: {
      id: 'lvf',
      name: 'lvf',
      'data-testid': 'lvf',
      label: 'lvf-label',
      value: 'lvf-value',
      valueFormatter: function (value) {
        return value.toUpperCase();
      },
    },
  });

  test('it should render a label and value', () => {
    const { getByTestId } = render();
    expect(getByTestId('lvf:label')).toBeTruthy();
    expect(getByTestId('lvf:label')).toHaveTextContent('lvf-label');
    expect(getByTestId('lvf:value')).toBeTruthy();
    expect(getByTestId('lvf:value')).toHaveTextContent('LVF-VALUE');
  });
});
