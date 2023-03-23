import { useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import 'react-folder-tree/dist/style.css';
import { Button, FormControl, FormLabel, Popover, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SearchIcon from '@material-ui/icons/Search';
import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import fpMapValues from 'lodash/fp/mapValues';

//dynamic import  addresses bug found at https://github.com/shunjizhan/react-folder-tree/issues/10#issuecomment-904177865
/* webpackChunkName: "componentFolderTree" */
// eslint-disable-next-line import/dynamic-import-chunkname
const FolderTree = dynamic(() => import('react-folder-tree'), {
  ssr: false, // needed to prevent warning about dynamic component
});

const useStyles = makeStyles((theme) => {
  const iconPadding = '10px';

  return {
    selectLabel: {
      //styles copied from TextField special note 'makestyles-label
      color: '#666666',
      display: 'block',
      fontSize: '12px',
      fontFamily: 'Roboto',
      lineHeight: '16px',
    },
    buttonSelectedContainer: {
      position: 'relative',
      marginTop: '4px',
    },
    buttonSelected: {
      justifyContent: 'flex-start',

      textTransform: 'none',
    },
    buttonSelectedPlaceholder: {
      color: theme.palette.gray['400'],
    },
    buttonChevron: {
      pointerEvents: 'none',
      position: 'absolute',
      right: '10px',
      height: '36px', //height of the muiButton
    },
    buttonChevronDisabled: {
      color: '#00000042', //copied from computed .MuiButton-root.Mui-disabled
    },
    popoverTreeContainer: {
      height: '300px',
      paddingLeft: '8px',
      paddingRight: '8px',
      '& .caretContainer + .typeIconContainer + .editableNameContainer .displayName': {
        '&:hover': {
          cursor: 'auto',
          color: 'unset',
        },
      },
    },
    popoverOptionsMenu: {
      minHeight: '40px',
    },
    filterContainer: {
      position: 'relative',
    },
    filterIcon: {
      position: 'absolute',
      left: iconPadding,
      pointerEvents: 'none',
      color: theme.palette.primary.main,
      height: '36px',
    },
    filterTextBox: {
      paddingLeft: iconPadding,
      paddingRight: iconPadding,
      '& input': {
        marginLeft: '24px',
      },
    },
    buttonText: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      marginRight: '24px',
    },
  };
});

const isFilterIncluded = (str, search) => {
  const strCleansed = String(str).toLowerCase().trim();
  const searchCleansed = String(search).toLowerCase().trim();
  return strCleansed.includes(searchCleansed);
};

const SelectTree = ({
  label = '',
  onSelect,
  disabled = false,
  value,
  optionsTree,
  className = '',
  classes: classesInit = {},
}) => {
  const classes = useStyles();
  const { root: classRoot, button: classButton } = fpMapValues(
    (value) => (typeof value === 'string' ? value : ''),
    classesInit,
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('');

  const recurseFilter = (arr, filter, isCategoryMatch = false) => {
    if (!Boolean(filter.trim())) {
      return arr;
    }
    let arrFiltered = [];
    for (const treeNode of arr) {
      if (treeNode.hasOwnProperty('children')) {
        let newTreeNode = cloneDeep(treeNode);
        const isNameMatch = isFilterIncluded(treeNode.name, filter);
        const isMatch = isNameMatch || isCategoryMatch; //propogate category matches down to terminal node
        newTreeNode.children = recurseFilter(newTreeNode.children, filter, isMatch);
        if (newTreeNode.children.length > 0) {
          arrFiltered.push(newTreeNode);
        }
      } else if (isFilterIncluded(treeNode.name, filter) || isCategoryMatch) {
        arrFiltered.push(cloneDeep(treeNode));
      }
    }

    return arrFiltered;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const onNameClick = ({ defaultOnClick, nodeData }) => {
    defaultOnClick();
    if (nodeData.isOpen === undefined) {
      //if terminal node
      onSelect(nodeData);
      handleClosePopover();
    }
  };

  const handleChangeFilter = (e) => {
    setFilter(e.target.value);
  };

  const dataFiltered = recurseFilter([optionsTree], filter);

  return (
    <FormControl fullWidth className={classnames(className, classRoot)}>
      <FormLabel className={classes.selectLabel}>{label}</FormLabel>
      <div className={classnames(classes.buttonSelectedContainer, classButton)}>
        <Button
          disabled={disabled}
          id="outlined-basic"
          variant="outlined"
          onClick={handleClick}
          fullWidth
          className={classnames(classes.buttonSelected, {
            [classes.buttonSelectedPlaceholder]: !value,
          })}
          classes={{ label: classes.buttonText }}
          data-cy="callwrapSelectTreeDdl"
        >
          {value?.name || 'Choose Option'}
        </Button>
        <KeyboardArrowDownIcon
          className={classnames(classes.buttonChevron, {
            [classes.buttonChevronDisabled]: disabled,
          })}
        />
      </div>
      <Popover
        id="popoverSelectTree"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className={classes.popoverOptionsMenu}>
          <div className={classes.filterContainer}>
            <SearchIcon className={classes.filterIcon} />
            <TextField
              id="selecttree-textfield"
              className={classes.filterTextBox}
              placeholder="Start typing to search..."
              value={filter}
              onChange={handleChangeFilter}
              data-cy="selecttree-textfield"
            />
          </div>
          <div className={classes.popoverTreeContainer} data-cy="popoverTreeContainer">
            <FolderTree
              showCheckbox={false}
              readOnly
              data={
                Array.isArray(dataFiltered) && typeof dataFiltered[0] === 'object'
                  ? dataFiltered[0]
                  : {}
              }
              onNameClick={onNameClick}
              iconComponents={{
                FileIcon: () => null, //react-folder-tree expects react Component
                FolderIcon: () => null,
                FolderOpenIcon: () => null,
              }}
              onChange={null} //prevent a console log
            />
          </div>
        </div>
      </Popover>
    </FormControl>
  );
};

SelectTree.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.string),
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.object,
  optionsTree: PropTypes.object,
};

export default SelectTree;
