import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { Formik } from "formik";
import Form from "./form";

import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as Yup from "yup";
import socket from "../socket"

const styles = theme => ({
  appBar: {
    position: "relative"
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
  stepper: {
    padding: `$ {theme.spacing.unit * 3}px 0 $ {theme.spacing.unit * 5}px`
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
  node: Yup.string("Enter a node").required("Node is required"),
  alias: Yup.string("Enter an alias").required("Give your node a name, something unique"),
  fee: Yup.number("Enter a fee").required("Like 10% of the channel?"),
  chansize: Yup.number("Select a channel size").required("However much you want offer"),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required")
});

class ListingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: { invoice: "", img: "" },
      paid: false,
      copied: false,
    };
    socket.on("Paid", data => {
      console.log(data);
      this.setState({ paid: data });
    });
  }

  handleSubmit = vals => { 
   socket.emit("/api/list", vals, (invoice) => {
      if (invoice.error) {
        console.log(invoice.error);
      }
      else{
        console.log(invoice);
        this.setState({
          invoice: { invoice: invoice.payment_request, img: invoice.img }
        });
      }
    }) 
  };

  render() {
    const { classes } = this.props;
    const values = {
      node: "",
      alias: "",
      email: "",
      fee: undefined,
      chansize: undefined,
    };

    return (
      <React.Fragment>
        <CssBaseline />
        
        <h1 className={classes.h1}> List your node </h1>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h5" align="center">
              Get paid to open channels with other nodes
            </Typography>
            <Formik
              render={props => <Form {...props} buttonValue={this.state.buttonValue} />}
              initialValues={values}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                this.handleSubmit(values);
                actions.setSubmitting(false);
              }}
            />
            {this.state.invoice.invoice.length > 0 ? (
              <div>
                <div>
                  <img src={this.state.invoice.img} />
                </div>
                <CopyToClipboard
                  text={this.state.invoice.invoice}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <span> Copy to clipboard </span>
                </CopyToClipboard>
                {this.state.copied ? (
                  <div>
                    <span style={{ color: "red" }}> Copied. </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div> </div>
            )}
          </Paper>
        </main> 
      </React.Fragment>
    );
  }
}

ListingForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListingForm);
