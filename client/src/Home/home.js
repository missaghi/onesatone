import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import { Formik } from "formik";
import Typography from "@material-ui/core/Typography";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as Yup from "yup";
import socket from "../socket" 
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import classNames from 'classnames';

const styles = theme => ({
  
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
      },
      appBar: {
    position: "relative"
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  },
  h1: { textAlign: "center", marginLeft: "auto", marginRight: "auto" }
});

const validationSchema = Yup.object({
  nodeID: Yup.string("Enter a node").required("Node is required"),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  offers: Yup.array()
    .max(3, "Only 3 offers at once")
    .required("One offer required")
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: { invoice: "", img: "" },
      paid: false,
      copied: false,
    };

  } 


render() {
    const { classes } = this.props;
    const values = { 
    };

    return (
        <React.Fragment>
        <CssBaseline />
        
        <main>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              GlowSAT 
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Sell channels to grow the Lighting Network's liquidity and stack a few SATs or buys some channels to bootstrap your netowork. 
            </Typography>
                <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                    <Grid item>
                    <Button component={props => <Link  to="/list" {...props}/>} variant="contained" color="primary">
                        List (Sell)
                    </Button>
                    </Grid>
                    <Grid item>
                    <Button component={props => <Link  to="/browse" {...props}/>} variant="outlined" color="primary">
                        Browse (Buy)
                    </Button>
                    </Grid>
                </Grid>
                </div>
          </div>
        </div>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          {/* End hero unit */}
          <Grid container spacing={40}>
             
              <Grid item sm={4} md={4} lg={4}>
              <Card className={classes.card}> 
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      List Your Node
                    </Typography>
                    <Typography>
                      Set your own price to open channels then send an invoice when you get a request to open a channel. 
                    </Typography>
                  </CardContent> 
                </Card>
                </Grid>
              <Grid item sm={4} md={4} lg={4}>
                <Card className={classes.card}> 
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Add Liquidity
                    </Typography>
                    <Typography>
                      Find a listing and pay their invoice promptly so they open a channel with you.
                    </Typography>
                  </CardContent> 
                </Card>
                </Grid>
              <Grid item sm={4} md={4} lg={4}>
               <Card className={classes.card}> 
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Full Refunds
                    </Typography>
                    <Typography>
                        If you buy a channel and the seller flakes on you, I'll make you whole with their listing fee and remove their listing
                    </Typography>
                  </CardContent> 
                </Card>
              </Grid>
            
          </Grid>
        </div>
      </main>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
