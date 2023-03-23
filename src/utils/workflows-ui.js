import axios from 'axios';
import _ from 'lodash';
import processWorkflowData from './workflows';
import { addSessionStorageItem } from './sessionStorage';

const parseValue = (value) => {
  if (typeof value === 'string') {
    if (value === 'on') {
      return true;
    }
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } else if (['true', 'false'].includes(value)) {
      return value === 'true';
    }
  }
  return value;
};

export const loadNewChapter = (nextChapterName) => {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('gwf:loadNextChapter', { detail: { nextChapterName } }));
  }, 0);
};

export const loadNewFlow = (nodeId, depth, nextFlowName) => {
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('gwf:loadNextFlow', { detail: { nodeId, depth, nextFlowName } }),
    );
  }, 0);
};

export const CONTEXT_KEY_REGEX = /["']/g;

export const parseContextKey = (key) => key.trim().replaceAll(CONTEXT_KEY_REGEX, '');

export const mergeFormValuesWithContext = (context = {}) => {
  const form = document.querySelector('#gwf-form');

  if (!form) {
    // assume that if the form is not visible it is because of a route change and that the context is correct
    return context;
  }

  const fd = new FormData(form);

  const entries = Object.fromEntries(fd.entries()); // parse the form data into a Plain Old JavaScript Object
  const payload = { ...context };
  for (const key of Object.keys(entries)) {
    const contextKey = parseContextKey(key); // strip out the quotes for any keys that have them
    _.set(payload, contextKey, parseValue(entries[key]));
  }
  // first pass should set all checkboxes to the correct values,
  // except in the case of a key collision;
  // all we care about in this pass is that the context has the proper keys in the JSON payload
  for (const checkbox of form.querySelectorAll('input[type="checkbox"]')) {
    const contextKey = parseContextKey(checkbox.name);
    // ignore unnamed checkboxes
    if (contextKey?.length > 0) {
      _.set(payload, contextKey, checkbox.checked);
    }
  }
  // second pass should fix any key collisions where `true` will override any
  // checkboxes that came after them but were unchecked;
  // this pass will correct any `false` values that should have been `true`
  for (const checkbox of form.querySelectorAll('input[type="checkbox"]:checked')) {
    const contextKey = parseContextKey(checkbox.name); // get the key for this checkbox
    if (contextKey?.length > 0) {
      _.set(payload, contextKey, checkbox.checked); // and finally set the key to the value of `checked` (should always be `true`)
    }
  }
  return payload;
};

export const handleLoadNextFlow = async (nextFlowName, context, gwfVersion) => {
  const payload = mergeFormValuesWithContext(context);
  return axios
    .post(`/api/v1/gwf/version/${gwfVersion}/name/${nextFlowName}`, payload)
    .then(({ data }) => processWorkflowData(data));
};

/* Workflow updates tend to get a little spammy with all of the effects etc.
so let's just update the sessionStorage a little after things finish processing */
export const debounceUpdateSessionStorage = _.debounce(
  ({ storageKey, outcomeMap, nodeMap, context, outcomes }) => {
    /* Update nodeMap with each Node's current values */
    const nodeMapToSave = {};
    for (const [key, node] of Object.entries(nodeMap)) {
      nodeMapToSave[key] = { ...node };
      if (node.name) {
        const currentNodeValue = _.get(context, node.name);
        if (typeof currentNodeValue !== typeof undefined) {
          nodeMapToSave[key]['value'] = currentNodeValue;
        }
      }
    }

    /* We don't want to save NextChapter or ExternalLink nodes
    as those automatically perform route changes */
    const outcomesToSave = outcomes.filter((outcome) => {
      const Component = nodeMap[outcome]?.Component;
      return !['ExternalLink', 'NextChapter'].includes(Component);
    });

    addSessionStorageItem('gwf:history', {
      [storageKey]: {
        outcomeMap,
        nodeMap: nodeMapToSave,
        context: context,
        outcomes: outcomesToSave,
      },
    });
  },
  500,
);
