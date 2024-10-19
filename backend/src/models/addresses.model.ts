export = (sequelize: any, Sequelize: any) => {
  return sequelize.define("addresses", {
    personId: {
      type: Sequelize.INTEGER
    },
    addressType: {
      type: Sequelize.ENUM('residence', 'birth', 'death'),
      allowNull: true
    },
    country: {
      type: Sequelize.STRING
    },
    postalCode: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    street: {
      type: Sequelize.STRING
    },
    door: {
      type: Sequelize.STRING
    }
  });
}