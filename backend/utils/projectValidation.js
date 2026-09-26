const validateProject =
  data => {
    const errors = [];

    if (
      !data.name ||
      !String(data.name).trim()
    ) {
      errors.push(
        "Project name is required"
      );
    }

    if (
      data.progress !==
        undefined &&
      (
        Number(data.progress) < 0 ||
        Number(data.progress) > 100
      )
    ) {
      errors.push(
        "Progress must be between 0 and 100"
      );
    }

    if (
      data.budget !==
        undefined &&
      Number(data.budget) < 0
    ) {
      errors.push(
        "Budget cannot be negative"
      );
    }

    if (
      data.status &&
      ![
        "Active",
        "Delayed",
        "Completed",
        "Critical"
      ].includes(
        data.status
      )
    ) {
      errors.push(
        "Invalid project status"
      );
    }

    if (
      data.risk &&
      ![
        "Low",
        "Medium",
        "High",
        "Critical"
      ].includes(
        data.risk
      )
    ) {
      errors.push(
        "Invalid project risk"
      );
    }

    return errors;
  };

module.exports = {
  validateProject
};