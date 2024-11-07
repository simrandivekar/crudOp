import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlantDataService from "../services/plant.service";

const SearchForm = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    plant: '',
    area: '',
    line: '',
    station: ''
  });

  // State to store dropdown options
  const [plantOptions, setPlantOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);

  // Fetch plant options when component mounts
  useEffect(() => {
    PlantDataService.getDistinctPlants()
      .then((response) => {
        setPlantOptions(response.data);  // Store plant data in state
      })
      .catch((error) => {
        console.error("There was an error fetching the plant data!", error);
      });
  }, []);

  // Handle change for each dropdown
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle area change
  const handleAreaChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      area: value,  // Update area value
      line: '',  // Reset line since we are selecting a new area
      station: ''  // Reset station as well when area changes
    });

    if (value) {
      // Fetch lines for the selected area
      PlantDataService.getLineByArea(value)
        .then((response) => setLineOptions(response.data))
        .catch((error) => console.error('Error fetching lines', error));
    } else {
      // Clear line and station options if no area is selected
      setLineOptions([]);
      setStationOptions([]);
    }
  };

  // Handle line change
  const handleLineChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      line: value,  // Update line value
      station: ''  // Reset station as we are selecting a new line
    });

    if (value) {
      // Fetch stations for the selected line
      PlantDataService.getStationByLine(value)
        .then((response) => setStationOptions(response.data))
        .catch((error) => console.error('Error fetching stations', error));
    } else {
      // Clear station options if no line is selected
      setStationOptions([]);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (!formData.plant || !formData.area || !formData.line || !formData.station) {
      alert('Please select values for all fields');
      return;
    }

    console.log('Search Data:', formData);  // Debugging search form data

    axios.get('/api/search', {
      params: formData  // Send form data as query parameters
    })
      .then(response => {
        console.log('Search results:', response.data);  // Handle the response as needed
      })
      .catch(error => {
        console.error('Search error:', error);
      });
  };

  // Fetch area, line, and station options when a plant is selected
  useEffect(() => {
    if (formData.plant) {
      // Fetch areas for the selected plant
      PlantDataService.getAreaByPlant(formData.plant)
        .then((response) => setAreaOptions(response.data))
        .catch((error) => console.error('Error fetching areas', error));

      // Fetch stations for the selected plant
      axios.get(`/api/stations?plant=${formData.plant}`)
        .then(response => setStationOptions(response.data))
        .catch(error => console.error('Error fetching stations', error));
    } else {
      // Clear options for area, line, and station if no plant is selected
      setAreaOptions([]);
      setLineOptions([]);
      setStationOptions([]);
    }
  }, [formData.plant]);

  return (
    <div className="container">
     
      <form>
        <div className="row">
          {/* Plant Dropdown */}
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="plant">Plant</label>
              <select
                id="plant"
                name="plant"
                className="form-control"
                value={formData.plant}
                onChange={handleChange}
              >
                <option value="">Select Plant</option>
                {plantOptions.map((plant, index) => (
                  <option key={index} value={plant.plant}>{plant.plant}</option>  
                ))}
              </select>
            </div>
          </div>

          {/* Area Dropdown */}
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="area">Area</label>
              <select
                id="area"
                name="area"
                className="form-control"
                value={formData.area}
                onChange={handleAreaChange}  // Use handleAreaChange for Area dropdown
                disabled={!formData.plant}  // Disable area if no plant is selected
              >
                <option value="">Select Area</option>
                {areaOptions.map((area, index) => (
                  <option key={index} value={area.area}>{area.area}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Dropdown */}
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="line">Line</label>
              <select
                id="line"
                name="line"
                className="form-control"
                value={formData.line}
                onChange={handleLineChange}  // Use handleLineChange for Line dropdown
                disabled={!formData.area}  // Disable line if no area is selected
              >
                <option value="">Select Line</option>
                {lineOptions.map((line, index) => (
                  <option key={index} value={line.line}>{line.line}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Station Dropdown */}
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="station">Station</label>
              <select
                id="station"
                name="station"
                className="form-control"
                value={formData.station}
                onChange={handleChange}  // Use handleChange for Station dropdown
                disabled={!formData.line}  // Disable station if no line is selected
              >
                <option value="">Select Station</option>
                {stationOptions.map((station, index) => (
                  <option key={index} value={station.station_name}>{station.station_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-1">
        <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
        </div>
        </div>

        

        {/* Search Button */}
        {/* <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div> */}
      </form>
    </div>
  );
};

export default SearchForm;
