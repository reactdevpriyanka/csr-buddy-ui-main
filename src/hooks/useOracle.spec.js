import { renderWrap } from '@utils';
import OracleContext from '@components/OracleCommunicator';
import useOracle from './useOracle';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('useOracle', () => {
  const model = {
    emit: jest.fn(),
  };

  const rewire = (communicator) => {
    communicator.model = model;
    return communicator;
  };

  const Component = () => {
    const communicator = useOracle();

    const onClick = () => {
      rewire(communicator).emit('launch-window');
    };

    return (
      <button data-testid="someButton" onClick={onClick}>
        {'Click to launch window'}
      </button>
    );
  };

  const App = () => {
    return (
      <OracleContext>
        <Component />
      </OracleContext>
    );
  };

  afterEach(() => {
    model.emit.mockReset();
  });

  const render = renderWrap(App, { testId: 'someButton' });

  test('it should return communicator', () => {
    const button = render.andGetByTestId();
    render.trigger.click(button);
    expect(model.emit).toHaveBeenCalledWith('launch-window', undefined);
  });
});
