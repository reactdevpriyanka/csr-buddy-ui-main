export default function mockUseAgentInteractions() {
  return {
    captureInteraction: (data) =>
      new Promise((resolve) => {
        return resolve({ data: {} });
      }),

    captureInteractionError: (data) => Promise.reject(data),
  };
}
