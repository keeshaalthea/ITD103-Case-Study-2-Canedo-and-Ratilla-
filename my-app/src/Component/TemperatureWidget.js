import React, { useState, useEffect } from "react";
import axios from "axios";

function TemperatureWidget() {
    const [currentTemperature, setCurrentTemperature] = useState(null);

    useEffect(() => {
        // Fetch the current temperature from the database or any other source
        fetchCurrentTemperature();
    }, []);

    const fetchCurrentTemperature = () => {
        // Assuming you have an endpoint to fetch the current temperature
        axios.get("http://localhost:3000/latest-temperature")
            .then(response => {
                setCurrentTemperature(response.data.temperature);
            })
            .catch(error => {
                console.error("Error fetching current temperature:", error);
            });
    };

    return (
        <div className="appointment-widget">
            <div className="card">
                <div className="card-body">
                    <div className="card-content">
                        <h5 className="card-title">Current Temperature</h5>
                        <p className="card-text"><b>{currentTemperature} °C</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemperatureWidget;
