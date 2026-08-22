import Bus from "../models/Bus.js";

export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();

    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch buses",
      error: error.message,
    });
  }
};

export const createBus = async (req, res) => {
  try {
    const newBus = await Bus.create(req.body);

    res.status(201).json(newBus);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create bus",
      error: error.message,
    });
  }
};