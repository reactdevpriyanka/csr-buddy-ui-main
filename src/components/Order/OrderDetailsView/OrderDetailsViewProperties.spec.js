import { renderWrap } from '@/utils';
import OrderDetailsViewProperties from './OrderDetailsViewProperties';

const submitterVal = 'System';
const channelVal = 'AUTOSHIP';
const remoteIpVal = '121.123.122.111';
const commentVal = 'Some ZZZZ comment';
const submitterDetailVal = {
  id: '81',
  email: 'YD.C4qXlO8@Xttdh.ZSt',
  fullName: 'UgQVUC',
  status: 'ACTIVE',
};

const defaultProps = {
  submitter: submitterVal,
  channel: channelVal,
  remoteIp: remoteIpVal,
  comment: commentVal,
  submitterDetail: submitterDetailVal,
};

describe('<OrderDetailsViewProperties />', () => {
  const render = renderWrap(OrderDetailsViewProperties, { defaultProps });

  test('it should display the orderDetailsViewPropertiesContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewPropertiesContainer`)).toBeTruthy();
    expect(getByTestId(`orderSubmitter`)).toHaveTextContent(submitterDetailVal.fullName);
    expect(getByTestId(`orderChannel`)).toHaveTextContent(channelVal);
    expect(getByTestId(`orderRemoteIp`)).toHaveTextContent(remoteIpVal);
    expect(getByTestId(`orderComment`)).toHaveTextContent(commentVal);
  });
});
