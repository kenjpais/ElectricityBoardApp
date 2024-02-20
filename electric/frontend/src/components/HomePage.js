import React from "react";
import { Grid, Button, ButtonGroup, Typography, Zoom } from "@material-ui/core";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import InfoIcon from '@material-ui/icons/Info';
import ConnectionManagement from "./ConnectionManagement";
import Chart from "./Chart.js";
import User from './User.js'
import Info from './Info.js'

const HomePage = () => {
    const renderHomePage = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Zoom in={true} timeout={1000}>
                        <img src={"../../static/images/bolt.png"} />
                    </Zoom>
                    <Typography variant="h6" compact="h6" colour="primary">
                        Connecting you
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/manage-connections" component={Link}>
                            Manage Connections
                        </Button>
                        <Button color="primary" to="/create-user" component={Link}>
                            Create Connection
                        </Button>
                        <Button color="primary" to="/view-chart" component={Link}>
                            View Connections
                        </Button>
                        <Button color="primary" to="/info" component={Link}>
                            Info
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    };

    return (
        <Router>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={renderHomePage}
                />
                <Route path="/manage-connections" component={ConnectionManagement} />
                <Route path="/create-user" component={User} />
                <Route path="/view-chart" component={Chart} />
                <Route path="/info" component={Info} />
            </Switch>
        </Router>
    );
};

export default HomePage;