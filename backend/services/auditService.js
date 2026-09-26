const AuditLog =
  require("../models/AuditLog");

const createAuditLog =
  async ({
    user,
    action,
    description,
    entity,
    entityId
  }) => {
    try {
      return await AuditLog.create({
        user,
        action,
        description,
        entity,
        entityId
      });
    } catch (error) {
      console.error(
        "Audit log error:",
        error.message
      );

      return null;
    }
  };

module.exports = {
  createAuditLog
};