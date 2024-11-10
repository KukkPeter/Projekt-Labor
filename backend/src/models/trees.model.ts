export = (sequelize: any, Sequelize: any) => {
  return sequelize.define("trees", {
    title: {
      type: Sequelize.STRING
    },
    treeData: {
      type: Sequelize.JSON
    },
    ownerId: {
      type: Sequelize.INTEGER
    }
  });
}