module.exports = (sequelize, Sequelize) => {
    const Plant = sequelize.define("cc_shop_line_mappings", {
        id: {
            type: Sequelize.INTEGER,  
            autoIncrement: true,      
            primaryKey: true          
          },
        plant: {
        type: Sequelize.STRING
      },
      shop: {
        type: Sequelize.STRING
      },
      line: {
        type: Sequelize.STRING
      }
    }, {
        freezeTableName: true ,
        timestamps: false  
      });
  
    return Plant;
  };
  