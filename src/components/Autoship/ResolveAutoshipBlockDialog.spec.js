import { renderWrap } from '@utils';
import Button from '@components/Button';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/react';
import ResolveAutoshipBlockDialog from './ResolveAutoshipBlockDialog';

const mockresolveAutoshipOrder = jest.fn();

jest.mock('@/hooks/useOrder');

jest.mock('@/hooks/useOrder', () => {
  return () => {
    return {
      resolveAutoshipOrder: mockresolveAutoshipOrder,
    };
  };
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

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

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

describe('<ResolveAutoshipBlockDialog />', () => {
  const render = renderWrap(ResolveAutoshipBlockDialog, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });

  describe('<Button />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Yes',
      },
    });

    test('should update autoship block', async () => {
      const { getByRole } = render({ button: 'Yes' });
      const resolveLink = getByRole('button', { className: 'Yes' });
      expect(resolveLink).toBeInTheDocument();
      fireEvent.click(resolveLink);
    });
  });
});
