import bcrypt from "bcryptjs";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import { randomUUID } from "uuid";

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || "replace-this-secret";
const entityName = "messages";

const users = [];
const records = [
  { id: randomUUID(), title: "Demo message", status: "active", owner: "demo", priority: "medium", createdAt: new Date().toISOString() }
];

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

function sign(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: "8h" });
}

function auth(requiredRole) {
  return (req, res, next) => {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "missing_token" });
    try {
      const claims = jwt.verify(token, jwtSecret);
      if (requiredRole && claims.role !== requiredRole && claims.role !== "admin") {
        return res.status(403).json({ error: "forbidden" });
      }
      req.user = claims;
      next();
    } catch {
      return res.status(401).json({ error: "invalid_token" });
    }
  };
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Secure Chat Application", uptime: process.uptime() });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, role = "member" } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email_and_password_required" });
  if (users.some((user) => user.email === email)) return res.status(409).json({ error: "email_exists" });
  const user = { id: randomUUID(), email, role, passwordHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
  users.push(user);
  res.status(201).json({ token: sign(user), user: { id: user.id, email: user.email, role: user.role } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((item) => item.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  res.json({ token: sign(user), user: { id: user.id, email: user.email, role: user.role } });
});

app.get("/api/" + entityName, auth(), (req, res) => {
  res.json(records);
});

app.post("/api/" + entityName, auth(), (req, res) => {
  const record = {
    id: randomUUID(),
    title: req.body.title || "Untitled",
    status: req.body.status || "active",
    owner: req.user.email,
    priority: req.body.priority || "medium",
    metadata: req.body.metadata || {},
    createdAt: new Date().toISOString()
  };
  records.unshift(record);
  res.status(201).json(record);
});

app.patch("/api/" + entityName + "/:id", auth(), (req, res) => {
  const record = records.find((item) => item.id === req.params.id);
  if (!record) return res.status(404).json({ error: "not_found" });
  Object.assign(record, req.body, { updatedAt: new Date().toISOString() });
  res.json(record);
});

app.get("/api/analytics", auth(), (req, res) => {
  const byStatus = records.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  res.json({ total: records.length, byStatus, activeUsers: users.length });
});

app.get("/api/admin/audit", auth("admin"), (req, res) => {
  res.json({ users: users.length, records: records.length, generatedAt: new Date().toISOString() });
});

app.listen(port, () => {
  console.log("Secure Chat Application API listening on " + port);
});

export default app;
