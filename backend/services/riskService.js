// ==========================================
// PROJECT RISK CALCULATION SERVICE
// ==========================================

const calculateRisk = (project) => {

  let riskScore = 0;


  // ----------------------------------------
  // PROGRESS
  // ----------------------------------------

  if (project.progress < 25) {

    riskScore += 3;

  } else if (project.progress < 50) {

    riskScore += 2;

  } else if (project.progress < 75) {

    riskScore += 1;
  }


  // ----------------------------------------
  // PROJECT STATUS
  // ----------------------------------------

  if (project.status === "Delayed") {
    riskScore += 2;
  }

  if (project.status === "Critical") {
    riskScore += 4;
  }


  // ----------------------------------------
  // EXISTING RISK
  // ----------------------------------------

  if (project.riskLevel === "Medium") {
    riskScore += 1;
  }

  if (project.riskLevel === "High") {
    riskScore += 2;
  }

  if (project.riskLevel === "Critical") {
    riskScore += 4;
  }


  // ----------------------------------------
  // FINAL RISK
  // ----------------------------------------

  if (riskScore >= 7) {
    return "Critical";
  }

  if (riskScore >= 5) {
    return "High";
  }

  if (riskScore >= 3) {
    return "Medium";
  }

  return "Low";
};


module.exports = {
  calculateRisk
};