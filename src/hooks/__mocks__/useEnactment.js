export const drop = jest.fn();
export const openEnactmentPage = jest.fn();
export const openEnactmentLogin = jest.fn();

export default function useEnactment() {
  return {
    drop,
    openEnactmentPage,
    openEnactmentLogin,
  };
}
