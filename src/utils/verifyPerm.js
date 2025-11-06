

export const verifyPerm = (roles) => (req, res, next) => {

  if (!roles.includes(req.user.role)) return res.status(403).josn({ message: "access Denied" })
  next();
}
