import useEnactment from '@/hooks/useEnactment';
import renderWrap from '@/utils/renderWrap';
import autoshipSubData from '__mock__/activities/autoship-viewdetails-subdata';
import { formatDate } from '@utils/dates';
import { fireEvent, within } from '@testing-library/dom';
import * as features from '@/features';
import AutoshipViewDetailsDialog from './AutoshipViewDetailsDialog';
const defaultProps = {
  autoshipTotals: undefined,
  cancelDate: undefined,
  frequency: 'Every 5 weeks',
  id: undefined,
  isOpen: true,
  isUpcoming: false,
  lastOrderStatus: 'CANCELED',
  lastShipmentDate: '2023-02-06T05:54:47.857Z',
  name: 'Autoship #5',
  nextFulfillmentDate: '2023-03-15T00:00:00Z',
  openDialog: jest.fn(),
  orderFees: undefined,
  paymentDetails: undefined,
  products: [
    {
      id: '32041',
      catalogEntryId: '32041',
      partNumber: '46861',
      thumbnail: '//image.chewy.com/is/image/catalog/46861_MAIN,1636150598',
      price: '60.98',
      title:
        'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 30-lb bag',
      quantity: 1,
    },
  ],
  startDate: '2022-06-15T18:54:07.671Z',
  status: 'ACTIVE',
  subscriptionData: autoshipSubData,
};

jest.mock('@/hooks/useEnactment');

// enable other features
jest.spyOn(features, 'useFeature').mockImplementation(() => true);

describe('<AutoshipViewDetailsDialog />', () => {
  const { openEnactmentPage } = useEnactment(); // call the mock to get access to the jest fn

  describe('Activity Header', () => {
    const render = renderWrap(AutoshipViewDetailsDialog, { defaultProps });
    it('Renders the Activity Header', () => {
      const { getByTestId } = render();
      expect(getByTestId('card:activity-header')).toBeTruthy();
    });
    it('contains the order total', () => {
      const { getByTestId } = render();
      const header = getByTestId('card:activity-header');
      expect(within(header).getByText(`$${autoshipSubData.total.value}`)).toBeInTheDocument();
    });
    it('writes the expected subtitle (makesubtitle)', () => {
      const { getByTestId } = render();
      const header = getByTestId('card:activity-header');
      expect(
        within(header).getByText(`Autoship "${defaultProps.name}" Details`),
      ).toBeInTheDocument();
      expect(within(header).getByText(`Frequency: ${defaultProps.frequency}`)).toBeInTheDocument();
      expect(
        within(header).getByText(
          `Next shipment on ${formatDate(defaultProps.nextFulfillmentDate, false)}`,
        ),
      ).toBeInTheDocument();
      expect(
        within(header).getByText(
          `Last shipment on ${formatDate(defaultProps.lastShipmentDate, false)}`,
        ),
      ).toBeInTheDocument();
      expect(
        within(header).getByText(`Autoship ID: ${defaultProps.subscriptionData.id}`),
      ).toBeInTheDocument();
    });
    it('uses the cancelled date if the order is cancelled', () => {
      const newProps = {
        ...defaultProps,
        cancelDate: '2023-02-01T05:54:47.857Z',
        isUpcoming: false,
        status: 'CANCELED',
      };
      const render = renderWrap(AutoshipViewDetailsDialog, { defaultProps: newProps });
      const { getByTestId } = render();
      const header = getByTestId('card:activity-header');

      expect(
        within(header).getByText(`Autoship "${defaultProps.name}" Details`),
      ).toBeInTheDocument();
      expect(
        within(header).getByText(`Cancelled on ${formatDate(newProps.cancelDate, false)}`),
      ).toBeInTheDocument();
      expect(
        within(header).getByText(
          `Last shipment on ${formatDate(defaultProps.lastShipmentDate, false)}`,
        ),
      ).toBeInTheDocument();
      expect(
        within(header).getByText(`Autoship ID: ${defaultProps.subscriptionData.id}`),
      ).toBeInTheDocument();
    });
  });

  it('renders null when not open', () => {
    const newProps = { ...defaultProps, isOpen: false };
    const render = renderWrap(AutoshipViewDetailsDialog, { defaultProps: newProps });
    const { container } = render();
    expect(container).toBeEmptyDOMElement();
  });

  describe('Table tests', () => {
    const render = renderWrap(AutoshipViewDetailsDialog, { defaultProps });
    it('Renders table headers', () => {
      const { getByText } = render();
      expect(getByText('Products')).toBeInTheDocument();
      expect(getByText('Unit Price')).toBeInTheDocument();
      expect(getByText('Line Discount')).toBeInTheDocument();
    });
    it('Renders The correct item row', () => {
      const { getByTestId, getByText } = render();

      const itemRow = getByTestId('autoship-view-table').children[1];
      expect(
        getByText(
          'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 30-lb bag',
        ),
      ).toBeInTheDocument();
      expect(within(itemRow).getAllByText('$60.98')).toHaveLength(2);
      expect(within(itemRow).getByText('ITEM #32041')).toBeInTheDocument();
      expect(within(itemRow).getByText('Qty: 1')).toBeInTheDocument();
    });
  });

  describe('Modify Payment button', () => {
    const render = renderWrap(AutoshipViewDetailsDialog, { defaultProps });
    it('exists and is not disabled', () => {
      const { getByTestId } = render();
      const button = getByTestId('modify-payment-button');
      expect(button).toBeTruthy();
      expect(button).toBeInTheDocument();
      expect(button).not.toHaveAttribute('disabled');
    });
    it('opens page /app/subs/change-payment/:id on invoke', async () => {
      const { getByTestId } = render();
      const button = getByTestId('modify-payment-button');

      fireEvent.mouseDown(button);
      fireEvent.click(button);
      expect(openEnactmentPage).toHaveBeenCalledWith(
        `/app/subs/change-payment/${defaultProps.subscriptionData.id}`,
      );
    });
  });
});
