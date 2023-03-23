import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Card, CardActions } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  assistiveMessage: {
    backgroundColor: '#1C49C2',
    padding: '12px, 16px, 12px, 16px',
    height: '48px',
    borderRadius: '4px',
    marginTop: '16px',
    marginBottom: '16px',

    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#FFFFFF',
  },
  assistivePanel: {
    padding: '12px 16px 12px 16px',
  },
}));

const AssistiveText = ({ content }) => {
  const classes = useStyles();
  if (!content) {
    return null;
  }

  return (
    <Card className={classes.assistiveMessage}>
      <CardActions classes={{ root: classes.assistivePanel }}>
        <InfoOutlinedIcon />
        <div className={classes.messageContent}>
          <span className={classes.messageHeader}>{content}</span>
        </div>
      </CardActions>
    </Card>
  );
};

AssistiveText.propTypes = {
  content: PropTypes.string.isRequired,
};

export default AssistiveText;
