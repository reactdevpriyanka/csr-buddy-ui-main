import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsviewObj';
import { useRouter } from 'next/router';
import useFeature from '@/features/useFeature';
import OrderDetailsView from './OrderDetailsView';

jest.mock('@/features/useFeature');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('<OrderDetailsView />', () => {
  beforeEach(() => {
    useFeature.mockReturnValue(false);
  });

  const defaultProps = {
    ...orderDetailsViewData,
    isActionAllowed: () => true,
  };

  const router = {
    pathname: '/app/customers/[id]/activity',
    query: {
      id: '255259460',
    },
  };

  useRouter.mockReturnValue(router);

  const render = renderWrap(OrderDetailsView, { defaultProps });

  test('it should render order details info', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewContainer`)).toBeTruthy();
  });

  test('it should render activity feed link', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId(`ordercard:id:viewdetails:link`)).toBeTruthy();
    expect(getByText('ACTIVITY FEED')).toBeInTheDocument();
    expect(getByText('/ ORDER #1782110437')).toBeInTheDocument();
  });

  test('it should render order details header info', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewHeaderContainer`)).toBeTruthy();
  });

  test('it should render order details replacement header info', () => {
    useFeature.mockReturnValue(true);
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewHeaderReplacementCard`)).toBeTruthy();
  });

  test('it should render order details payment info', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewPaymentContainer`)).toBeTruthy();
  });

  test('it should render order returns info', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewReturnsContainer`)).toBeTruthy();
  });

  test('it should render block Banner info', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewBlocksContainer`)).toBeTruthy();
  });

  test('it should render block info', () => {
    useFeature.mockReturnValue(true);
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewBlockDetailsContainer`)).toBeTruthy();
  });

  test('it should render properties info', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewPropertiesContainer`)).toBeTruthy();
  });
});
