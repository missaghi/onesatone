import React from "react";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Offers from "./offers";

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
    this.state = {  } 

  }  

  change = (name, e) => { 
    e.persist();  
    this.props.handleChange(e);
    this.props.setFieldTouched(name, true, false);
  };
 

  render() {
    const { classes } = this.props;
    const  { values : { nodeID, email, offers },
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
       id="nodeID"
       name="nodeID"
          variant="outlined"
       label="Enter your Node ID" 
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
       disabled={!isValid}
     >
       Create Invoice to List your Node
     </Button>
   </form>
);
}
}

Form.propTypes = {
classes: PropTypes.object.isRequired,
};

 
export default withStyles(styles)(Form);