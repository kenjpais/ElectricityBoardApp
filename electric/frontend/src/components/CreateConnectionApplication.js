import React, { useState } from 'react';
import { Grid, Collapse, Paper, TextField, Button, Typography, makeStyles } from '@material-ui/core';
import { Redirect, Link } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import { BASE_URL } from './api.js';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3),
    },
}));

const CreateConnectionApplication = ({ applicationData }) => {
    const classes = useStyles();
    const [loadApplied, setLoadApplied] = useState(applicationData.Load_Applied ? applicationData.Load_Applied : 0);
    const [ownership, setOwnership] = useState(applicationData.Ownership ? applicationData.Ownership : '');
    const [category, setCategory] = useState(applicationData.category ? applicationData.category : '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleLoadAppliedChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) && value <= 200) {
            setLoadApplied(value);
            setError('');
        } else {
            setError('Load applied should not exceed 200 KV');
        }
    };

    if (redirect) {
        return <Redirect to="/manage-connections" />;
    }

    const handleOwnershipChange = (event) => {
        const value = event.target.value;
        if (value.trim() !== '') {
            setOwnership(value);
            setError('');
        } else {
            setError('Ownership not set');
        }
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        if (value.trim() !== '') {
            setCategory(value);
            setError('');
        } else {
            setError('Category not set');
        }
    };


    const createConnection = async () => {
        const updatedConnection = {
            ...applicationData,
            Ownership: ownership,
            Category: category,
            Load_Applied: loadApplied
        };

        try {
            const response = await fetch(`${BASE_URL}/api/create-connection`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedConnection)
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Connection created successfully');
            } else {
                setError(`Failed to create connection: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            setError(`Error creating connection: ${error.message}`);
        }

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createConnection();
    };

    const back = () => {
        setRedirect(true)
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
                    <Typography variant="h5" gutterBottom>Create Connection Application</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Applicant ID"
                                    defaultValue={applicationData.ID_Number}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Applicant Name"
                                    defaultValue={applicationData.Applicant_Name}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Gender"
                                    defaultValue={applicationData.Gender}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="District"
                                    defaultValue={applicationData.District}
                                    InputProps={{ readOnly: false }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="State"
                                    defaultValue={applicationData.State}
                                    InputProps={{ readOnly: false }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Pincode"
                                    defaultValue={applicationData.Pincode}
                                    InputProps={{ readOnly: false }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Ownership"
                                    defaultValue={applicationData.Ownership}
                                    InputProps={{ readOnly: false }}
                                    onChange={handleOwnershipChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Govt ID Type"
                                    defaultValue={applicationData.GovtID_Type}
                                    InputProps={{ readOnly: false }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Category"
                                    defaultValue={applicationData.Category}
                                    InputProps={{ readOnly: false }}
                                    onChange={handleCategoryChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Load Applied (KV)"
                                    value={loadApplied}
                                    onChange={handleLoadAppliedChange}
                                    error={!!error}
                                    helperText={error}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="secondary" onClick={back} component={Link} fullWidth>
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

export default CreateConnectionApplication;
