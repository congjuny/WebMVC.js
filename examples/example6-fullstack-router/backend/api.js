import { Router } from "express";
import { getDb } from "./db.js";
import { sleep } from "../utils/utils.js";

const router = Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Hello from backend API!" });
});

router.get("/employees", async (req, res) => {
  const db = await getDb();
  const employees = await db.all("SELECT * FROM employees");

  console.log("Fetched employees:", employees);
  await sleep(500); // Simulate a delay for demonstration purposes

  res.json(employees);
});

router.get("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDb();
    const employee = await db.get("SELECT * FROM employees WHERE id = ?", id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/employees", async (req, res) => {
  //console.log("POST /employees headers:", req.headers);
  console.log("POST /employees body:", req.body);

  const { name, email, position = "unknown", salary = 0 } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Name and email are required",
    });
  }

  try {
    const db = await getDb();
    const result = await db.run("INSERT INTO employees (name, email, position, salary) VALUES (?, ?, ?, ?)", [
      name,
      email,
      position,
      salary,
    ]);

    console.log("Inserted employee with ID:", result.lastID);

    res.status(201).json({ id: result.lastID, name, email, position, salary });
  } catch (err) {
    console.error("Error inserting record into DB:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, position, salary } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const db = await getDb();
    const result = await db.run(
      `UPDATE employees
       SET name = ?, email = ?, position = ?, salary = ?
       WHERE id = ?`,
      [name, email, position, salary, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDb();
    const result = await db.run("DELETE FROM employees WHERE id = ?", id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
