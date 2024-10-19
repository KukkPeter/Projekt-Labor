export = (sequelize: any, Sequelize: any) => {
  return sequelize.define("people", {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    nickName: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.ENUM('male', 'female'),
      allowNull: true
    },
    birthDate: {
      type: Sequelize.DATE
    },
    deathDate: {
      type: Sequelize.DATE
    },
    description: {
      type: Sequelize.STRING
    },
    treeId: {
      type: Sequelize.INTEGER
    }
  });
}