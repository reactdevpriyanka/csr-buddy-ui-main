import customer from '__mock__/customers/nessa';

const mutate = jest.fn();

const mockUseCustomer = jest.fn(() => {
  return {
    mutate,
    error: null,
    data: customer,
    isValidating: false,
    updateCustomer: (id, data) =>
      new Promise((resolve) => {
        return resolve({ data: {} });
      }),
  };
});

mockUseCustomer.mutate = mutate;

export default mockUseCustomer;
