import PropTypes from "prop-types";
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import ListingForm from "./ListingForm/index";
import Home from "./Home/home";
import Browse from "./Browse/browse";
import "typeface-roboto";
import Button from "@material-ui/core/Button";
import socket from "./socket"; 
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { HashRouter  as HashRouter, Route, Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  '@global': {
    body: {
      //backgroundColor: theme.palette.common.white,
    },
  },
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
    textDecoration:"none"
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  },
  footer: {marginTop: theme.spacing.unit * 3,},
  logo: {textDecoration:"none"}
});


class App extends Component {


  state = { invoices: [], snackbarOpen: false, snackbarMsg: "" };

  componentDidMount() {
    socket.on("warning", data => {
      console.log(data);
      this.setState({ snackbarOpen: true, snackbarMsg: data });
    }); 

  }

  snackbarMsg = msg => {
    this.setState({ snackbarOpen: true, snackbarMsg: msg });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ snackbarOpen: false });
  };

  Support = () => {return <div><h2>Support</h2><center>Support email info@glowsat.com</center></div> } 

  render() {
  var { classes } = this.props;

    return (
      <div className="App"> 
       <CssBaseline />
        <HashRouter>
<div>
          <AppBar position="static" color="default" className={classes.appBar}>
            <Toolbar>
              <Typography  variant="h6" align="left" color="inherit"  component={props => <Link  to="/" {...props}/>} noWrap className={classes.toolbarTitle}>
              GlowSAT
          </Typography>
          <nav>
            <Button color="primary" component={props => <Link to="list" {...props}/>}> List </Button>
            <Button color="primary" component={props => <Link to="browse" {...props}/>}> Browse </Button>
            <Button color="primary" component={props => <Link to="support" {...props}/>}> Support </Button>
          </nav>
            </Toolbar>
          </AppBar> 

            <Route path="/" exact component={Home} />
            <Route path="/list" component={ListingForm} />
            <Route path="/browse" component={Browse} />
            <Route path="/support" component={this.Support} />


            
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Disclaimer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          This is a test product, please don't send any large amounts.
        </Typography>
      </footer>
      {/* End footer */}


</div>
        </HashRouter> 

        
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span id="message-id">
              {JSON.stringify(this.state.snackbarMsg)}}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);

