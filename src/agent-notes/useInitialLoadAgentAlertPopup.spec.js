import { render } from '@testing-library/react';
import ModalContext, { MODAL } from '@/components/ModalContext';
import Providers from '@components/Providers';
import useGetAgentAlert from '@/agent-notes/useGetAgentAlert';
import useFeature from '@/features/useFeature';

import { waitFor, within, fireEvent } from '@testing-library/dom';
import useInitialLoadAgentAlertPopup from './useInitialLoadAgentAlertPopup';
const alerts = [
  {
    id: '7005b0f3-b0f9-4690-8c61-731868ac9d41',
    recordTimestamp: '1677643269624',
    type: 'NEXT_AGENT_NOTE',
    customerId: '148847217',
    createdDate: '2023-03-01T04:01:09.625347Z',
    details: {
      issueType: 'Other',
      nextAgentNote: 'An example alert',
      acknowledged: 'false',
      agentId: 'admin',
    },
  },
];

jest.mock('@/agent-notes/useGetAgentAlert');

useGetAgentAlert.mockReturnValue({ data: alerts });

jest.mock('@/features/useFeature');

describe('useInitialLoadAgentAlertPopup', () => {
  beforeEach(() => {
    useGetAgentAlert.mockClear();
    useFeature.mockReturnValue(true);
  });

  it('Renders a snackbar with the most recent alert from the agents', () => {
    const setModalMock = jest.fn();
    const setInitialLoadMock = jest.fn();

    const modalProviderProps = {
      setModal: setModalMock,
      modal: null,
      initialLoad: true,
      setInitialLoad: setInitialLoadMock,
    };

    const { container, queryByText } = render(
      <Providers>
        <ModalContext.Provider value={modalProviderProps}>
          <TestComponent />
        </ModalContext.Provider>
      </Providers>,
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(queryByText('Alert - Other')).not.toBeNull();
    expect(queryByText('View Alert')).not.toBeNull();
  });

  it('sets initial load to false on render', async () => {
    const setModalMock = jest.fn();
    const setInitialLoadMock = jest.fn();

    const modalProviderProps = {
      setModal: setModalMock,
      modal: null,
      initialLoad: true,
      setInitialLoad: setInitialLoadMock,
    };

    render(
      <Providers>
        <ModalContext.Provider value={modalProviderProps}>
          <TestComponent />
        </ModalContext.Provider>
      </Providers>,
    );
    await waitFor(() => expect(setInitialLoadMock).toHaveBeenCalledWith(false));
  });

  it('invokes setModal with ARCHIVECONTAINER when view alert is pressed', async () => {
    const setModalMock = jest.fn();
    const setInitialLoadMock = jest.fn();

    const modalProviderProps = {
      setModal: setModalMock,
      modal: null,
      initialLoad: true,
      setInitialLoad: setInitialLoadMock,
    };

    const { getByTestId } = render(
      <Providers>
        <ModalContext.Provider value={modalProviderProps}>
          <TestComponent />
        </ModalContext.Provider>
      </Providers>,
    );

    const button = getByTestId('actionButton-warning');

    expect(within(button).queryByText('View Alert')).not.toBeNull();
    fireEvent.click(button);
    await waitFor(() => expect(setModalMock).toHaveBeenCalledWith(MODAL.ARCHIVECONTAINER));
  });

  it('invokes setModal with null when isCommentShown is true', async () => {
    const setModalMock = jest.fn();
    const setInitialLoadMock = jest.fn();

    const modalProviderProps = {
      setModal: setModalMock,
      modal: MODAL.ARCHIVECONTAINER,
      initialLoad: true,
      setInitialLoad: setInitialLoadMock,
    };

    const { getByTestId } = render(
      <Providers>
        <ModalContext.Provider value={modalProviderProps}>
          <TestComponent />
        </ModalContext.Provider>
      </Providers>,
    );

    const button = getByTestId('actionButton-warning');

    expect(within(button).queryByText('View Alert')).not.toBeNull();
    fireEvent.click(button);
    await waitFor(() => expect(setModalMock).toHaveBeenCalledWith(null));
  });

  it('doesnt process if alertSnackbarEnabled is false', () => {
    useFeature.mockReturnValue(false);
    const setModalMock = jest.fn();
    const setInitialLoadMock = jest.fn();

    const modalProviderProps = {
      setModal: setModalMock,
      modal: null,
      initialLoad: true,
      setInitialLoad: setInitialLoadMock,
    };

    const { container } = render(
      <Providers>
        <ModalContext.Provider value={modalProviderProps}>
          <TestComponent />
        </ModalContext.Provider>
      </Providers>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('doesnt process if not first time load', () => {
    const setModalMock = jest.fn();
    const setInitialLoadMock = jest.fn();

    const modalProviderProps = {
      setModal: setModalMock,
      modal: null,
      initialLoad: false,
      setInitialLoad: setInitialLoadMock,
    };

    const { container } = render(
      <Providers>
        <ModalContext.Provider value={modalProviderProps}>
          <TestComponent />
        </ModalContext.Provider>
      </Providers>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

function TestComponent() {
  useInitialLoadAgentAlertPopup(); //initial alert pop up on page load
  return null;
}
