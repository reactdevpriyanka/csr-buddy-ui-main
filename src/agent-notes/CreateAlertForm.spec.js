import { useRouter } from 'next/router';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import useAgentAlert from '@/hooks/useAgentAlert';
import useCSRInfo from '@/hooks/useCSRInfo';
import useOracle from '@/hooks/useOracle';
import Providers from '@components/Providers';
import ModalContext from '@/components/ModalContext';

import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import { alertTypes } from './alertTypes';
import CreateAlertForm from './CreateAlertForm';

const csrData = {
  logonId: 'admin',
  userId: '81',
  epId: null,
  customerId: '148847217',
  profile: 'DEV - CSRBuddy - Admin',
  agentName: 'agent15',
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
useRouter.mockReturnValue({
  query: {
    id: '123123',
  },
});

const mockEnqueueSnackbar = jest.fn().mockResolvedValue({});

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueueSnackbar,
    };
  },
}));

const createAlertMock = jest.fn().mockResolvedValue({});
jest.mock('@/hooks/useAgentAlert');

useAgentAlert.mockReturnValue({
  createAgentAlert: createAlertMock,
});

jest.mock('@/hooks/useCSRInfo');
useCSRInfo.mockReturnValue({
  data: csrData,
});

jest.mock('@/hooks/useOracle');
useOracle.mockReturnValue({
  getIncidentStartData: () => ({ interactionId: 1 }),
});

