import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import { Formik } from "formik";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as Yup from "yup";
import socket from "../socket" 

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import classNames from 'classnames';
import { Z_BLOCK } from "zlib";

const styles = theme => ({
  
  grid : { marginTop:10},
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  panelContents : {
    textAlign:'left',
    fontSize: theme.typography.pxToRem(12),
    color:'#666'
  },
  attribute : {
    fontSize: theme.typography.pxToRem(20),
    marginBottom:'10px'
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
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  },
  h1: { textAlign: "center", marginLeft: "auto", marginRight: "auto" },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  lineitem: {
    width:'100%', 
    mllink : {margin:10, align:'left'} 
  }
});

const validationSchema = Yup.object({
  nodeID: Yup.string("Enter a node").required("Node is required"),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  offers: Yup.array()
    .max(3, "Only 3 offers at once")
    .required("One offer required")
});

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: { invoice: "", img: "" },
      paid: false,
      copied: false,
      expanded: false,
      nodes : []
    };

  } 

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,

    });
  };

  componentDidMount() { 

    socket.emit("/api/browse", {}, (nodes) => {
      if (nodes.error) {
        console.log(nodes.error);
      }
      else{
        console.log(nodes);
        this.setState({
          nodes: nodes
        });
      }
    }) 


  }

render() {
  const { classes } = this.props;
  const { expanded } = this.state; 

    return (
        <React.Fragment>
          <CssBaseline />
          <main> 
            <h2>Browse channel offers</h2>
{this.state.nodes.length == 0 ? <div>Loading...</div> : 
            <div className={classes.root}>
            {this.state.nodes.map((node,idx) => (
              <ExpansionPanel key={idx} expanded={expanded === 'node' + idx} onChange={this.handleChange('node'+ idx)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{node.alias}</Typography>
                  {/*<Typography className={classes.secondaryHeading}>{node.fee}</Typography>*/}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className={classes.panelContents}> 

                  {"Name"}
                  <Typography  align="left"  className={classes.attribute}>
                    {node.alias}
                  </Typography>

                  
                  {"Node Address"}
                  <Typography  align="left"  className={classes.attribute}>
                    {node.nodeID}
                  </Typography>
                  
                  {"More node data"}
                  <Typography  align="left"  className={classes.attribute}>
                    <a target="_blank" href={ 'https://1ml.com/node/' + node.nodeID }>View on 1ml</a>
                  </Typography>
                   
                  {"Offers"}
                  
                  <Grid container spacing={40} className={classes.grid}>
             
                  {node.offers.map((card,cardIdx) => (
                    <Grid item key={idx + 'card' + cardIdx}>
                  <Card className={classes.card}>
                    <CardContent> 
                      <Typography variant="h5" component="h2">
                        {card.size}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Fee: {card.fee} 
                      </Typography> 
                    </CardContent>
                    <CardActions>
                      <Button size="small"  variant="contained" color="primary" fullWidth onClick={() => {alert("Buying is not developed yet, come back soon!")}} >Buy</Button>
                    </CardActions>
                  </Card>
                  </Grid>
                  ))}
                  </Grid> 
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel> 
              ))}
            </div>
}
          </main>
        </React.Fragment>
    );
  }
}

Browse.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Browse);