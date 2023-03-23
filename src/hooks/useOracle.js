export default function useOracle() {
  if (typeof window !== 'undefined') {
    return window.__ORACLE__;
  }
}
