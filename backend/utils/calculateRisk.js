const calculateRisk = ({
  progress = 0,
  status = "",
  budget = 0,
  expectedProgress = null
}) => {
  const currentProgress =
    Number(progress) || 0;

  const projectStatus =
    String(status || "").toLowerCase();

  const projectBudget =
    Number(budget) || 0;

  let riskScore = 0;

  /* =========================
     STATUS RISK
     ========================= */

  if (
    projectStatus === "critical"
  ) {
    riskScore += 50;
  } else if (
    projectStatus === "delayed"
  ) {
    riskScore += 30;
  } else if (
    projectStatus === "at risk"
  ) {
    riskScore += 25;
  } else if (
    projectStatus === "active"
  ) {
    riskScore += 5;
  }

  /* =========================
     LOW PROGRESS RISK
     ========================= */

  if (currentProgress < 20) {
    riskScore += 30;
  } else if (currentProgress < 40) {
    riskScore += 20;
  } else if (currentProgress < 60) {
    riskScore += 10;
  }

  /* =========================
     EXPECTED PROGRESS
     ========================= */

  if (
    expectedProgress !== null &&
    expectedProgress !== undefined
  ) {
    const expected =
      Number(expectedProgress) || 0;

    const progressGap =
      expected - currentProgress;

    if (progressGap >= 30) {
      riskScore += 30;
    } else if (progressGap >= 20) {
      riskScore += 20;
    } else if (progressGap >= 10) {
      riskScore += 10;
    }
  }

  /* =========================
     HIGH BUDGET RISK
     ========================= */

  if (projectBudget >= 10000000000) {
    riskScore += 15;
  } else if (
    projectBudget >= 5000000000
  ) {
    riskScore += 10;
  } else if (
    projectBudget >= 1000000000
  ) {
    riskScore += 5;
  }

  /* =========================
     FINAL RISK
     ========================= */

  if (riskScore >= 70) {
    return "Critical";
  }

  if (riskScore >= 45) {
    return "High";
  }

  if (riskScore >= 20) {
    return "Medium";
  }

  return "Low";
};

module.exports = calculateRisk;