import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
  
    handleClose = () => {
      this.props.close();
    };
  
    render() {
      return (
        <div> 
          <Dialog
            open={this.props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Satoshis Received!"}</DialogTitle>
            <DialogContent>
            <center><img src="logo.png" width="150px"></img></center>
              <DialogContentText id="alert-dialog-description">
               <p>Alright! We've reached out to the seller.</p>
               <p> Keep an eye out for an email from the seller with an invoice for the channel fee, then you will get some of that sweet inbound liquidity.</p>
              </DialogContentText>

              <center><Button onClick={this.handleClose} color="primary">
                <a  target="_blank" href="https://twitter.com/intent/tweet?text=I just bought some inbound liquidity for my lighning node using www.GlowSAT.com">Tweet it posthaste</a>
              </Button> </center>

            </DialogContent> 
          </Dialog>
        </div>
      );
    }
  }
  
  export default AlertDialog;