const calculateRisk = (project) => {
  const progress = Number(project.progress || 0);

  let score = 0;

  if (progress < 25) {
    score += 3;
  } else if (progress < 50) {
    score += 2;
  } else if (progress < 75) {
    score += 1;
  }

  if (project.status === "Delayed") {
    score += 2;
  }

  if (project.status === "Critical") {
    score += 4;
  }

  if (score >= 7) {
    return "Critical";
  }

  if (score >= 5) {
    return "High";
  }

  if (score >= 3) {
    return "Medium";
  }

  return "Low";
};

const getRiskMessage = (risk) => {
  const messages = {
    Low: "Project is currently operating within normal risk levels.",

    Medium:
      "Project requires regular monitoring.",

    High:
      "Project requires attention and closer monitoring.",

    Critical:
      "Project requires immediate administrative review."
  };

  return (
    messages[risk] ||
    messages.Low
  );
};

module.exports = {
  calculateRisk,
  getRiskMessage
};