const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ success: false, message: error.message });
  }
};

const asyncHandlers = (requestHandle) => {
  Promise.resolve(requestHandle()).catch((err) => next(err));
};

module.exports = asyncHandler;
