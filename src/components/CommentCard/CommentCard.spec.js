import { renderWrap } from '@utils';
import CommentCard from './CommentCard';
describe('<CommentCard />', () => {
  const render = renderWrap(CommentCard, {
    defaultProps: {
      commentType: 'User',
      comment: 'This user rocks.',
      contactChannel: 'call',
      agentName: 'homer simpson',
    },
  });

  test('it should display users initials', () => {
    const { getByText } = render();
    expect(getByText('HS')).toBeInTheDocument();
  });

  test('it should display "User Comment"', () => {
    const { getByText } = render();
    expect(getByText('User Comment')).toBeInTheDocument();
  });
});
