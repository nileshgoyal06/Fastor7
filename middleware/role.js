const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) return res.status(401).send("Unauthorized");

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).send("Access denied");
      }

      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
};

module.exports = { roleAuth };