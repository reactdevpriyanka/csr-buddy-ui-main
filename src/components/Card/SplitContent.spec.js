import { renderWrap } from '@utils';
import SplitContent from './SplitContent';

describe('<SplitContent />', () => {
  const render = renderWrap(SplitContent, {
    testId: 'card:split-content',
  });

  test('it should render content', () => {
    const { getByText } = render({
      content: 'this is content',
    });

    expect(getByText('this is content')).toHaveTextContent('this is content');
  });

  test('it should render actions', () => {
    const { getByText } = render({
      actions: <a href="/path/to/workflow">{'this is an action'}</a>,
    });

    expect(getByText('this is an action')).toHaveTextContent('this is an action');
  });
});
