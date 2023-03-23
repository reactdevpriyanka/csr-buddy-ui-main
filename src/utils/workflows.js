/* eslint-disable unicorn/no-array-reduce, unicorn/consistent-destructuring */
import _ from 'lodash';

const evalPropertyName = (node, prop) => {
  if (!node[prop]) return;

  const { contextVariableName, value } = node[prop];

  if (contextVariableName) {
    return contextVariableName;
  }
  if (value) {
    return value;
  }

  return node[prop];
};

const EVAL_REPLACEMENT_REGEX = /{[\w.]+}/;

const evalProperty = (node, prop, context, lang) => {
  if (!node[prop]) {
    return;
  }

  let object = node;
  let key = prop;
  if (node[prop].hasOwnProperty('messageBaseName')) {
    key = node[prop].messageBaseName;
    object = lang;
  } else if (node[prop].hasOwnProperty('contextVariableName')) {
    key = node[prop].contextVariableName;
    object = context;
  } else if (node[prop].hasOwnProperty('value')) {
    key = `${prop}.value`;
  }

  const value = _.get(object, key);

  if (EVAL_REPLACEMENT_REGEX.test(value)) {
    return value.replace(EVAL_REPLACEMENT_REGEX, (toReplace) =>
      _.get(context, toReplace.slice(1, -1)),
    );
  }

  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      break;
  }

  return value;
};

const mapChoices = (node, context, outcomesMap) => {
  const choices = node.choices?.value ? node.choices.value : node.choices || node.answerChoices;
  if (choices.hasOwnProperty('contextVariableName')) {
    return _.get(context, choices.contextVariableName);
  }

  // for each choice: run evalProperty
  return choices.map((choice) => {
    const enabled = choice.hasOwnProperty('enabled')
      ? evalProperty(choice, 'enabled', context)
      : true;
    return {
      ...choice,
      disabled: !enabled,
      label: evalProperty(choice, 'label', context),
      subLabel: evalProperty(choice, 'subLabel', context),
      amount: evalProperty(choice, 'amount', context),
      value: evalProperty(
        choice,
        choice.decisionInputValue ? 'decisionInputValue' : 'value',
        context,
      ),
      outcomeId: outcomesMap[choice.outcomeId],
    };
  });
};

const zipProperties = (node, context, displayProperty, valueProperty) => {
  const displayItems = _.get(context, displayProperty);
  const valueItems = _.get(context, valueProperty);
  const zipped = _.zip(displayItems, valueItems).map(([label, value]) => ({ label, value }));
  return zipped;
};

const componentMap = {
  ADDRESS: 'Address',
  ADDRESS_LABEL: 'AddressLabel',
  INTEGER: 'Integer',
  FLOAT: 'Float',
  START_NODE: 'Start',
  RETURN_ITEM_OPTION: 'MultiItemTable',
  RETURN_ITEM_LIST: 'ReturnItemList',
  ITEM_OPTION: 'ItemOption',
  BOOLEAN: 'Checkbox',
  MULTIPLE_CHOICE: 'MultipleChoice',
  LABELED_OPTIONS: 'MultipleChoice',
  LABEL: 'Label',
  BUTTON: 'Button',
  NEXT_FLOW_TRANSITION: 'Next',
  SUZZIE_TRANSITION: 'ExternalLink',
  MULTIPLE_CHOICE_CARDS: 'MultipleChoiceCards',
  TOTAL_OPTION: 'RefundOptions',
  TERMINAL_NODE: 'TerminalNode',
  EXTERNAL_LINK: 'ExternalLink',
  DROPDOWN: 'Dropdown',
  TEXT: 'Text',
  PAYMENT: 'PaymentOption',
  EMAIL_ADDRESS: 'Email',
  NEXT_CHAPTER_TRANSITION: 'NextChapter',
  DATE: 'DatePicker',
  PAYMENT_LIST: 'PaymentList',
  EXPANDABLE_LABEL: 'ExpandableLabel',
  RETURN_PACKAGE_OPTIONS: 'ReturnPackageOptions',
};

