import React, { Component } from "react";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import { Formik } from "formik"; 
import Form from "./form";

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper'; 
import Typography from '@material-ui/core/Typography';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as Yup from "yup"

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: { 
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  h1: {textAlign:'center', marginLeft: 'auto', marginRight:'auto'},
});

const validationSchema = Yup.object({
  nodeID: Yup.string("Enter a node")
  .required("Node is required"),
  email: Yup.string("Enter your email")
  .email("Enter a valid email")
  .required("Email is required"),
  offers: Yup.array().max(3, "Only 3 offers at once")
  .required("One offer required")});

class ListingForm extends React.Component {
 constructor(props) {
   super(props);
   this.state = { 
      invoice : { invoice: "", img : ""} ,
      copied: false,
  };
 }

 handleSubmit = vals => {
 
  fetch("/api/list", {
    method: 'post',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(vals)
  }).then(res => res.json())
    .then(invoice => {
      if (invoice.error)
       console.log(invoice.error);
      else 
        this.setState({invoice : { invoice : invoice.payment_request, img : invoice.img }});
  }).catch(function(error) {
    console.log(error);
  });
  
 }
 

 render() {
   const {classes} = this.props;
   const values = { nodeID: "", email: "", offers:  [{ size: 100000, fee: 10000 }, ] };
   
   return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" color="inherit" noWrap>
            GlowSAT
          </Typography>  
        </Toolbar>
      </AppBar>
      <h1 className={classes.h1}>List your node</h1> 
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" align="center">
            Get paid to open channels with other nodes
          </Typography>  
            <Formik
              render={props => <Form {...props} />}
              initialValues={values}
              validationSchema={validationSchema}  
              onSubmit={(values, actions) => {
                this.handleSubmit(values);
                actions.setSubmitting(false);
                }}
            />
            { (this.state.invoice.invoice.length > 0) ?  
            <div> 
              <div><img src={this.state.invoice.img} /> </div>
              <CopyToClipboard text={this.state.invoice.invoice}
                onCopy={() => this.setState({copied: true})}>
                <span>Copy to clipboard</span>
              </CopyToClipboard>
              {this.state.copied ? <div><span style={{color: 'red'}}>Copied.</span></div> : null}
            </div> : <div> </div> }
          </Paper>
      </main>
      <footer align="center">
          <Typography variant="body1"   align="center">
            Get paid to open channels with other nodes
          </Typography> 
      </footer>
    </React.Fragment>
   );
 }
}

ListingForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListingForm);