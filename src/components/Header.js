import React from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  grow: {
    flexGrow: 1
  }
});

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          Ranjani's react eogresources dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default Header;