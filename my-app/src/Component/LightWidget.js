import React, { useState, useEffect } from "react";
import axios from "axios";

function LightWidget() {
    const [currentLight, setCurrentLight] = useState(null);

    useEffect(() => {
        // Fetch the current temperature from the database or any other source
        fetchCurrentLight();
    }, []);

    const fetchCurrentLight = () => {
        // Assuming you have an endpoint to fetch the current temperature
        axios.get("http://localhost:3000/latest-light-intensity")
            .then(response => {
                setCurrentLight(response.data.lightIntensity);
            })
            .catch(error => {
                console.error("Error fetching current light intensity:", error);
            });
    };

    return (
        <div className="appointment-widget">
            <div className="card">
                <div className="card-body">
                    <div className="card-content">
                        <h5 className="card-title">Current Light Intensity</h5>
                        <p className="card-text"><b>{currentLight}</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LightWidget;
