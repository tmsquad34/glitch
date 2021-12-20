exports.index = async function(req, res) {
  console.log(req.body);

  return res.status(200).json({
    device: 123123123,
    delay: 2000,
    temperature: true
  });
};
