import { useRouter } from 'next/router';
import useEnactment from '@/hooks/useEnactment';
import { createService } from '@/services/enactment';
import { renderWrap } from '@utils';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useEnv');
jest.mock('@/services/enactment');

describe('useEnactment', () => {
  let enactment = null;

  const mockEnactmentService = {
    dropPrivileges: jest.fn(),
  };

  createService.mockReturnValue(mockEnactmentService);

  useRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  const TestComponent = () => {
    enactment = useEnactment();
    return <div />;
  };

  const render = renderWrap(TestComponent);

  beforeEach(() => {
    render();
  });

  afterEach(() => {
    enactment = null;
  });

  test('it should drop user privileges', () => {
    enactment.drop();
    expect(mockEnactmentService.dropPrivileges).toHaveBeenCalled();
  });
});
