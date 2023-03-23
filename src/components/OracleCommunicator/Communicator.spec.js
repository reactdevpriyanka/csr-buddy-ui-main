import Postmate from 'postmate';
import Communicator from './Communicator';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Communicator', () => {
  const on = jest.fn();

  const emit = jest.fn();

  const useSpy = () => {
    const mockReturn = Promise.resolve({ on, emit });
    const spy = jest.spyOn(Postmate, 'Model');
    spy.mockReturnValueOnce(mockReturn);
    return [spy, mockReturn];
  };

  beforeEach(() => {
    jest.mock('postmate');
  });

  afterEach(() => {
    on.mockReset();
    emit.mockReset();
  });

  test('it should return model', () => {
    const communicator = new Communicator();
    const model = {};
    communicator.model = model;
    expect(communicator.getModel()).toBe(model);
  });

  test('it should mount Postmate model', () => {
    const [spy] = useSpy();
    expect(spy).not.toHaveBeenCalled();
    new Communicator();
    expect(spy).toHaveBeenCalled();
  });

  describe('with props', () => {
    test('it should mount Postmate model with props', () => {
      const [spy] = useSpy();
      new Communicator({ container: '#some-id' });
      expect(spy).toHaveBeenCalledWith({ container: '#some-id' });
    });
  });

  describe('on', () => {
    test('it should mount event listener on model', () => {
      const [__spy__, promise] = useSpy(); // eslint-disable-line no-unused-vars
      const communicator = new Communicator();
      return promise.then(() => {
        const fn = jest.fn();
        communicator.on('some-event', fn);
        expect(on).toHaveBeenCalledWith('some-event', fn);
      });
    });
  });

  describe('emit', () => {
    test('it should emit event on model', () => {
      const [__spy__, promise] = useSpy(); // eslint-disable-line no-unused-vars
      const communicator = new Communicator();
      return promise.then(() => {
        communicator.emit('some-event', { foo: 'bar' });
        expect(emit).toHaveBeenCalledWith('some-event', { foo: 'bar' });
      });
    });
  });
});
