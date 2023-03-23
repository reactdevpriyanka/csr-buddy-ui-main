/* eslint-disable react/jsx-props-no-spreading */
// import _ from 'lodash';
import { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Divider } from '@mui/material';
import { makeStyles } from '@material-ui/core';
import {
  Start,
  Integer,
  Float,
  Next,
  Label,
  Checkbox,
  Button,
  MultipleChoice,
  MultipleChoiceCards,
  ItemOption,
  MultiItemTable,
  ExternalLink,
  /* Debug, */
  Hidden,
  Dropdown,
  Text,
  PaymentOption,
  Address,
  AddressLabel,
  Email,
  NextChapter,
  DatePicker,
  TerminalNode,
  PaymentList,
  ExpandableLabel,
} from '@components/Base';
import ReturnPackageOptions from '@components/Base/ReturnPackageOptions/ReturnPackageOptions';
import ReturnItemList from '../Base/ReturnItemList/ReturnItemList';
import NodeToggleCheck from './NodeToggleCheck';

const components = {
  Start,
  Integer,
  Float,
  Label,
  Checkbox,
  Button,
  Next,
  MultipleChoiceCards,
  MultipleChoice,
  ItemOption,
  MultiItemTable,
  ReturnItemList,
  ExternalLink,
  Dropdown,
  Text,
  PaymentOption,
  Address,
  AddressLabel,
  Email,
  NextChapter,
  DatePicker,
  TerminalNode,
  PaymentList,
  ExpandableLabel,
  ReturnPackageOptions,
};

const refireComponentBlacklist = new Set(['ItemOption', 'Start', 'MultiItemTable']);

const navigateToSuzzieWhitelist = new Set(['Button', 'MultipleChoiceCards']);

const useStyles = makeStyles((theme) => ({
  root: {},
  divider: {
    height: '2px',
    marginBottom: '1rem !important',
    marginTop: '1.5rem !important',
  },
  checkBox: {
    ...theme.utils.checkBox,
  },
  secondaryNode: {
    marginTop: theme.utils.fromPx(24),
    '&:last-child': {
      marginBottom: theme.utils.fromPx(8),
    },
  },
  secondaryNodeContainer: {},
}));

const Node = ({
  Component,
  id,
  parentId = null,
  visible = true,
  required = false,
  value,
  enabled = true,
  outcomes = {},
  onOutcomeChosen = () => null,
  updateGwfHistory = () => null,
  onValidityChange,
  isFormValid,
  ...props
}) => {
  const NodeComponent = visible ? components[Component] || 'div' : Hidden;
  const [toggled, setToggled] = useState(false);
  const classes = useStyles();
  const {
    secondaryNodes,
    isToggleable,
    hasDivider,
    singularOutcome,
    choices,
    toggleLabel,
    depth,
    toggleDecisionAttribute,
  } = props;

  const onChoose = useCallback(
    (nodeId) => {
      if (navigateToSuzzieWhitelist.has(Component)) {
        // always fire this just in-case it has an external link
        // @see {https://chewyinc.atlassian.net/browse/CSRBT-406}
        window.dispatchEvent(
          new CustomEvent('gwf:reloadInSuzzie', {
            detail: nodeId || singularOutcome,
          }),
        );
      }
      if (singularOutcome && !refireComponentBlacklist.has(Component)) {
        window.dispatchEvent(
          new CustomEvent('gwf:refreshNodes', {
            detail: {
              id,
            },
          }),
        );
      }
      onOutcomeChosen(nodeId || singularOutcome);
    },
    [singularOutcome, onOutcomeChosen, id, Component],
  );

  useEffect(() => {
    if (Component === 'Button') return;

    // can be `false` in the case of Multiple Choice nodes
    const valueIsDefined = typeof value !== typeof undefined && value !== null;

    if (valueIsDefined && Array.isArray(choices)) {
      // a value is set and the outcome is always the same
      if (singularOutcome) {
        onOutcomeChosen(singularOutcome);
      } else {
        // a value is set and choices available, find matching value
        const chosen = choices.find((choice) => choice.value === value);
        if (chosen && chosen.outcomeId && !chosen.disabled) {
          onOutcomeChosen(chosen.outcomeId);
        }
      }
    } else if (valueIsDefined) {
      // value is not undefined or null
      onOutcomeChosen(singularOutcome);
    } else if (!required && singularOutcome) {
      // node is not required and singular, auto choose outcome
      onOutcomeChosen(singularOutcome);
    } else if (!required && Array.isArray(choices)) {
      // node is not required and multiple choice, use first available outcome
      onOutcomeChosen(choices[0].outcomeId);
    }
    // the below line is disabled because we only want it to run once per
    // mounted node, otherwise it will continue to run and override
    // a user's choice
  }, []);

  return (
    <>
      {isToggleable && toggleLabel && visible && (
        <NodeToggleCheck
          onChange={setToggled}
          toggleLabel={toggleLabel}
          checked={toggled}
          name={toggleDecisionAttribute}
          id={id}
        />
      )}
      {hasDivider && visible && <Divider className={classes.divider} />}
      {(isToggleable ? toggled : true) && (
        <NodeComponent
          {...props}
          id={id}
          value={value}
          required={required}
          disabled={!enabled}
          onChoose={onChoose}
          onValidityChange={onValidityChange}
          isFormValid={isFormValid}
        />
      )}
      {(isToggleable ? toggled : true) && secondaryNodes && visible && (
        <div className={classes.secondaryNodeContainer}>
          {secondaryNodes?.map((secondaryNode) => {
            return (
              <div key={secondaryNode?.id} className={classes.secondaryNode}>
                <Node
                  {...secondaryNode}
                  onOutcomeChosen={() => updateGwfHistory()}
                  depth={depth}
                  onValidityChange={onValidityChange}
                  isFormValid={isFormValid}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

Node.propTypes = {
  Component: PropTypes.string,
  id: PropTypes.string,
  parentId: PropTypes.string,
  name: PropTypes.string,
  outcomes: PropTypes.object,
  visible: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.any,
  enabled: PropTypes.bool,
  choices: PropTypes.array,
  singularOutcome: PropTypes.string,
  onOutcomeChosen: PropTypes.func,
  onValidityChange: PropTypes.func,
  updateGwfHistory: PropTypes.func,
  isFormValid: PropTypes.bool,
  hasDivider: PropTypes.bool,
  secondaryNodes: PropTypes.array,
  isToggleable: PropTypes.bool,
  toggleLabel: PropTypes.string,
  depth: PropTypes.string,
  toggleDecisionAttribute: PropTypes.string,
};

export default Node;
