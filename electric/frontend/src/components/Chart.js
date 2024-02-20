import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getMonth } from './utils';
import { BASE_URL } from './api';
import { Grid, Button } from '@material-ui/core';
import { Link } from "react-router-dom";

const Chart = () => {
    const [pendingSeries, setPendingSeries] = useState([]);
    const [approvedSeries, setApprovedSeries] = useState([]);
    const [releasedSeries, setReleasedSeries] = useState([]);
    const [rejectedSeries, setRejectedSeries] = useState([]);
    const [graph, setGraph] = useState("line");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/filter-connections`, {
                method: "GET"
            });
            if (response.ok) {
                const responseData = await response.json();

                let pending = Array(12).fill(0);
                let approved = Array(12).fill(0);
                let released = Array(12).fill(0);
                let rejected = Array(12).fill(0);

                responseData.forEach(connection => {
                    const monthIndex = getMonth(connection['Date_of_Application']);

                    switch (connection['Status']) {
                        case "Pending":
                            pending[monthIndex]++;
                            break;
                        case "Approved":
                            approved[monthIndex]++;
                            break;
                        case "Connection Released":
                            released[monthIndex]++;
                            break;
                        case "Rejected":
                            rejected[monthIndex]++;
                            break;
                        default:
                            console.log("No statuses found");
                    }
                });

                setPendingSeries(pending);
                setApprovedSeries(approved);
                setReleasedSeries(released);
                setRejectedSeries(rejected);
            } else {
                console.error("Failed to fetch data:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    function toggleGraph() {

        const graphTypes = [
            "line",
            "spline",
            "area",
            "areaspline",
            "column",
            "bar",
            "pie",
            "scatter"
        ];
        const currentIndex = graphTypes.indexOf(graph);
        const nextIndex = (currentIndex + 1) % graphTypes.length;
        setGraph(graphTypes[nextIndex]);
    }

    const options = {
        chart: {
            type: graph
        },
        title: {
            text: 'Connection Requests'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Count'
            }
        },
        series: [{
            name: 'Pending',
            data: pendingSeries
        }, {
            name: 'Approved',
            data: approvedSeries
        }, {
            name: 'Connection Released',
            data: releasedSeries
        }, {
            name: 'Rejected',
            data: rejectedSeries
        }]
    };

    return (
        <Grid container direction="column" alignItems="center">
            <div style={{ width: '100%' }}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
            <Grid item>
                <Button variant="contained" color="primary" onClick={() => toggleGraph()}>
                    Toggle Graph
                </Button>
                <Button variant="contained" color="default" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
};

export default Chart;
