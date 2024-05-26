import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js library
import HumidityWidget from "./HumidityWidget";
import TemperatureWidget from './TemperatureWidget';
import LightWidget from './LightWidget';

function Dashboard() {
    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
      // Fetch data from backend APIs
      fetchData();
    }, []);
  
    const fetchData = () => {
      axios.get('http://localhost:3000/data') // Assuming your backend is running on port 3000
        .then(response => {
          setSensorData(response.data);
          renderChart(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    };

    const renderChart = (data) => {
        const labels = data.map(entry => entry.timestamp); // Use timestamp as labels
        const temperatureData = data.map(entry => entry.temperature);
        const humidityData = data.map(entry => entry.humidity);
        const lightIntensityData = data.map(entry => entry.lightIntensity);
      
        const ctx = document.getElementById('myChart').getContext('2d');
      
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Temperature',
              data: temperatureData,
              borderColor: '#26D4FF',
              tension: 0.1,
              fill: false
            }, {
              label: 'Humidity',
              data: humidityData,
              borderColor: '#CAF7FF',
              tension: 0.1,
              fill: false
            }, {
              label: 'Light Intensity',
              data: lightIntensityData,
              borderColor: '#81F9C0',
              tension: 0.1,
              fill: false
            }]
          },
          options: {
            scales: {
              y: {
                min: 0,
                max: 450,
                ticks: {
                  stepSize: 50
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 16, // Adjust the font size of the legend text
                  }
                }
              }
            }
          }
        });
      };
      

  return (
    <div className="dashboard-container">

      <div className="main-content" style={{ backgroundColor: '#001E2B' }}>
        <div className="typingeffect">
          <h1>
            <span style={{ color: '#13AA52' }}>Environmental Logger:  </span>
            <span style={{ color: '#00ED64' }}>Monitoring Temperature, Humidity, and Light Intensity</span>
            <span className="blinking-cursor">│</span>
          </h1>
        </div>
        <div className="widgets-container">
                        <TemperatureWidget />
                        <HumidityWidget />
                        <LightWidget />
                    </div>

        <div className="chart-container">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
