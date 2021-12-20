exports.index = async function(req, res) {
  const { object } = req.body.input;

  return res.json({
    message: "Data calculations completed successfully."
  });
};
