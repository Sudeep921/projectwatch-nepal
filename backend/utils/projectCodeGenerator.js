const Project =
  require("../models/Project");

const generateProjectCode =
  async () => {
    const year =
      new Date()
        .getFullYear();

    const count =
      await Project.countDocuments();

    const number =
      String(
        count + 1
      ).padStart(
        5,
        "0"
      );

    return `PW-${year}-${number}`;
  };

module.exports = {
  generateProjectCode
};