import React, { useState, useEffect } from "react";
import axios from "axios";

function HumidityWidget() {
    const [currentHumidity, setCurrentHumidity] = useState(null);

    useEffect(() => {
        // Fetch the current temperature from the database or any other source
        fetchCurrentHumidity();
    }, []);

    const fetchCurrentHumidity = () => {
        // Assuming you have an endpoint to fetch the current temperature
        axios.get("http://localhost:3000/latest-humidity")
            .then(response => {
                setCurrentHumidity(response.data.humidity);
            })
            .catch(error => {
                console.error("Error fetching current humidity:", error);
            });
    };

    return (
        <div className="appointment-widget">
            <div className="card">
                <div className="card-body">
                    <div className="card-content">
                        <h5 className="card-title">Current Humidity</h5>
                        <p className="card-text"><b>{currentHumidity} %</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HumidityWidget;
