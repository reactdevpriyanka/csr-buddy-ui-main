import { useCallback, useContext } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CommentIcon from '@material-ui/icons/Comment';
import ModalContext, { MODAL } from '@components/ModalContext';

const useStyles = makeStyles((theme) => ({
  root: {},
  btnComment: {
    minWidth: 'unset',
    marginLeft: theme.utils.fromPx(8),
    marginTop: theme.utils.fromPx(5),
    padding: theme.utils.fromPx(5),
    borderWidth: theme.utils.fromPx(1),
    borderStyle: 'solid',
    borderColor: theme.palette.gray[400],
    color: theme.palette.primary.main,
    backgroundCcolor: theme.palette.white,
    alignSelf: 'end',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundCcolor: theme.palette.white,
      borderColor: theme.palette.secondary.main,
      borderWidth: theme.utils.fromPx(1),
    },
  },
  btnCommentActive: {
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default function OpenCommentsButton() {
  const classes = useStyles();

  const { setModal, modal } = useContext(ModalContext);

  const isCommentShown = modal === MODAL.ARCHIVECONTAINER;

  const handleClickOpenComments = useCallback(() => {
    setModal(isCommentShown ? null : MODAL.ARCHIVECONTAINER);
  }, [isCommentShown, setModal]);

  return (
    <Button
      variant={isCommentShown ? 'primary' : 'outlined'}
      className={classnames(classes.btnComment, isCommentShown && classes.btnCommentActive)}
      onClick={handleClickOpenComments}
      disableRipple
      data-testid="agent-alert:open-comments"
      aria-label="comments"
    >
      <CommentIcon />
    </Button>
  );
}
