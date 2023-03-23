/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import MultipleChoiceCard from './MultipleChoiceCard';

const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    marginBottom: theme.utils.fromPx(20),
  },
  content: {
    padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(24)} ${theme.utils.fromPx(24)}`,
  },
  title: {
    fontSize: theme.fonts.size['2xl'],
    color: theme.palette.blue.dark,
    fontWeight: '500',
    margin: `${theme.spacing(0.5)} 0`,
  },
  subtitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.palette.gray.dark,
    fontWeight: '500',
    margin: `${theme.spacing(0.5)} 0`,
  },
  options: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.utils.fromPx(24),

    margin: `${theme.spacing(2)} 0`,
  },
  button: {
    border: theme.borders.default,
    borderRadius: '0.5rem',
    background: 'white',
  },
  selected: {
    border: '1px solid #128ced !important',
    background: '#DDF0FF',
  },
  buttonHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonIcon: {
    display: 'flex',
    width: theme.utils.fromPx(40),
    height: theme.utils.fromPx(40),
    background: theme.palette.blue.pastel,
    padding: theme.spacing(0.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    margin: `${theme.spacing(0.5)} ${theme.spacing(1)} ${theme.spacing(0.5)} ${theme.spacing(0.5)}`,
  },
  buttonTitle: {
    fontSize: theme.fonts.size.lg,
    color: theme.palette.gray.dark,
  },
  buttonDescription: {
    margin: `0 ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)}`,
    textAlign: 'left',
    fontSize: theme.fonts.size.md,
    color: '#4D4D4D',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > button:last-of-type': {
      marginLeft: theme.spacing(1),
    },
  },
  hiddenInput: {
    display: 'none',
  },
}));

const testId = 'gwf-input:multiple-choice-cards';

const MultipleChoiceCards = ({
  choices = [],
  title = '',
  subTitle = '',
  name = '',
  onChoose = () => null,
}) => {
  const classes = useStyles();

  const [value, setValue] = useState('');

  const cardChoices = choices.slice(0, 4);

  const [otherChoice] = choices.slice(4, 5);

  // const selectedChoice = cardChoices.find((choice) => choice.value === value);

  return (
    <div className={classes.root}>
      <Card data-testid={testId} className={classes.card}>
        <CardContent className={classes.content}>
          <Typography data-testid={`${testId}-title`} variant="h1" className={classes.title}>
            {title}
          </Typography>
          <Typography
            data-testid={`${testId}-subtitle`}
            variant="h2"
            className={cn(classes.subtitle)}
          >
            {subTitle}
          </Typography>
          <div className={classes.options} data-testid="mc:options">
            {cardChoices.map((choice) => (
              <MultipleChoiceCard
                {...choice}
                key={choice.label}
                selected={value.value === choice.value}
                onClick={() => setValue(choice)}
              />
            ))}
          </div>
          <input type="hidden" name={name} value={value.value} />
          <div className={classes.actions}>
            {otherChoice && (
              <Button
                data-testid={`${testId}-actions:other`}
                color="secondary"
                onClick={() => onChoose(otherChoice.outcomeId)}
              >
                {otherChoice.label}
              </Button>
            )}
            <Button
              data-testid={`${testId}-actions:continue`}
              variant="contained"
              color="primary"
              disabled={value === ''}
              onClick={() => onChoose(value.outcomeId)}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

MultipleChoiceCards.propTypes = {
  choices: PropTypes.array,
  title: PropTypes.node,
  subTitle: PropTypes.node,
  name: PropTypes.node.isRequired,
  value: PropTypes.object,
  onContinue: PropTypes.func,
  onChange: PropTypes.func,
  onChoose: PropTypes.func,
};

export default MultipleChoiceCards;
