const analyzeEvidence = async ({
  projectProgress,
  reportedProgress,
  evidenceType
}) => {
  const difference = Math.abs(
    Number(projectProgress || 0) -
    Number(reportedProgress || 0)
  );

  let status = "Verified";
  let message = "No major discrepancy detected.";

  if (difference >= 20) {
    status = "Potential Discrepancy";

    message =
      "Reported progress and project progress show a significant difference. Human review is recommended.";
  }

  if (!evidenceType) {
    status = "Needs Human Review";

    message =
      "Evidence type is missing. Human verification is recommended.";
  }

  return {
    status,
    message,
    difference,
    analyzedAt: new Date()
  };
};

module.exports = {
  analyzeEvidence
};