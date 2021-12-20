const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.index = async function(req, res) {
  const { object } = req.body.input;
  const { address } = req.body.input;
  object.address = address;
  const customer = await stripe.customers.create(object).then(
    async result => {
      return res.json({
        name: result.name,
        currency: result.currency,
        invoice_prefix: result.invoice_prefix,
        email: result.email,
        phone: result.phone,
        created: result.created,
        discount: result.discount
      });
    },
    err => {
      return res.json({
        error_message: err.message
      });
    }
  );
};
