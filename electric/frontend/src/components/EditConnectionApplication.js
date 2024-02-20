import React, { useState } from 'react';
import { Collapse, Grid, Paper, TextField, Button, Typography, makeStyles, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Redirect } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { BASE_URL } from './api.js';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3),
    },
}));

const EditConnectionApplication = ({ applicationData }) => {
    const classes = useStyles();
    const [loadApplied, setLoadApplied] = useState(applicationData.Load_Applied ? applicationData.Load_Applied : 0);
    const [ownership, setOwnership] = useState(applicationData.Ownership ? applicationData.Ownership : '');
    const [category, setCategory] = useState(applicationData.category ? applicationData.category : '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDone, setEditDone] = useState(false);
    const action = "Edit";
    const actionDone = "Edited";

    const handleLoadAppliedChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) && value <= 200) {
            setLoadApplied(value);
            setError('');
        } else {
            setError('Load applied should not exceed 200 KV');
        }
    };

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

    if (editDone) {
        return <Redirect to="/manage-connections" />;
    }

    const editConnection = async () => {
        const updatedConnection = {
            ...applicationData,
            Ownership: ownership ? ownership : applicationData.Ownership,
            Category: category ? category : applicationData.category,
            Load_Applied: loadApplied ? loadApplied : applicationData.loadApplied
        };

        try {
            const response = await fetch(`${BASE_URL}/api/connection/${updatedConnection.ID}/`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedConnection)
            });
            const res = await response.json();
            if (response.ok) {
                setSuccess(`Connection:${res['ID']} ${actionDone} successfully`);
            } else {
                setError(`Error ${action} connection:${res['ID']}: ${JSON.stringify(res)}`);
            }
        } catch (error) {
            setError(`Error ${action} connection: ${error.message}`);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        editConnection();
    };

    const handleCloseModal = () => {
        setEditDone(true);
    };

    const back = () => {
        setEditDone(true);
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
                    <Typography variant="h5" gutterBottom>Edit Connection Application</Typography>
                    <IconButton onClick={handleCloseModal} style={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
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
                                    label="Govt ID Type"
                                    defaultValue={applicationData.GovtID_Type}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Applicant Name"
                                    defaultValue={applicationData.Applicant_Name}
                                    InputProps={{ readOnly: false }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Gender"
                                    defaultValue={applicationData.Gender}
                                    InputProps={{ readOnly: false }}
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
                                <Button variant="contained" color="secondary" onClick={back} fullWidth>
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

export default EditConnectionApplication;
