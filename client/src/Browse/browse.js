import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import { Z_BLOCK } from "zlib";

import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";

import Buy from "./buy";
import socket from "../socket"

const styles = theme => ({

  grid: { marginTop: 10 },
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
  panelContents: {
    textAlign: 'left',
    fontSize: theme.typography.pxToRem(12),
    color: '#666'
  },
  attribute: {
    fontSize: theme.typography.pxToRem(20),
    marginBottom: '10px'
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
  }, cardGrid: {
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
    width: '100%',
    mllink: { margin: 10, align: 'left' }
  }
});

const validationSchema = Yup.object({
  nodeID: Yup.string("Enter a node").required("Node is required"),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required")
});

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open :false,
      listingid :0,
      invoice: { invoice: "", img: "" },
      paid: false,
      copied: false, 
      expanded: false,
      nodes: []
    };

  }

  handleSubmit = vals => {
  vals.listingid = this.state.listingid;
   console.log(vals);
    socket.emit("/api/buy", vals, (invoice) => {
      if (invoice.error) {
        console.log(invoice.error);
      }
      else {
        console.log(invoice);
        this.setState({
          invoice: { invoice: invoice.payment_request, img: invoice.img }
        });
      }
    })

  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  openBuyDialog = listingid => () => {
    this.setState({open:true, listingid : listingid})
  } 

  closeBuyDialog = (vals) => { 
    this.setState({open:false, listingid : 0})
  }

  componentDidMount() {
    socket.emit("/api/browse", {}, (nodes) => {
      if (nodes.error) {
        console.log(nodes.error);
      }
      else {
        console.log(nodes);
        this.setState({
          nodes: nodes
        });
      }
    })
  }

  render() {
    const { classes } = this.props;
    const values = {
      node: "",
      email: "", 
    };
    const { expanded } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <main>

          <Formik
            render={props => <Buy {...props} invoice={this.state.invoice} open={this.state.open} handleClose={this.closeBuyDialog}  />}
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              this.handleSubmit(values);
              actions.setSubmitting(false);
            }}
          />

          <h2>Browse channel offers</h2>
          {this.state.nodes.length == 0 ? <div>Loading...</div> :
            <div className={classes.root}>
              {this.state.nodes.map((node, idx) => (
                <ExpansionPanel key={idx} expanded={expanded === 'node' + idx} onChange={this.handleChange('node' + idx)}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                 
                    
                    
                    { moment.duration(moment(node.paid).diff(moment())).as('Hours') < 24 ? 
                    <Badge className={classes.margin} badgeContent="New" color=""><Typography className={classes.heading}>{node.alias}</Typography> </Badge> : 
                    <Typography className={classes.heading}>{node.alias}</Typography>  }

                    { (node.chanopenpending) == true ? <Chip label="Pending" color="secondary" className={classes.chip} /> : "" }

                   {/*} <Badge className={classes.margin} badgeContent={0} color="primary">
                      <VerifiedUserIcon />
                    </Badge> */}
                     
                    <Typography align="right" className={classes.heading}>{node.chansize} {node.fee}</Typography> 
                    
                    
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div className={classes.panelContents}>

                      {"Name"}
                      <Typography align="left" className={classes.attribute}>
                        {node.alias}
                      </Typography>


                      {"Node Address"}
                      <Typography align="left" className={classes.attribute}>
                        {node.node}
                      </Typography>

                      {"More node data"}
                      <Typography align="left" className={classes.attribute}>
                        <a target="_blank" href={'https://1ml.com/node/' + node.nodeID}>View on 1ml</a>
                      </Typography>

                      {"Channel Size"}
                      <Typography align="left" className={classes.attribute}>
                        {node.size}
                      </Typography>

                      {"Open Fee (site fee + channel fee)"}
                      <Typography align="left" className={classes.attribute}>
                        {10000 + Number(node.fee)}
                      </Typography>

                      <Button size="small" variant="contained" color="primary" fullWidth onClick={this.openBuyDialog(idx)} >Buy</Button>

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
