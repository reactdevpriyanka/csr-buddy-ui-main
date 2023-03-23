import { v4 as uuidv4 } from 'uuid';

export default {
  sections: [
    {
      id: uuidv4(),
      span: 16,
      name: 'CONTENT_A',
      renderTo: 'CONTENT',
      margin: 1,
      padding: 1,
    },
  ],
  flow: {
    nodes: [
      {
        id: uuidv4(),
        immediate: true,
        renderTo: 'CONTENT_A',
      },
    ],
  },
  context: {},
};
