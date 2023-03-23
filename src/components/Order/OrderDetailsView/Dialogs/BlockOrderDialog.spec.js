import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import BlockOrderDialog from './BlockOrderDialog';

jest.mock('date-fns', () => ({ format: jest.fn() }));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

useRouter.mockReturnValue({
  query: {
    id: '1075268420',
  },
});

const defaultProps = {
  open: true,
  openDialog: jest.fn(),
  id: '1075268420',
  reason: 'OTHER',
  comment: 'Test comment',
};

describe('<BlockOrderDialog />', () => {
  const render = renderWrap(BlockOrderDialog, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
