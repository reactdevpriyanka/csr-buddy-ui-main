import _ from 'lodash';

export const addNode = (originalFlow = {}, node) => {
  const flow = _.cloneDeep(originalFlow);

  let tmpFlow = flow.flowNodes.find((n) => n.id === node.id);
  if (tmpFlow) {
    Object.assign(tmpFlow, node);
  } else {
    tmpFlow = node;
  }

  return flow;
};
