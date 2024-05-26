import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js library
import HumidityWidget from "./HumidityWidget";
import TemperatureWidget from './TemperatureWidget';
import LightWidget from './LightWidget';

function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order to 'desc' for latest entries first
  const itemsPerPage = 20;

  useEffect(() => {
    // Fetch data from backend APIs
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3000/data') // Assuming your backend is running on port 3000
      .then(response => {
        const sortedData = sortData(response.data, 'desc');
        setSensorData(sortedData);
        renderChart(sortedData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };

  const sortData = (data, order) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
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

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedData = sortData(sensorData, newOrder);
    setSensorData(sortedData);
    setSortOrder(newOrder);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sensorData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sensorData.length / itemsPerPage);

  const handlePagination = (direction) => {
    if (direction === 'left' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'right' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
        <div className="card-container" style={{ marginTop: '80px' }}>
          <div className="card1" style={{ height: '920px', padding: '20px' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr className="justify-content-center">
                  <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                    Timestamp {sortOrder === 'asc' ? '▲' : '▼'}
                  </th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Light Intensity</th>
                </tr>
              </thead>
              <tbody className="justify-content-center">
                {currentItems.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.timestamp}</td>
                    <td>{entry.temperature}</td>
                    <td>{entry.humidity}</td>
                    <td>{entry.lightIntensity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
              <button
                onClick={() => handlePagination('left')}
                className="btn btn-secondary btn-sm mx-1"
                style={{ justifyContent: 'center' }}
              >
                &lt;
              </button>
              <span style={{ color: '#FFFF', margin: '0 10px' }}>Page {currentPage}</span>
              <button
                onClick={() => handlePagination('right')}
                className="btn btn-secondary btn-sm mx-1"
                style={{ justifyContent: 'center' }}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