function mapNode(current, context, outcomesMap, lang) {
  const { id, nodeType, singularOutcomeId } = current;
  const singularOutcome = outcomesMap[singularOutcomeId];
  const Component = componentMap[nodeType];
  let choices;
  if (current.hasOwnProperty('choices') || current.hasOwnProperty('answerChoices')) {
    choices = mapChoices(current, context, outcomesMap);
  }

  const evalWithContext = (prop) => evalProperty(current, prop, context, lang);

  const mapShipments = () => {
    const { lineItems = [], shipments = [] } = context;
    let shipmentMap = [];

    // Relate external id to regular id, value is shipment number
    for (const [shipmentNumber, shipment] of shipments.entries()) {
      const { shipmentItems } = shipment;
      shipmentMap[shipmentNumber] = [];

      for (const item of shipmentItems) {
        const { quantity: quantityInShipment } = item;
        const { externalId, quantity: totalQuantity, id } = lineItems.find(
          (lineItem) => lineItem?.id === item?.lineItemId,
        );
        if (!externalId) continue;
        shipmentMap[shipmentNumber].push({ externalId, totalQuantity, id, quantityInShipment });
      }
    }

    return shipmentMap;
  };

  const node = {
    Component,
    id,
    name: evalWithContext('decisionInputAttribute'),
    toggleDecisionAttribute: evalWithContext('toggleDecisionAttribute'),
    required: evalWithContext('required'),
    visible: evalWithContext('visible'),
    enabled: evalWithContext('enabled'),
    title: evalWithContext('questionContent'),
    label: evalWithContext('label'),
    subLabel: evalWithContext('subLabel'),
    variant: evalWithContext('type'),
    href: evalWithContext('url'),
    nextFlowName: evalWithContext('nextFlowName'),
    lineItems: evalWithContext('itemChoices'),
    shipments: Component === 'ReturnItemList' ? mapShipments() : evalWithContext('shipmentChoices'),
    notShippedItems: evalWithContext('notShippedItemChoices'),
    alignment: evalWithContext('alignment'),
    orientation: evalWithContext('orientation'),
    placeholder: evalWithContext('placeHolder'),
    value: _.get(context, evalPropertyName(current, 'decisionInputAttribute')), // { value: [] }
    max: evalWithContext('maximumValue'),
    min: evalWithContext('minimumValue'),
    helperText: evalWithContext('invalidityMessage'),
    returnType: evalWithContext('returnType'),
    returnItems: evalWithContext('returnItems'),
    headerPriority: evalWithContext('headerPriority'),
    hasCancel: evalWithContext('hasCancel'),
    emphasis: evalWithContext('emphasis'),
    subLabelEmphasis: evalWithContext('subLabelEmphasis'),
    subLabelPriority: evalWithContext('subLabelPriority'),
    hiddenOutcome: evalWithContext('hiddenOutcome'),
    expandedOutcome: evalWithContext('expandedOutcome'),
    hasDivider: evalWithContext('hasDivider'),
    isToggleable: evalWithContext('isToggleable'),
    toggleLabel: evalWithContext('toggleLabel'),
    inputLabel: evalWithContext('inputLabel'),
    options:
      current.displayInputAttribute &&
      current.valueInputAttribute &&
      zipProperties(current, context, current.displayInputAttribute, current.valueInputAttribute),
    choices,
    singularOutcome,
  };

  return node;
}

const mapOutcome = (node, nodeMap, outcomeMap, outcomes = {}) => {
  outcomes[node.id] = {};

  if (node.singularOutcomeId || node.singularOutcome) {
    const key = node.singularOutcomeId || node.singularOutcome;
    const next = nodeMap[key];
    if (next) {
      mapOutcome(next, nodeMap, outcomeMap, outcomes[node.id]);
    }
  } else if (node.choices || node.answerChoices) {
    const choices = node.choices || node.answerChoices || [];
    for (const choice of choices) {
      const choiceNode = nodeMap[choice.outcomeId];
      if (choiceNode) {
        mapOutcome(choiceNode, nodeMap, outcomeMap, outcomes[node.id]);
      }
    }
  }

  return outcomes;
};

export default function workflow({ flow, context }, lang) {
  const { flowName, flowNodes, flowLinks, startNode } = flow;

  const outcomeToNode = flowLinks.reduce((acc = {}, outcome) => {
    if (!acc[outcome.outcomeId]) {
      acc[outcome.outcomeId] = outcome.destinationNodeId;
    }

    return acc;
  }, {});

  const nodeMap = flowNodes.reduce((acc = {}, current) => {
    if (!acc[current.id]) {
      acc[current.id] = mapNode(current, context, outcomeToNode, lang);
    }

    const { secondaryNodes } = current;

    if (secondaryNodes) {
      let accumulatedSecondaryNodes = [];
      const secondaryNodeIds = secondaryNodes;

      for (const secondaryNodeId of secondaryNodeIds) {
        const foundSecondaryNode = flowNodes.find((node) => node.id === secondaryNodeId);
        const mappedSecondaryNode = mapNode(foundSecondaryNode, context, outcomeToNode, lang);
        accumulatedSecondaryNodes.push(mappedSecondaryNode);
      }

      acc[current.id].secondaryNodes = accumulatedSecondaryNodes;
    }

    return acc;
  }, {});

  const start = nodeMap[startNode.id];

  const outcomeMap = mapOutcome(start, nodeMap, outcomeToNode);

  return {
    flowName, // display name in URL
    nodeMap, // maps a node ID to a mapped node
    startNodeId: startNode.id, // needed to begin the flow
    outcomeMap,
    context,
    definition: flow, // for logging purposes
  };
}
