import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.utils.lightShadow,
    borderRadius: theme.utils.fromPx(10),
    marginBottom: theme.utils.fromPx(40),
  },
  body: {
    padding: `${theme.utils.fromPx(24)} ${theme.utils.fromPx(24)}`,
  },
}));

const Card = ({
  header,
  footer,
  content,
  children,
  onClick,
  className = '',
  classBody = '',
  disabledCard = false,
  id,
}) => {
  const classes = useStyles();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      id={id}
      data-testid={`card${disabledCard ? 'Disabled' : ''}`}
      className={classnames(classes.root, className)}
      onClick={onClick}
    >
      {
        header && header //NOSONAR
      }
      <div data-testid="card:body" className={classnames(classes.body, classBody)}>
        {content || children}
      </div>
      {
        footer && footer //NOSONAR
      }
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  className: PropTypes.string,
  classBody: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  disabledCard: PropTypes.bool,
  id: PropTypes.string,
};

export default Card;
