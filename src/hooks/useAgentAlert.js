import axios from 'axios';

export default function useAgentAlert() {
  const createAgentAlert = async ({ data }) => axios.post(`/api/v1/agentNotes`, data, {});
  return {
    createAgentAlert,
  };
}
