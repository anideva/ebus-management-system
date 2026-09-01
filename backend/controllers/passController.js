import Pass from "../models/pass.js";

// GET all passes
export const getPasses = async (req, res) => {
  try {
    const passes = await Pass.find();

    res.status(200).json(passes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch passes",
      error: error.message,
    });
  }
};

// CREATE a new pass
export const createPass = async (req, res) => {
  try {
    const pass = new Pass(req.body);

    const savedPass = await pass.save();

    res.status(201).json(savedPass);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create pass",
      error: error.message,
    });
  }
};

// UPDATE a pass
export const updatePass = async (req, res) => {
  try {
    const updatedPass = await Pass.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPass) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    res.status(200).json(updatedPass);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update pass",
      error: error.message,
    });
  }
};

// DELETE a pass
export const deletePass = async (req, res) => {
  try {
    const deletedPass = await Pass.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPass) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    res.status(200).json({
      message: "Pass deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete pass",
      error: error.message,
    });
  }
};