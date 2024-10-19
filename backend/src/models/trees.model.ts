export = (sequelize: any, Sequelize: any) => {
  return sequelize.define("trees", {
    title: {
      type: Sequelize.STRING
    },
    ownerId: {
      type: Sequelize.INTEGER
    }
  });
}