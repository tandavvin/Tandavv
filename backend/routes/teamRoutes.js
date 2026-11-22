// backend/routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const { 
  getTeamMembers, 
  inviteEmployee, 
  updateMemberRole, 
  removeMember, 
  getActivityLogs 
} = require("../controllers/teamController");
const { verifyToken } = require("../middleware/authMiddleware"); // Destructure verifyToken
const { requirePermission } = require("../middleware/rbacMiddleware");

// All team routes require authentication
router.use(verifyToken);

// Routes with specific permission checks
router.get("/", requirePermission("team.view"), getTeamMembers);
router.post("/invite", requirePermission("team.invite"), inviteEmployee);
router.put("/:memberId", requirePermission("team.manage"), updateMemberRole);
router.delete("/:memberId", requirePermission("team.manage"), removeMember);
router.get("/logs", requirePermission("team.view"), getActivityLogs);

module.exports = router;