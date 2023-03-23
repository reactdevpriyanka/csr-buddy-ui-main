import { screen } from '@testing-library/dom';
import { render, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import useOracle from '@/hooks/useOracle';
import useGetAgentAlert from '@/agent-notes/useGetAgentAlert';
import Providers from '@components/Providers';
import AlertContainer from './AlertContainer';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useOracle');
jest.mock('@/agent-notes/useGetAgentAlert');

describe('<AlertContainer />', () => {
  beforeAll(() => {
    useRouter.mockReturnValue({
      query: {
        id: '5555',
      },
    });

    useOracle.mockReturnValue({
      getIncidentStartData: () => ({ interactionId: '9999' }),
      emit: jest.fn(),
    });
  });

  test('it should display Create Agent Alert form', () => {
    useGetAgentAlert.mockReturnValue({
      agentAlerts: [],
    });

    render(
      <Providers>
        <AlertContainer />
      </Providers>,
    );

    const createAlertBtn = screen.getByTestId('alert:create agent alert');
    expect(createAlertBtn).toBeInTheDocument();
    fireEvent.click(createAlertBtn);

    expect(render()).toMatchSnapshot();

    const form = screen.getByTestId('create-agent-alert');
    expect(form).toBeInTheDocument();

    const title = screen.getByTestId('alert:agent alert title');
    expect(title).toBeInTheDocument();
    const description = screen.getByTestId('alert:agent alert paragraph');
    expect(description).toBeInTheDocument();

    const alertTypeInput = screen.getByTestId('add-alert-type');
    expect(alertTypeInput).toBeInTheDocument();
    const alertNote = screen.getByTestId('add-alert-note');
    expect(alertNote).toBeInTheDocument();

    const submitBtn = screen.getByTestId('save-agent-alert');
    expect(submitBtn).toBeInTheDocument();
    const cancelBtn = screen.getByTestId('add-agent-alert-cancel');
    expect(cancelBtn).toBeInTheDocument();
  });
});
