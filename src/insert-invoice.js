const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.index = async function(req, res) {
  const { object } = req.body.input;
  const invoice = await stripe.invoices.create(object).then(
    async result => {
      return res.json({
        response: result
      });
    },
    err => {
      return res.json({
        error_message: err.message
      });
    }
  );
};