describe('<CreateAlertForm />', () => {
  describe('static load', () => {
    it('Has introductory text', () => {
      const setInitialLoadMock = jest.fn();
      const modalProviderProps = {
        modal: null,
        setInitialLoad: setInitialLoadMock,
      };
      const { getByTestId } = render(
        <Providers>
          <ModalContext.Provider value={modalProviderProps}>
            <CreateAlertForm />
          </ModalContext.Provider>
        </Providers>,
      );
      expect(getByTestId('alert:agent alert paragraph')).toBeTruthy();
      expect(getByTestId('alert:agent alert title')).toHaveTextContent('Create Agent Alert');
      expect(getByTestId('add-agent-alert-cancel')).not.toHaveAttribute('disabled');
      expect(getByTestId('save-agent-alert')).toHaveAttribute('disabled');
    });

    it('has each alert type on dropdown', () => {
      const setInitialLoadMock = jest.fn();
      const modalProviderProps = {
        modal: null,
        setInitialLoad: setInitialLoadMock,
      };
      const { getByTestId } = render(
        <Providers>
          <ModalContext.Provider value={modalProviderProps}>
            <CreateAlertForm />
          </ModalContext.Provider>
        </Providers>,
      );
      const petNameSelect = getByTestId('add-alert-type');

      const petType = within(petNameSelect).getByRole('button');
      fireEvent.click(petType);
      fireEvent.mouseDown(petType);

      alertTypes.map((alertType) =>
        expect(getByTestId(`alert:type-${alertType.value}`)).toBeTruthy(),
      );
    });
  });
  describe('partial form fill', () => {
    it('just filling reason is not sufficent', () => {
      const setInitialLoadMock = jest.fn();
      const modalProviderProps = {
        modal: null,
        setInitialLoad: setInitialLoadMock,
      };
      const { getByTestId } = render(
        <Providers>
          <ModalContext.Provider value={modalProviderProps}>
            <CreateAlertForm />
          </ModalContext.Provider>
        </Providers>,
      );

      const reasonInput = getByTestId('add-alert-note').querySelector('textarea');
      fireEvent.click(reasonInput);
      fireEvent.change(reasonInput, { target: { value: 'example reason 1' } });

      expect(getByTestId('save-agent-alert')).toHaveAttribute('disabled');
    });

    it('just filling a type is not sufficent', () => {
      const setInitialLoadMock = jest.fn();
      const modalProviderProps = {
        modal: null,
        setInitialLoad: setInitialLoadMock,
      };
      const { getByTestId } = render(
        <Providers>
          <ModalContext.Provider value={modalProviderProps}>
            <CreateAlertForm />
          </ModalContext.Provider>
        </Providers>,
      );
      const petNameSelect = getByTestId('add-alert-type');

      const petType = within(petNameSelect).getByRole('button');
      fireEvent.click(petType);
      fireEvent.mouseDown(petType);
      const r1 = alertTypes[0].value;
      fireEvent.click(getByTestId(`alert:type-${r1}`));
      expect(getByTestId('save-agent-alert')).toHaveAttribute('disabled');
    });

    it('onClose invoked on onCancel', async () => {
      const onClose = jest.fn();
      const setInitialLoadMock = jest.fn();
      const modalProviderProps = {
        modal: null,
        setInitialLoad: setInitialLoadMock,
      };
      const { getByTestId } = render(
        <Providers>
          <ModalContext.Provider value={modalProviderProps}>
            <CreateAlertForm onClose={onClose} />
          </ModalContext.Provider>
        </Providers>,
      );

      fireEvent.click(getByTestId('add-agent-alert-cancel'));
      await waitFor(() => expect(onClose).toHaveBeenCalledWith());
    });
  });
  describe('submit form', () => {
    beforeEach(() => {
      createAlertMock.mockClear();
      useAgentAlert.mockClear();
      mockEnqueueSnackbar.mockClear();
    });
    it('invokes setAgentLoad, createAgentAlert, onAfterSubmit, and a success snackbar', async () => {
      const onAfterSubmit = jest.fn();
      const setInitialLoadMock = jest.fn();
      const modalProviderProps = {
        modal: null,
        setInitialLoad: setInitialLoadMock,
      };
      const { getByTestId } = render(
        <Providers>
          <ModalContext.Provider value={modalProviderProps}>
            <CreateAlertForm onAfterSubmit={onAfterSubmit} />
          </ModalContext.Provider>
        </Providers>,
      );

      const reasonInput = getByTestId('add-alert-note').querySelector('textarea');
      fireEvent.click(reasonInput);
      fireEvent.change(reasonInput, { target: { value: 'example reason 1' } });
      const petNameSelect = getByTestId('add-alert-type');

      const petType = within(petNameSelect).getByRole('button');
      fireEvent.click(petType);
      fireEvent.mouseDown(petType);
      const r1 = alertTypes[0].value;
      fireEvent.click(getByTestId(`alert:type-${r1}`));

      const saveBtn = getByTestId('save-agent-alert');
      expect(saveBtn).not.toHaveAttribute('disabled');
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(setInitialLoadMock).toHaveBeenCalledWith(false);
        expect(createAlertMock).toHaveBeenCalled();
        expect(onAfterSubmit).toHaveBeenCalledWith();
        expect(mockEnqueueSnackbar).toHaveBeenCalled();
      });

      expect(createAlertMock.mock.calls[0][0]).toMatchObject({
        data: {
          customerId: '123123',
          type: 'NEXT_AGENT_NOTE',
          details: {
            agentName: 'agent15',
            issueType: r1,
            nextAgentNote: 'example reason 1',
            acknowledged: 'false',
            interactionId: 1,
            agentId: 'admin',
          },
        },
      });

      expect(mockEnqueueSnackbar.mock.calls[0][0]).toMatchObject({
        messageHeader: 'Success',
        variant: SNACKVARIANTS.SUCCESS,
        messageSubheader: 'Success! Agent Alert Saved',
      });
    });

    it('invokes error snackbar on failed create agent alert promise', async () => {
      const setInitialLoadMock = jest.fn();
      const modalProviderProps = {
        modal: null,
        setInitialLoad: setInitialLoadMock,
      };

      useAgentAlert.mockReturnValue({
        createAgentAlert: (_) =>
          new Promise((resolve, reject) => {
            return reject({});
          }),
      });
      const { getByTestId } = render(
        <Providers>
          <ModalContext.Provider value={modalProviderProps}>
            <CreateAlertForm />
          </ModalContext.Provider>
        </Providers>,
      );

      const reasonInput = getByTestId('add-alert-note').querySelector('textarea');
      fireEvent.click(reasonInput);
      fireEvent.change(reasonInput, { target: { value: 'example reason 1' } });
      const petNameSelect = getByTestId('add-alert-type');

      const petType = within(petNameSelect).getByRole('button');
      fireEvent.click(petType);
      fireEvent.mouseDown(petType);
      const r1 = alertTypes[0].value;
      fireEvent.click(getByTestId(`alert:type-${r1}`));

      const saveBtn = getByTestId('save-agent-alert');
      expect(saveBtn).not.toHaveAttribute('disabled');
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalled();
      });

      expect(mockEnqueueSnackbar.mock.calls[0][0]).toMatchObject({
        messageHeader: 'Error',
        variant: SNACKVARIANTS.ERROR,
        messageSubheader: 'Failed to create agent alert',
      });
    });
  });
});
