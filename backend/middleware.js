export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorisation;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.statur(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
}
