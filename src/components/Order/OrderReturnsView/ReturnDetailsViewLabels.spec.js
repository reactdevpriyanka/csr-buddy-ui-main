/* eslint-disable jest/no-disabled-tests */
import { renderWrap } from '@/utils';
import { useRouter } from 'next/router';
import * as features from '@/features';
import returnData from '__mock__/order-api/returnsData';
import ReturnDetailsViewLabels from './ReturnDetailsViewLabels';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const label = returnData.labels[0];

const customerid = null;

useRouter.mockReturnValue({
  query: {
    id: customerid,
  },
});

const defaultProps = {
  returnData: returnData,
  isActionAllowed: () => true,
};

describe('Resend Return Label', () => {
  const render = renderWrap(ReturnDetailsViewLabels, { defaultProps });

  test('it should render a resend labels button when flag is true', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { queryByTestId } = render();
    expect(queryByTestId(`order-button-resend-label`)).toBeInTheDocument();
  });

  test('it should not render a resend labels button when flag is false', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByTestId } = render();
    expect(queryByTestId(`order-button-resend-label`)).not.toBeInTheDocument();
  });

  describe('should not render resend labels buton if there are no labels', () => {
    const defaultProps = {
      returnData: returnData,
      isActionAllowed: () => false,
    };

    const render = renderWrap(ReturnDetailsViewLabels, { defaultProps });

    test('it should render no labels found', () => {
      const { queryByTestId } = render();
      expect(queryByTestId(`order-button-resend-label`)).not.toBeInTheDocument();
    });
  });
});

describe.skip('<ReturnDetailsViewLabels />', () => {
  const render = renderWrap(ReturnDetailsViewLabels, { defaultProps });

  test('it should render the retun details view labels panel', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsViewLabels:container`)).toBeTruthy();
  });

  test('it should render the mark all as received button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsViewLabels:button:markAllAsReceived`)).toBeTruthy();
  });

  test('it should render a create new labels button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsViewLabels:button:createNewLabels`)).toBeTruthy();
  });

  describe('should render rows of labels', () => {
    const render = renderWrap(ReturnDetailsViewLabels, { defaultProps });

    test('it should render a labels data', () => {
      const { getByTestId } = render();
      expect(
        getByTestId(`returnDetailsViewLabels:${label?.trackingnumber}:tracking:link`),
      ).toBeTruthy();
      expect(
        getByTestId(`returnDetailsViewLabels:${label?.trackingnumber}:tracking:link:label`),
      ).toBeTruthy();
      expect(getByTestId(`returnDetailsViewLabels:${label?.trackingnumber}:created`)).toBeTruthy();
      expect(getByTestId(`returnDetailsViewLabels:${label?.trackingnumber}:pdf:url`)).toBeTruthy();
      expect(
        getByTestId(`returnDetailsViewLabels:${label?.trackingnumber}:pdf:url:label`),
      ).toBeTruthy();
      expect(
        getByTestId(`returnDetailsViewLabels:${label?.trackingnumber}:destination`),
      ).toBeTruthy();
      expect(getByTestId(`returnDetailsViewLabels:${label?.trackingnumber}:received`)).toBeTruthy();
    });
  });

  describe('should render no rows of labels', () => {
    const tmpData = returnData;
    tmpData.labels = [];

    const defaultProps = {
      returnData: tmpData,
    };

    const render = renderWrap(ReturnDetailsViewLabels, { defaultProps });

    test('it should render no labels found', () => {
      const { getByTestId } = render();
      expect(getByTestId(`returnDetailsViewLabels:noDataFoundPanel`)).toBeTruthy();
    });
  });
});
