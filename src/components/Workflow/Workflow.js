/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import useNodes from '@/hooks/useNodes';
import useOutcome from '@/hooks/useOutcome';
import useNextChapter from '@/hooks/useNextChapter';
import useNextFlow from '@/hooks/useNextFlow';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import useFlowRefresh from '@/hooks/useFlowRefresh';
import useFlowHistory from '@/hooks/useFlowHistory';
import { GwfContext } from '@/components/Workflow/GwfContext';
import Node from './Node';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(2),
    '&.two-column': {
      display: 'grid',
      gridTemplateColumns: `${theme.utils.fromPx(400)} 1fr`,
    },
  },
}));

const Workflow = ({ workflow, fromHistory }) => {
  const {
    outcomeMap: initialOutcomeMap,
    nodeMap: initialNodeMap,
    context: initialContext,
    outcomes: initialOutcomes,
    startNodeId: initialStartNodeId,
  } = workflow;

  const classes = useStyles();

  const [nodeMap, setNodeMap] = useState(initialNodeMap || {});

  const [outcomeMap, setOutcomeMap] = useState(initialOutcomeMap || {});

  const [currentContext, setCurrentContext] = useState(initialContext || {});

  const [isFormValid, setIsFormValid] = useState(true);

  const [outcomes, setOutcomes] = useState(initialOutcomes || []);

  const nodes = useNodes(outcomes, nodeMap, outcomeMap);

  const renderingFromHistory = useRef(fromHistory);

  const onOutcomeChosen = useOutcome(outcomes, setOutcomes);

  const { updateGwfHistory, checkSummaryHistory, lockHistoryRender } = useFlowHistory({
    renderingFromHistory,
    outcomeMap,
    nodeMap,
    currentContext,
    outcomes,
  });

  const onChoose = useCallback(
    (nodeId, depth) => {
      /* Ignore `onChoose` events if we're rendering the flow from history */
      if (renderingFromHistory.current) return;

      /* The important bit - update the outcomes array */
      onOutcomeChosen(nodeId, depth);

      /* Remove `summary` data from history if needed */
      checkSummaryHistory();

      /* Useful for when a single outcome node changes (eg. an Integer).
       The below useEffect wouldn't capture that event otherwise */
      updateGwfHistory();
    },
    [onOutcomeChosen, checkSummaryHistory],
  );

  useNextChapter({ currentContext, lockHistoryRender });

  useNextFlow({
    currentContext,
    outcomes,
    nodeMap,
    outcomeMap,
    setOutcomes,
    setCurrentContext,
    setNodeMap,
    setOutcomeMap,
    renderingFromHistory,
  });

  useFlowRefresh({ currentContext, setCurrentContext, nodes, nodeMap, setNodeMap });

  /**
   * Manage context changes through prop updates
   */
  useEffect(() => {
    setCurrentContext(initialContext);
  }, [initialContext]);

  /**
   * Handle when a flow is updated through prop updates
   */
  useEffect(() => {
    if (initialStartNodeId) {
      setOutcomes([initialStartNodeId]);
    }
    if (initialOutcomes) {
      setOutcomes(initialOutcomes);
    }
  }, [initialStartNodeId, initialOutcomes]);

  /**
   * Handle when a nodeMap is updated through prop updates
   */
  useEffect(() => {
    setNodeMap(initialNodeMap);
  }, [initialNodeMap]);

  /**
   * Handle when an outcomeMap is updated through prop updates
   */
  useEffect(() => {
    setOutcomeMap(initialOutcomeMap);
  }, [initialOutcomeMap]);

  const isTwoColumn = useMemo(() => {
    return nodes.some(
      (node) =>
        (node?.Component === 'ItemOption' && node?.orientation === 'VERTICAL') ||
        node?.Component === 'ReturnItemList',
    );
  }, [nodes]);

  const onValidityChange = (isValid) => {
    checkSummaryHistory();
    setIsFormValid(isValid);
  };

  return (
    <form
      id="gwf-form"
      onSubmit={(event) => event.preventDefault()}
      className={classNames(classes.root, isTwoColumn && 'two-column')}
    >
      <GwfContext.Provider value={currentContext}>
        {nodes.map((node, depth) => (
          <Node
            {...node}
            depth={depth}
            onOutcomeChosen={(nodeId) => onChoose(nodeId, depth)}
            onValidityChange={onValidityChange}
            updateGwfHistory={updateGwfHistory}
            key={`${node.id}-${depth}`}
            isFormValid={isFormValid}
          />
        ))}
      </GwfContext.Provider>
    </form>
  );
};

Workflow.propTypes = {
  workflow: PropTypes.object,
  activityId: PropTypes.string,
  fromHistory: PropTypes.bool,
};

export default Workflow;
