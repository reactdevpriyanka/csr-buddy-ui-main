/* eslint-disable jest/no-disabled-tests */
import { renderWrap } from '@/utils';
import { useRouter } from 'next/router';
import ResendLabelsDialog from './ResendLabelsDialog';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const customerid = null;

useRouter.mockReturnValue({
  query: {
    id: customerid,
  },
});

describe('Resend label dialog box', () => {
  const defaultProps = {
    isOpen: true,
    handleClose: () => {},
    returnId: '',
    orderId: '',
  };
  const render = renderWrap(ResendLabelsDialog, { defaultProps });

  test('it should render resend label dialog box', () => {
    const { queryByText } = render();
    expect(queryByText('Confirm Resend Labels')).toBeInTheDocument();
    expect(queryByText('Are you sure you want to resend label(s)?')).toBeInTheDocument();
    expect(queryByText('Yes')).toBeInTheDocument();
    expect(queryByText('No')).toBeInTheDocument();
  });

  describe('Hide Resend label dialog box', () => {
    const defaultProps = {
      isOpen: false,
      handleClose: () => {},
      returnId: '',
      orderId: '',
    };
    const render = renderWrap(ResendLabelsDialog, { defaultProps });

    test('it should not render resend label dialog box', () => {
      const { queryByText } = render();
      expect(queryByText('Confirm Resend Labels')).not.toBeInTheDocument();
      expect(queryByText('Are you sure you want to resend label(s)?')).not.toBeInTheDocument();
      expect(queryByText('Yes')).not.toBeInTheDocument();
      expect(queryByText('No')).not.toBeInTheDocument();
    });
  });
});
