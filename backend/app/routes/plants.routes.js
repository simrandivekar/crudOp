module.exports = app => {
    
    var router = require("express").Router();
    const plants = require("../controllers/checklist.controller.js");
    console.log(plants);
    
    // Retrieve all Tutorials
    router.get("/getPlant", plants.findAll);
    router.get("/distinct", plants.findDistinctPlants);
    // router.get("/areas?plant=:plant", plants.getAreaFromPlant);
    router.get("/areas", plants.getAreaFromPlant);
    router.get("/line", plants.getLineFromArea);
    router.get("/station", plants.getStationFromLine);


    // router.get("/", plants.findAll);
    app.use("/api/plants", router);
  };
  