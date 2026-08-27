import Route from "../models/route.js";

export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();

    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch routes",
      error: error.message,
    });
  }
};

export const createRoute = async (req, res) => {
  try {
    const newRoute = await Route.create(req.body);

    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create route",
      error: error.message,
    });
  }
};
export const updateRoute = async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedRoute) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update route",
      error: error.message,
    });
  }
};
export const deleteRoute = async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);

    if (!deletedRoute) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.status(200).json({
      message: "Route deleted successfully",
      route: deletedRoute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete route",
      error: error.message,
    });
  }
};