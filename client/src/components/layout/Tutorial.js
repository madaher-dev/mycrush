import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));

function getSteps() {
  return [
    'Create an Account',
    'Connect & Verify',
    'Add a Crush',
    'Match and More...'
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `Signup using your email or various social media accounts. You have to verify your email so that no one can claim your identity.`;
    case 1:
      return `Connect social media accounts such as Facebook, Instagram and Twitter or verify your emails and phone number. Only verified handlers
              will be matchable with your Crushes. The more accounts you connect, the more chance you will match with your Crush!`;
    case 2:
      return `Add one or more Crushes. You can choose to look for your crush by email, phone number or social media accounts.
              You can even enter a private note so that your crush can see when you match!  Each new crush will cost you one point. You can gain points
              by inviting your friends to the platform and spread the love`;
    case 3:
      return `You will be matched if your crush have verified the network you are searching for them on and the interest is mutual`;

    default:
      return 'Unknown step';
  }
}

const Tutorial = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Typography>
        MyCrush allows you to match with the person you secretly have a crush
        on. All you need is to signup and create a crush entering any contact
        information you know about your crush.
      </Typography>
      <Typography>
        You can match with emails, phone number, or social media accounts such
        as Facebook, Instagram and Twitter.
      </Typography>
      <Typography>
        Your crush will only know about your interest if the crush is mutual!
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography> Happy Matchig!</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Read again
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default Tutorial;
