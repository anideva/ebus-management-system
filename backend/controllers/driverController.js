import Driver from "../models/driver.js";

// GET all drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch drivers",
      error: error.message,
    });
  }
};

// CREATE a new driver
export const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);

    const savedDriver = await driver.save();

    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create driver",
      error: error.message,
    });
  }
};

// UPDATE a driver
export const updateDriver = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDriver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update driver",
      error: error.message,
    });
  }
};

// DELETE a driver
export const deleteDriver = async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(
      req.params.id
    );

    if (!deletedDriver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.status(200).json({
      message: "Driver deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete driver",
      error: error.message,
    });
  }
};