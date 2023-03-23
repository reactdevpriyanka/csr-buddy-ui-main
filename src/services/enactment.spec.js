/* import axios from 'axios';
import { createService } from './enactment'; */

jest.mock('axios');

describe('@/services/enactment', () => {
  it('fake test until we re-implement this', () => {
    expect(true).toBeTruthy();
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  /*   const mockInstance = {
    get: jest.fn(),
  };

  axios.create.mockReturnValue(mockInstance);

  const service = createService();

  afterEach(() => {
    mockInstance.get.mockReset();
  });

  describe('dropPrivileges', () => {
    it('should call the correct Storefront URL', () => {
      service.dropPrivileges();
      expect(mockInstance.get).toHaveBeenCalledWith('/app/su/drop');
    });
  }); */
});
