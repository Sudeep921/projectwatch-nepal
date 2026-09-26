const User =
  require("../models/User");

const updateUserStatus =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      user.isActive =
        Boolean(req.body.isActive);

      await user.save();

      res.json({
        success: true,
        message:
          "User status updated",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive:
            user.isActive
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update user",
        error: error.message
      });
    }
  };

const updateUserRole =
  async (req, res) => {
    try {
      const allowedRoles = [
        "admin",
        "worker",
        "user"
      ];

      if (
        !allowedRoles.includes(
          req.body.role
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid role"
        });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      user.role =
        req.body.role;

      await user.save();

      res.json({
        success: true,
        message:
          "User role updated",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to update role",
        error: error.message
      });
    }
  };

module.exports = {
  updateUserStatus,
  updateUserRole
};