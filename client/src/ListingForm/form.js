import React from "react";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import socket from "../socket";

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

const channelsizes = [
  {label:"Select Channel Size"},
  {label:"50,000", value:"50000"},
  {label:"100,000", value:"100000"},
  {label:"500,000", value:"500000"},
  {label:"1,000,000", value:"1000000"},
  {label:"2,000,000", value:"2000000"},
  {label:"3,000,000", value:"3000000"},
  {label:"4,000,000", value:"4000000"},
]

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
    console.log(e);
    this.props.handleChange(e);
    this.props.setFieldTouched(name, true, false);
  };
 

  render() {
    const { classes } = this.props;
    const  { values : { alias, node, email, chansize, fee },
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
       id="node"
       name="node"
          variant="outlined"
       label="Enter your Node Address (pubkey, no IP or Port)" 
       fullWidth
       helperText={touched.node ? errors.node : "Node Address"}
       error={touched.node && Boolean(errors.node)}
       value={node}
       onChange={this.change.bind(null, "node")}
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

<TextField 
      id="chansize"
      select
      variant="outlined"
      label="Channel Size"
      className={classes.inputs}
      fullWidth
      value={chansize}
      onChange={this.change.bind(null, "chansize")} 
      InputProps={{
            startAdornment: <InputAdornment position="start">SAT</InputAdornment>,
          }}
      SelectProps={{
        native: true,
        MenuProps: {
          className: classes.menu,
        },
      }}  
    >
      {channelsizes.map(option => (
        <option  key={option.value} value={option.value}> 
          {option.label}
        </option>
      ))}
      </TextField>
    
    <TextField
      id="fee"  className={classes.inputs}
      name="fee"
      label="Your Fee"
      value={fee}
      onChange={this.change.bind(null, "fee")} 
      helperText="Suggested 10% of the Size"
      variant="outlined"
      fullWidth
      InputProps={{
            startAdornment: <InputAdornment position="start">SAT</InputAdornment>,
          }}
    /> 

     <Button
       type="submit"
       fullWidth
       variant="contained"
       color="primary"
       disabled={!isValid || this.state.button.disabled}
     >
       {this.state.button.msg}
     </Button>
     <p>Listing fee is one channel fee, in case we need to refund a buyer.</p>
   </form>
);
}
}

Form.propTypes = {
classes: PropTypes.object.isRequired,
};

 
export default withStyles(styles)(Form);