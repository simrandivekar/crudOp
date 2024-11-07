const db = require("../models");
const Plant = db.plants;
const Station = db.station;
const Op = db.Sequelize.Op;
const { Sequelize } = db; 

// Create and Save a new Plant (this is the 'create' function)
exports.create = (req, res) => {
  // Validate request
  if (!req.body.plant) {
    return res.status(400).send({
      message: "Plant content can not be empty!"
    });
  }

  // Create the plant object
  const plant = {
    plant: req.body.plant,
    shop: req.body.shop,
    line: req.body.line,
    createdBy: req.body.createdBy,
    createdDatetime: req.body.createdDatetime || new Date(),
    updatedBy: req.body.updatedBy,
    updateDatetime: req.body.updateDatetime || new Date(),
  };

  const station = {
    plant: req.body.plant,
    station_name: req.body.shop,
    line_sr_no: req.body.line,
  };
  // Save the plant to the database
  Plant.create(plant)
    .then(data => {
      res.send(data); // Send the created plant as the response
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the plant."
      });
    });
};

// Retrieve all Plants (this is the 'findAll' function)
exports.findAll = (req, res) => {
  const plant2 = req.query.plant;
  const condition = plant2 ? { plant: { [Op.iLike]: `%${plant2}%` } } : null;

  Plant.findAll({ where: condition })
    .then(data => {
      res.send(data); // Send the retrieved plant data as the response
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving plant data."
      });
    });
};

exports.findDistinctPlants = (req, res) => {
    // Using Sequelize's DISTINCT to fetch unique plant names
    Plant.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('plant')), 'plant']  // DISTINCT on the 'plant' column
      ]
    })
    .then(data => {
        res.send(data);  // Send the distinct plant names as a response
    })
    .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving distinct plant data."
        });
    });
};

exports.getAreaFromPlant = (req, res) => {
    const plantName = req.query.plant; // Extract the 'plant' parameter from the query string

    if (!plantName) {
        return res.status(400).send({
            message: "Plant name is required"
        });
    }

    // Using Sequelize's DISTINCT to fetch unique area values for the specified plant
    Plant.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('shop')), 'area']  // DISTINCT on the 'shop' column (which is assumed to represent area)
        ],
        where: {
            plant: plantName  // Filter the rows by the given plant name
        }
    })
    .then(data => {
        if (data.length === 0) {
            return res.status(404).send({
                message: `No areas found for plant: ${plantName}`
            });
        }
        res.send(data);  // Send the distinct areas as a response
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving distinct area data."
        });
    });
};

exports.getLineFromArea = (req, res) => {
    const areaName = req.query.area; // Extract the 'plant' parameter from the query string

    if (!areaName) {
        return res.status(400).send({
            message: "Area name is required"
        });
    }

    // Using Sequelize's DISTINCT to fetch unique area values for the specified plant
    Plant.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('line')), 'line']  // DISTINCT on the 'line' column (which is assumed to represent area)
        ],
        where: {
            shop: areaName  // Filter the rows by the given area name
        }
    })
    .then(data => {
        if (data.length === 0) {
            return res.status(404).send({
                message: `No lines found for area: ${areaName}`
            });
        }
        res.send(data);  // Send the distinct areas as a response
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving distinct line data."
        });
    });
};
exports.getStationFromLine = (req, res) => {
    const lineName = req.query.line;

    if (!lineName) {
        return res.status(400).send({
            message: "Line name is required"
        });
    }

    // Fetch the plant by matching the line_name (assuming line_name is a string in both Plant and Station)
    Plant.findOne({
        attributes: ['id'],
        where: {
            line: lineName // Assuming line is the column you're searching for in Plant
        }
    })
    .then(plant => {
        if (!plant) {
            return res.status(404).send({
                message: `No plant found with line: ${lineName}`
            });
        }

        // Convert the id to string since line_sr_no is a string (character varying) in Station
        const lineSrNo = String(plant.id);  // Ensure id is treated as a string for comparison

        // Fetch stations where the line_sr_no matches
        Station.findAll({
            where: {
                line_sr_no: lineSrNo  // Ensure this comparison is done with the correct type (string)
            }
        })
        .then(stations => {
            if (stations.length === 0) {
                return res.status(404).send({
                    message: `No stations found for line: ${lineSrNo}`
                });
            }
            res.send(stations);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving station data."
            });
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving line information."
        });
    });
};

