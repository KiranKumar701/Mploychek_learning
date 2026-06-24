const express = require("express");
const Habit = require("../models/Habit");

const router = express.Router();

function serializeHabit(habit) {
  return {
    id: habit._id.toString(),
    name: habit.name,
    completions: habit.completions.map((date) => date.toISOString()),
    createdAt: habit.createdAt.toISOString(),
  };
}

router.get("/", async (_req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json(habits.map(serializeHabit));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch habits", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await Habit.create({ name });
    res.status(201).json(serializeHabit(habit));
  } catch (error) {
    res.status(500).json({ message: "Failed to create habit", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete habit", error: error.message });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const dateInput = req.body?.date;

    if (!dateInput) {
      return res.status(400).json({ message: "Date is required" });
    }

    const targetDate = new Date(dateInput);

    if (Number.isNaN(targetDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingIndex = habit.completions.findIndex(
      (completion) => completion >= dayStart && completion <= dayEnd
    );

    if (existingIndex >= 0) {
      habit.completions.splice(existingIndex, 1);
    } else {
      habit.completions.push(dayStart);
    }

    await habit.save();
    res.json(serializeHabit(habit));
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle habit", error: error.message });
  }
});

module.exports = router;
