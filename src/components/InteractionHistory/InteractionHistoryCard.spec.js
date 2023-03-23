import { renderWrap } from '@utils';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import InteractionHistoryCard from './InteractionHistoryCard';

const interaction = {
  incidentId: '64515899',
  createdAt: '2022-01-11T11:21:56-05:00',
  contactChannel: 'Phone Inbound',
  contactReason: 'Ripped/Torn',
  agentName: 'Edward Van Halen',
  disposition: 'Supply',
  specialNote:
    'Really long agent comment regarding last interaction with customer that the agent had about the call that took place',
  appeasements: [
    {
      appeasementId: '1070033355',
      type: 'RETURNS',
      description:
        'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 15-lb bag',
      actions: [
        {
          actionId: 'cc1c095b-1319-4c90-a04c-72f94944ae0c',
          actionType: 'CONCESSION',
          state: 'PAY_WAIT',
          type: 'PRODUCT_CONCESSION',
        },
        {
          actionId: 'a68f8406-4082-426b-823d-521f6bf8b24f',
          actionType: 'REPLACEMENT',
          state: 'PAY_WAIT',
          type: 'REPLACEMENT',
        },
      ],
      details: {
        productConcession: 22.63,
        cardType: 'MASTERCARD',
        totalRefunded: 0,
        shippingConcession: 0,
        accountNumber: '5112XXXXXXXX5114',
        primary: 'DAMAGED',
        secondary: 'PRODUCT_ONLY',
        tertiary: 'DENTED_PRODUCT',
      },
    },
  ],
};

describe('<InteractionHistoryCard />', () => {
  const render = renderWrap(InteractionHistoryCard, {
    defaultProps: {
      interaction: interaction,
      contactChannelIcon: <PhoneCallbackIcon />,
    },
  });

  test('it should render Interaction History Card', () => {
    const { getByTestId } = render();
    expect(getByTestId(`interaction-history-card`)).toBeTruthy();
    expect(getByTestId(`agent-name:history-card`)).toBeTruthy();
    expect(getByTestId(`order-id:history-card`)).toBeTruthy();
    expect(getByTestId(`interaction-date:history-card`)).toBeTruthy();

    for (const appeasement of interaction.appeasements) {
      for (const action of appeasement.actions) {
        expect(getByTestId(`action-${action.actionId}:history-card`)).toBeTruthy();
      }
    }
  });

  test('interaction appeasements display the type and state', () => {
    const { getByTestId } = render();
    expect(
      getByTestId('action-cc1c095b-1319-4c90-a04c-72f94944ae0c:history-card'),
    ).toHaveTextContent('Concession (Pending)');
    expect(
      getByTestId('action-a68f8406-4082-426b-823d-521f6bf8b24f:history-card'),
    ).toHaveTextContent('Replacement (Pending)');
  });
});
