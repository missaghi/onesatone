import React from "react";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Offers from "./offers";
import socket from "../socket"

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  }, 
  menu: {
    width: 200,
  }, 
  card: {
    minWidth: 275,
    marginBottom: 15, marginTop:15,
  },
  inputs: {
    marginBottom: 15, marginTop:15,
  },
  fab : { marginBottom:30},
});

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { button: {msg:"Create Invoice to List your Node", disabled:false} }  

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
 

  render() {
    const { classes } = this.props;
    const  { values : { alias, nodeID, email, offers },
            errors,
            touched,
            handleSubmit, 
            isValid,
           } = this.props; 

    return (

   <form onSubmit={(e) => {
     handleSubmit(e);
     e.preventDefault(); 
  }}>
    <TextField  className={classes.inputs}
       id="alias"
       name="alias"
          variant="outlined"
       label="Enter your node alias" 
       fullWidth
       helperText={touched.alias ? errors.alias : "Basically a title for your listing"}
       error={touched.alias && Boolean(errors.alias)}
       value={alias}
       onChange={this.change.bind(null, "alias")}
     />
     <TextField  className={classes.inputs}
       id="nodeID"
       name="nodeID"
          variant="outlined"
       label="Enter your Node Address" 
       fullWidth
       helperText={touched.nodeID ? errors.nodeID : "just the ID before the @ sign, no IP or port"}
       error={touched.nodeID && Boolean(errors.nodeID)}
       value={nodeID}
       onChange={this.change.bind(null, "nodeID")}
     />
     <TextField  className={classes.inputs}
       id="email"
       name="email"
          variant="outlined"
       label="Notification Email"
       helperText={touched.email ? errors.email : "Get an email when you recieve an order"}
       error={touched.email && Boolean(errors.email)}
       fullWidth
       value={email}
       onChange={this.change.bind(null, "email")}
     />

    <Typography component="h2" variant="h6" align="left">
    Add the channels you are willing to open</Typography>

     <Offers {...this.props} offerChange={(arroffers) => {
       var newvalues = this.props.values;
       newvalues.offers = arroffers;
       console.log(arroffers);
       this.props.setValues(newvalues); 
       }} /> 
     <Button
       type="submit"
       fullWidth
       variant="contained"
       color="primary"
       disabled={!isValid || this.state.button.disabled}
     >
       {this.state.button.msg}
     </Button>
     <p>Listing fee is the sum of your channel fees, in case we need to refund a buyer.</p>
   </form>
);
}
}

Form.propTypes = {
classes: PropTypes.object.isRequired,
};

 
export default withStyles(styles)(Form);