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
  state = {  
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
   <form onSubmit={() => {}}>
     <TextField  className={classes.inputs}
       id="nodeID"
       name="nodeID"
          variant="outlined"
       label="nodeID" 
       fullWidth
       helperText="just the ID before the @ sign, no IP or port"
     />
     <TextField  className={classes.inputs}
       id="email"
       name="email"
          variant="outlined"
       label="Email"
       helperText="Get an email when you recieve an order"
       fullWidth
     />

    <Typography component="h2" variant="h6" align="left">
    Add the channels you are willing to open</Typography>

     <Offers /> 

     <Button
       type="submit"
       fullWidth
       variant="contained"
       color="primary"
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