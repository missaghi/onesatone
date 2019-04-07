import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CopyToClipboard  from "react-copy-to-clipboard";
import socket from "../socket"

const styles = theme => ({
  
  inputs: {
    marginBottom: 15, marginTop:15,
  }
  

})

class Buy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      button: { msg: "Create invoice to contact seller", disabled: false },
      paid: false,
      copied: false,
    };

    socket.on("Paid", data => {
      console.log(data);
      this.setState({ paid: data });
    });

    socket.on("update", data => {
      console.log(data);
      this.setState({ button: data });
    });
  }

  change = (name, e) => {
    e.persist();
    this.props.handleChange(e);
    this.props.setFieldTouched(name, true, false);
  };

  handleClose = () => {

    //alert(Object.keys(this.props.touched).length);

    this.props.handleClose();
  }

  render() {

    const { classes } = this.props;
    const { values: { nodeID, email },
      errors,
      touched,
      handleSubmit,
      isValid,
      invoice,
      open
    } = this.props;


    return (
      <form onSubmit={(e) => {
        console.log("form");
        handleSubmit(e);
        e.preventDefault();
      }}>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Buy Offer</DialogTitle>
          <DialogContent>
            <DialogContentText>
            What email should the seller send the channel invoice to?
             
            </DialogContentText>
            <div>
              <TextField
                autoFocus
                className={classes.inputs}
                id="email"
                name="email"
                variant="outlined"
                label="Email Address"
                fullWidth
                helperText={touched.email ? errors.email : "Seller will contact you with invoice for the fee"}
                error={touched.email && Boolean(errors.email)}
                value={email}
                onChange={this.change.bind(null, "email")}
              />

              <TextField
                className={classes.inputs}
                id="nodeID"
                name="nodeID"
                variant="outlined"
                label="Your Node Address"
                fullWidth
                helperText={touched.nodeID ? errors.nodeID : "1234XYZ@192.168.1.123:9735"}
                error={touched.nodeID && Boolean(errors.nodeID)}
                value={nodeID}
                onChange={this.change.bind(null, "nodeID")}
              />
            </div>
            {invoice.invoice.length > 0 ? (
              <div>
                <div>
                  <img src={invoice.img} />
                </div>
                <CopyToClipboard
                  text={invoice.invoice}
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

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} >
              Cancel
            </Button>
            <Button
             onClick={handleSubmit} 
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!isValid || this.state.button.disabled}
            >
              {this.state.button.msg}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    )

  }

}


Buy.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Buy);
