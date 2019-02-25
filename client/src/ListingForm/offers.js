import React from "react";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Formik } from "formik"; 
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Clear';

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
  {label:"10,000", value:"10000"},
  {label:"100,000", value:"100000"},
  {label:"500,000", value:"500000"},
  {label:"1,000,000", value:"1000000"},
  {label:"3,000,000", value:"3000000"},
]

class Offers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  offers : [{ size: 100000, fee: 10000 }, { size: 10000, fee: 1000}, ]};
  } 

  handleRemoveOffer = idx => event => { 
    this.setState({  offers : this.state.offers.filter((s,sidx) => idx !== sidx) });
  } 

  handleAddOffer = event => {
    this.setState({  offers : this.state.offers.concat({size:100000,fee:10000}) });
  } 

  handleChange = (idx,name) => event => {
    //this.props.handleChange(event); 
    
    this.setState({  
      offers : this.state.offers.map((s,sidx) => {
        if (idx==sidx) {s[name] = event.target.value} return s 
      }) 
    });
  }

  renderCard(offer, idx, classes) {   
    return(
    <Card className={classes.card} variant="outlined" key={idx}>
    <CardContent> 
    <Typography component="h2" variant="h5" align="left" className={classes.inputs}>
      Channel Offer {idx + 1}</Typography>
    <TextField 
      id="size"
      select
      variant="outlined"
      label="Channel Size"
      className={classes.inputs}
      fullWidth
      value={offer.size}
      onChange={this.handleChange(idx, 'size')}
      SelectProps={{
        MenuProps: {
          className: classes.menu,
        },
      }}  
    >
      {channelsizes.map(option => (
        <MenuItem key={option.value} value={option.value}> 
          {option.label}
        </MenuItem>
      ))}
    </TextField>
    
    <TextField
      id="fee"  className={classes.inputs}
      name="fee"
      label="Your Fee"
      helperText="Suggested 10% of the Size"
      variant="outlined"
      fullWidth
      InputProps={{
            startAdornment: <InputAdornment position="start">SAT</InputAdornment>,
          }}
    /> 
  </CardContent>
  <CardActions>
    <Button size="small" onClick={this.handleRemoveOffer(idx)} align="right">Remove Offer <MinusIcon /></Button>
  </CardActions>
</Card> 
  )};

  render() {
    const { classes } = this.props;  
    return (
        <React.Fragment>
          {
              this.state.offers.map((offer,idx) => (this.renderCard(offer,idx,classes)) )
          }

          <div  align="right">
            <Button variant="outlined"  onClick={this.handleAddOffer}    aria-label="Add" className={classes.fab}>
              Add Offer <AddIcon />
            </Button>
          </div>
        </React.Fragment>
);
}
}
 

 
export default withStyles(styles)(Offers);