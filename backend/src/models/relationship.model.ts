export = (sequelize: any, Sequelize: any) => {
  return sequelize.define("relationships", {
    person1Id: {
      type: Sequelize.INTEGER
    },
    person2Id: {
      type: Sequelize.INTEGER
    },
    type: {
      type: Sequelize.ENUM('sibling', 'parent', 'child', 'spouse')
    }
  });
}