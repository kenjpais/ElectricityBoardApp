import React, { useState } from 'react';
import { Grid, Collapse, Paper, TextField, Button, Typography, makeStyles } from '@material-ui/core';
import { Link } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import { BASE_URL } from './api';
import CreateConnectionApplication from './CreateConnectionApplication';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3),
    },
}));

const User = () => {
    const classes = useStyles();
    const [applicantName, setApplicantName] = useState('');
    const [gender, setGender] = useState('');
    const [govtIdType, setGovtIdType] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [userCreated, setUserCreated] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        id: 0,
        Applicant_Name: '',
        Gender: '',
        GovtID_Type: '',
        District: '',
        State: '',
        Pincode: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newUser = {
            Applicant_Name: applicantName,
            Gender: gender,
            GovtID_Type: govtIdType,
            District: district,
            State: state,
            Pincode: pincode,
        };
        try {
            const response = await fetch(`${BASE_URL}/api/create-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
            if (!response.ok) {
                throw new Error('User could not be created');
            }
            const data = await response.json();
            setUser({ ...newUser, id: data.id });
            setUserCreated(true);
            setSuccess(`User Created: ${data.id}`);
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Error creating user');
        }
    };

    if (userCreated) {
        const connectionData = {
            Applicant_Name: user.Applicant_Name,
            Gender: user.Gender,
            District: user.District,
            State: user.State,
            Pincode: user.Pincode,
            GovtID_Type: user.GovtID_Type,
            ID_Number: user.id,
        };
        return <CreateConnectionApplication applicationData={connectionData} />
    }

    return (
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
                    <Typography variant="h5" gutterBottom>Create User</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Applicant Name"
                                    value={applicantName}
                                    onChange={(e) => setApplicantName(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Govt ID Type"
                                    value={govtIdType}
                                    onChange={(e) => setGovtIdType(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="District"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Pincode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Create User
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" to="/" color="secondary" component={Link} fullWidth>
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default User;
