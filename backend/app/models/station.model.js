module.exports = (sequelize, Sequelize) => {
    const Station = sequelize.define("station", {
        sr_no: {
            type: Sequelize.INTEGER,  
            autoIncrement: true,      
            primaryKey: true          
          },
        plant: {
        type: Sequelize.STRING
      },
      station_name: {
        type: Sequelize.STRING
      },
      line_sr_no: {
        type: Sequelize.STRING
      }
    }, {
        freezeTableName: true ,
        timestamps: false  
      });
  
    return Station;
  };
  