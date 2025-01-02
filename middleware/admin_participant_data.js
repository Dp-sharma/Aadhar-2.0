const participant = require("../models/participantmodel");

const participantdata = async (req, res, next) => {
  try {
    const data = await participant.find();
    console.log(data);
    res.locals.participantData = data; // Store data in res.locals
    return next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while fetching the participant data',
      error: error.message,
    });
  }
};

module.exports = {
  participantdata,
};
