import React from 'react';
import { Typography, Button, Box } from '@material-ui/core';

const Info = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="#f2f2f2"
        >
            <Box
                width="80%"
                maxWidth="800px"
                p={4}
                borderRadius="10px"
                bgcolor="#ffffff"
                boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
            >
                <Typography variant="h4" gutterBottom align="center">
                    About: Bolt
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Addressing the Challenge: Empowering Staff with Digital Solutions
                </Typography>
                <Typography variant="body1" paragraph>
                    A web application to empower its workforce with streamlined access to connection management tools. The goal is to enhance operational efficiency, optimize service delivery, and maintain a competitive edge in the dynamic energy sector landscape.
                </Typography>
                <Typography variant="body1" paragraph>
                    The proposed solution entails the development of a robust Multi-Page User Interface equipped with advanced functionalities to oversee and manage electricity connection requests effectively. From tracking application statuses to facilitating seamless edits, the application aims to revolutionize the way our client interacts with its customers and internal processes.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Key Objectives: Empowering Every Interaction
                </Typography>
                <Typography variant="body1" paragraph>
                    1. Display Connection Records: Provide a user-friendly interface to view connection records in a grid or tabular format, ensuring easy access to critical information.
                </Typography>
                <Typography variant="body1" paragraph>
                    2. Streamlined Search Functionality: Implement a robust search feature enabling staff to swiftly locate connection details using Applicant ID, simplifying the retrieval process.
                </Typography>
                <Typography variant="body1" paragraph>
                    3. Enhanced Filtering Capabilities: Integrate a date picker component to facilitate seamless filtering based on the date range of application submission, optimizing data retrieval and analysis.
                </Typography>
                <Typography variant="body1" paragraph>
                    4. Seamless Editing Experience: Offer a comprehensive solution for viewing and editing electricity connection application requests, ensuring accuracy and responsiveness in all interactions.
                </Typography>
                <Typography variant="body1" paragraph>
                    5. Data Validation: Implement robust data validation measures to safeguard critical information, ensuring compliance with regulatory standards and industry best practices.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Data Visualization: Insights for Informed Decision-Making
                </Typography>
                <Typography variant="body1" paragraph>
                    Visual Representation: Create compelling visualization graphs such as bar or line charts to depict the number of connection requests received each month. Users will have the flexibility to filter data based on the status of requests, empowering informed decision-making and strategic planning.
                </Typography>
                <Box mt={3} textAlign="center">
                    <Button variant="contained" color="primary" href="/">
                        Back
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Info;
