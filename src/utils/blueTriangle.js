/* eslint-disable no-undef */

export const start = (name) => {
  if ('bttUT' in window) {
    bttUT.start({ pageName: name, txnName: 'eCommerce' });
  }
};

export const end = (name) => {
  if ('bttUT' in window) {
    bttUT.end({ pageName: name, txnName: 'eCommerce' });
  }
};
