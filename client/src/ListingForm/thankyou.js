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
            <DialogTitle id="alert-dialog-title">{"Listing Approved!"}</DialogTitle>
            <DialogContent>
            <center><img src="logo.png" width="150px"></img></center>
              <DialogContentText id="alert-dialog-description">
               <p>Alright! Your node is now listed.</p>
               <p> When someone wants to open a channel with you, you'll get an email with their information so that you can send them an invoice for opening a channel.</p>
               <p> When they pay you and you create the channel GlowSAT will detect the channel announcement on the network and unlock your listing for another customer.</p>
              </DialogContentText>

              

            </DialogContent> 
            <DialogActions>
            <Button onClick={this.handleClose} color="primary" variant="outlined">
                <a target="_blank" href="https://twitter.com/intent/tweet?text=I just listed an offer to sell liquidity using www.GlowSAT.com">Let Bitcoin Twitter know</a>
              </Button>
               <Button onClick={this.handleClose} color="primary" variant="outlined">
                <a href="#/browse">Browse all listings</a>
              </Button> 
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }
  
  export default AlertDialog;