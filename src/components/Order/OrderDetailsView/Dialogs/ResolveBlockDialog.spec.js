import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import ResolveBlockDialog from './ResolveBlockDialog';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '1075268420',
  },
});

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

const defaultProps = {
  open: true,
  openDialog: jest.fn(),
  id: '1075268420',
  reason: 'OTHER',
  comment: 'Test comment',
};

describe('<ResolveBlockDialog />', () => {
  const render = renderWrap(ResolveBlockDialog, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
