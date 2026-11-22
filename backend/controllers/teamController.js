const StoreMember = require("../models/StoreMember");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

// GET /api/team - List team members for a store
exports.getTeamMembers = async (req, res) => {
  try {
    const { storeId } = req.query;
    const members = await StoreMember.find({ storeId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: members });
  } catch (error) {
    console.error("Get team members error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch team members" });
  }
};

// POST /api/team/invite - Invite an employee
exports.inviteEmployee = async (req, res) => {
  try {
    const { storeId, email, role, permissions } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, message: "Email and role are required" });
    }

    // Find or create user account for invitee
    let inviteeUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!inviteeUser) {
      // Create a placeholder user account (they can set password on first login)
      inviteeUser = await User.create({
        name: email.split("@")[0],
        email: email.toLowerCase().trim(),
        password: "" // Blank password until registered/claimed
      });
    }

    // Check if already a member
    const existingMember = await StoreMember.findOne({ storeId, userId: inviteeUser._id });
    if (existingMember) {
      return res.status(400).json({ success: false, message: "User is already a member of this store" });
    }

    const newMember = await StoreMember.create({
      storeId,
      userId: inviteeUser._id,
      role,
      permissions: permissions || [],
      status: "active", // Can be set to "pending" if email verification is used
      invitedBy: req.user.id
    });

    // Log activity
    await ActivityLog.create({
      storeId,
      userId: req.user.id,
      action: "EMPLOYEE_INVITED",
      description: `Invited ${email} as ${role}`
    });

    return res.status(201).json({ success: true, message: "Employee invited successfully", data: newMember });
  } catch (error) {
    console.error("Invite employee error:", error);
    return res.status(500).json({ success: false, message: "Failed to invite employee" });
  }
};

// PUT /api/team/:memberId - Update employee role/permissions
exports.updateMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { storeId, role, permissions, status } = req.body;

    const member = await StoreMember.findOne({ _id: memberId, storeId });
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    if (member.role === "owner" && role && role !== "owner") {
      return res.status(400).json({ success: false, message: "Cannot demote store owner without assigning a replacement." });
    }

    if (role) member.role = role;
    if (permissions) member.permissions = permissions;
    if (status) member.status = status;

    await member.save();

    await ActivityLog.create({
      storeId,
      userId: req.user.id,
      action: "TEAM_MEMBER_UPDATED",
      description: `Updated member permissions/role`
    });

    return res.status(200).json({ success: true, message: "Team member updated", data: member });
  } catch (error) {
    console.error("Update member error:", error);
    return res.status(500).json({ success: false, message: "Failed to update team member" });
  }
};

// DELETE /api/team/:memberId - Remove employee
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { storeId } = req.query;

    const member = await StoreMember.findOne({ _id: memberId, storeId });
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    if (member.role === "owner") {
      const ownerCount = await StoreMember.countDocuments({ storeId, role: "owner" });
      if (ownerCount <= 1) {
        return res.status(400).json({ success: false, message: "Cannot remove the only store owner." });
      }
    }

    await StoreMember.deleteOne({ _id: memberId });

    await ActivityLog.create({
      storeId,
      userId: req.user.id,
      action: "TEAM_MEMBER_REMOVED",
      description: `Removed member from store`
    });

    return res.status(200).json({ success: true, message: "Team member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({ success: false, message: "Failed to remove team member" });
  }
};

// GET /api/team/logs - Fetch activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const { storeId } = req.query;
    const logs = await ActivityLog.find({ storeId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Get logs error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch activity logs" });
  }
};