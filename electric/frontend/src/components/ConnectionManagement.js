import React, { useState, useEffect } from 'react';
import {
    Paper, Card, CardContent, Button, Grid, TextField,
    Typography, Modal, Drawer, List, ListItem, ListItemText,
    Collapse, Zoom, makeStyles, MenuItem, Select, FormControl, InputLabel
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link, Route } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import BarChartIcon from '@material-ui/icons/BarChart';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import EditConnectionApplication from './EditConnectionApplication';
import User from './User';
import { BASE_URL } from "./api";
import { getCurrentDate } from './utils';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3),
    },
}));

const ConnectionManagement = () => {
    const classes = useStyles();
    const [applicantId, setApplicantId] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReviewerModal, setShowReviewerModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [id, setId] = useState("");               //Reviewer_ID
    const [name, setName] = useState("");          //Reviewer_Name
    const [comments, setComments] = useState(""); //Reviewer_Comments

    useEffect(() => {
        filterData();
    }, []);

    const filterData = async () => {
        try {
            let response = null;
            if (applicantId && startDate && endDate) {
                response = await fetch(`${BASE_URL}/api/filter-connections?applicantId=${applicantId}&startDate=${startDate}&endDate=${endDate}`, {
                    method: "GET"
                });
            } else if (applicantId && startDate) {
                response = await fetch(`${BASE_URL}/api/filter-connections?applicantId=${applicantId}&startDate=${startDate}`, {
                    method: "GET"
                });
            } else if (applicantId) {
                response = await fetch(`${BASE_URL}/api/filter-connections?applicantId=${applicantId}`, {
                    method: "GET"
                });
            } else {
                response = await fetch(`${BASE_URL}/api/filter-connections?`, {
                    method: "GET"
                });
            }
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
                console.log(responseData);
            } else {
                console.error("Failed to fetch data:", response.statusText);
                setError("Failed to fetch data:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    };

    const editConnection = (row) => {
        console.log(`Editing connection with ID: ${row.ID}`);
        setSelectedRow(row);
        setShowEditModal(true);
    };

    const handleReviewSubmit = () => {
        setShowReviewerModal(false);
        validateConnection();
    }

    const exitReview = () => {
        setShowReviewerModal(false);
    }

    const validateConnection = async () => {
        const status = selectedRow.Status;
        const action = status === 'Approved' ? 'Approving' : status === 'Rejected' ? 'Rejecting' : 'Releasing';
        const actionDone = status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'Rejected' : 'Released';

        if (status === 'Approved') {
            selectedRow['Date_of_Approval'] = getCurrentDate('-');
        }

        selectedRow.Reviewer_ID = id;
        selectedRow.Reviewer_Name = name;
        selectedRow.Reviewer_Comments = comments;
        selectedRow.Modified_Date = getCurrentDate('-');
        selectedRow.Status = status === "Release" ? "Connection Released" : status;

        console.log(`${action} connection with ID: ${selectedRow.ID}`);
        console.log("Updated Connection:", selectedRow);

        try {
            const response = await fetch(`${BASE_URL}/api/connection/${selectedRow.ID}/`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedRow)
            });
            const res = await response.json();
            if (response.ok) {
                setSuccess(`Connection:${res['ID']} ${actionDone} successfully`);
                //setData(data.filter(item => item.ID !== res['ID']));  
            } else {
                setError(`Error ${action} connection: ${JSON.stringify(res)}`);
            }
        } catch (error) {
            setError(`Error ${action} connection: ${error.message}`);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handleCloseReviewerModal = () => {
        setShowReviewerModal(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const setAdminPrivilege = () => {
        setAdmin(!admin);
        toggleSidebar();
    };

    const toggleStatus = (row) => {
        console.log(`Validating connection with ID: ${row.ID}`);
        setSelectedRow(row);
        setShowReviewerModal(true);
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'green';
            case 'Rejected':
                return 'red';
            case 'Connection Released':
                return 'blue';
            case 'Pending':
                return '#FFBF00';     //Amber
            default:
                return 'blue';
        }
    };

    return (
        <Grid container spacing={3} justifyContent="center" >
            <Grid item xs={12} align="center">
                <Grid item xs={12} align="center">
                    <Zoom in={true} timeout={1000}>
                        <img src={"../../static/images/logo.png"} style={{ maxWidth: '80px' }} />
                    </Zoom>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AccountCircleIcon onClick={toggleSidebar} color="primary" style={{ fontSize: 60 }} />
                <Drawer open={sidebarOpen} onClose={toggleSidebar} color="default">
                    <List>
                        <ListItem button onClick={setAdminPrivilege}>
                            <SupervisorAccountIcon />;<ListItemText primary="Admin" colour="primary" />
                        </ListItem>
                        <ListItem button onClick={toggleSidebar} to="/view-chart" component={Link}>
                            <BarChartIcon /><ListItemText primary="Graph" colour="primary" />
                        </ListItem>
                    </List>
                </Drawer>
                <Typography variant="h5" align="center" component="h2">
                    Manage Connections
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Collapse in={error !== "" || success !== ""}>
                    <Alert severity={error !== "" ? "error" : "success"} onClose={() => { setError(""); setSuccess(""); }}>
                        {error !== "" ? error : success}
                    </Alert>
                </Collapse>
            </Grid>
            <Grid item xs={12} >
                <Grid container justifyContent="center" spacing={3}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Search by Applicant ID"
                            fullWidth
                            value={applicantId}
                            onChange={(e) => setApplicantId(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Start Date"
                            type="date"
                            fullWidth
                            value={startDate ? startDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            value={endDate ? endDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} justifyContent="center">
                    <Button variant="contained" color="primary" onClick={filterData}>
                        Apply Filters
                    </Button>
                    <Button variant="contained" color="default" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <div style={{ overflow: 'auto', maxHeight: '1150px' }}>
                    <Grid container spacing={3}>
                        {data.map((row, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {row.Applicant_Name}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            ID: {row.ID}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Gender: {row.Gender}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            District: {row.District}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            State: {row.State}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Pincode: {row.Pincode}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Ownership: {row.Ownership}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Govt ID Type: {row.GovtID_Type}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            ID Number: {row.ID_Number}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Category: {row.Category}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Load Applied (KV): {row.Load_Applied}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Date of Application: {row.Date_of_Application}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Date of Approval: {row.Date_of_Approval}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Modified Date: {row.Modified_Date}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Reviewer ID: {row.Reviewer_ID}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Reviewer Name: {row.Reviewer_Name}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Reviewer Comments: {row.Reviewer_Comments}
                                        </Typography>

                                        {admin ? (
                                            <>
                                                <FormControl fullWidth>
                                                    <InputLabel><span style={{ color: getStatusColor(row.Status) }}>{row.Status}</span></InputLabel>
                                                    <Select
                                                        value={row.Status}
                                                        onChange={(e) => {
                                                            row.Status = e.target.value;
                                                            console.log("Status changed:", row.Status);
                                                            toggleStatus(row);
                                                        }}
                                                    >
                                                        <MenuItem value="Approved" style={{ color: 'green' }}>Approved</MenuItem>
                                                        <MenuItem value="Rejected" style={{ color: 'red' }}>Rejected</MenuItem>
                                                        <MenuItem value="Connection Released" style={{ color: 'blue' }}>Connection Released</MenuItem>
                                                        <MenuItem value="Pending" style={{ color: '#FFBF00' }}>Pending</MenuItem>

                                                    </Select>
                                                </FormControl>
                                            </>
                                        ) : (
                                            <><Typography variant="body2" component="p" style={{ fontWeight: 'bold' }}>
                                                Status: <span style={{ color: getStatusColor(row.Status) }}>{row.Status}</span>
                                            </Typography><Button variant="contained" color="primary" onClick={() => editConnection(row)}>
                                                    Edit
                                                </Button></>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid >
            <Modal open={showEditModal} onClose={handleCloseModal}>
                <div>
                    <EditConnectionApplication applicationData={selectedRow} />
                </div>
            </Modal>
            <Modal open={showReviewerModal} onClose={handleCloseReviewerModal}>
                <Grid container alignItems="center" justifyContent="center" spacing={3}>
                    <Grid item xs={12} align="center">
                        <Collapse in={error !== "" || success !== ""}>
                            <Alert severity={error !== "" ? "error" : "success"} onClose={() => { setError(""); setSuccess(""); }}>
                                {error !== "" ? error : success}
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} md={8} lg={6}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" gutterBottom>
                                Reviewer Information
                            </Typography>
                            <form onSubmit={handleReviewSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Reviewer ID"
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Reviewer Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Reviewer Comments"
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                        <Button variant="contained" onClick={exitReview} color="secondary">
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Modal>
            <Route path="/create-user" component={User} />
        </Grid >
    );
};

export default ConnectionManagement;
