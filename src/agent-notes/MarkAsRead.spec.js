import { renderWrap } from '@utils';
import { fireEvent, waitFor } from '@testing-library/dom';
import { getDayDateYearTimeTimezone } from '@utils/dates';
import useAgentAlert from '@/hooks/useAgentAlert';
import MarkAsRead from './MarkAsRead';

const alertData = {
  id: 'c9768b50-d935-47f3-a64d-bb54a46e5fcb',
  recordTimestamp: '1677269459324',
  type: 'NEXT_AGENT_NOTE',
  customerId: '255280668',
  createdDate: '2023-02-24T20:10:59.329359Z',
  details: {
    issueType: 'Other',
    nextAgentNote: 'Sample Alert 12345',
    acknowledged: 'false',
    agentId: 'admin',
  },
};

const onMarkAsRead = jest.fn();

const defaultProps = {
  alertData,
  onMarkAsRead,
};

const createAgentAlertMock = jest.fn().mockResolvedValue({});

jest.mock('@/hooks/useAgentAlert');
useAgentAlert.mockReturnValue({
  createAgentAlert: createAgentAlertMock,
});
const AGENT_NAME_CHARACTER_LIMIT = 14;

describe('<MarkAsRead />', () => {
  const render = renderWrap(MarkAsRead, { defaultProps });
  it('Renders the alert date and content', () => {
    const { getByTestId } = render();

    const agentIdOrName = alertData.details.agentName ?? '';
    const expectedHeader = `${getDayDateYearTimeTimezone(alertData.createdDate)} |${agentIdOrName}`;
    expect(getByTestId('agent-alert:date')).toHaveTextContent(expectedHeader);
    expect(getByTestId('agent-alert:note')).toHaveTextContent(alertData.details.nextAgentNote);
  });

  it('Renders alert author when present', () => {
    const newAlertData = {
      id: 'c9768b50-d935-47f3-a64d-bb54a46e5fcb',
      recordTimestamp: '1677269459324',
      type: 'NEXT_AGENT_NOTE',
      customerId: '255280668',
      createdDate: '2023-02-24T20:10:59.329359Z',
      details: {
        issueType: 'Other',
        nextAgentNote: 'Sample Alert 12345',
        acknowledged: 'false',
        agentId: 'admin',
        agentName: 'johnc',
      },
    };
    const newProps = { ...defaultProps, alertData: newAlertData };

    const agentIdOrName = newAlertData.details.agentName ?? '';
    const expectedHeader = `${getDayDateYearTimeTimezone(
      newAlertData.createdDate,
    )} | ${agentIdOrName}`;
    const render2 = renderWrap(MarkAsRead, { defaultProps: newProps });
    const { getByTestId } = render2();

    expect(getByTestId('agent-alert:date')).toHaveTextContent(expectedHeader);
  });

  it('Properly truncates when name exceeds AGENT_NAME_CHARACTER_LIMIT', () => {
    const newAgentName = 'b'.repeat(AGENT_NAME_CHARACTER_LIMIT + 1);
    const newAlertData = {
      id: 'c9768b50-d935-47f3-a64d-bb54a46e5fcb',
      recordTimestamp: '1677269459324',
      type: 'NEXT_AGENT_NOTE',
      customerId: '255280668',
      createdDate: '2023-02-24T20:10:59.329359Z',
      details: {
        issueType: 'Other',
        nextAgentNote: 'Sample Alert 12345',
        acknowledged: 'false',
        agentId: 'admin',
        agentName: newAgentName,
      },
    };
    const newProps = { ...defaultProps, alertData: newAlertData };

    const agentIdOrName = newAgentName.slice(0, AGENT_NAME_CHARACTER_LIMIT);
    const expectedHeader = `${getDayDateYearTimeTimezone(
      newAlertData.createdDate,
    )} | ${agentIdOrName}`;
    const render2 = renderWrap(MarkAsRead, { defaultProps: newProps });
    const { getByTestId } = render2();

    expect(getByTestId('agent-alert:date')).toHaveTextContent(expectedHeader);
  });

  it('Invoking the link invokes createAgentAlert and onMarkAsRead', async () => {
    createAgentAlertMock.mockClear();
    onMarkAsRead.mockClear();

    const { getByTestId } = render();

    fireEvent.click(getByTestId(`mark-as-read-${alertData.id}`));

    await waitFor(() => expect(createAgentAlertMock).toHaveBeenCalled());
    await waitFor(() => expect(onMarkAsRead).toHaveBeenCalled());

    expect(createAgentAlertMock).toHaveBeenCalledWith({
      data: {
        id: alertData.id,
        recordTimestamp: alertData.recordTimestamp,
        createdDate: alertData.createdDate,
        customerId: alertData.customerId,
        type: 'NEXT_AGENT_NOTE',
        details: {
          agentName: alertData.details.agentName,
          interactionId: alertData.details.interactionId,
          agentId: alertData.details.agentId,
          issueType: alertData.details.issueType,
          nextAgentNote: alertData.details.nextAgentNote,
          acknowledged: 'true',
        },
      },
    });
    expect(onMarkAsRead).toHaveBeenCalledWith();
  });
});
