const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.index = async function(req, res) {
  const balance = await stripe.balance.retrieve().then(
    async result => {
      return res.json({
        data: result.pending
      });
    },
    err => {
      return res.json({
        error_message: err.message
      });
    }
  );
};
