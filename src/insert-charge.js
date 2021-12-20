const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);
const fetch = require("node-fetch");

exports.index = async function(req, res) {
  const data = req.body.event.data.new;
  const charge = await stripe.charges
    .create({
      customer: data.stripe_id,
      amount: data.amount,
      currency: data.currency,
      source: data.source,
      description: data.description
    })
    .then(
      async result => {
        const response = await fetch(process.env.INSERT_CHARGE_FETCH_URL, {
          method: "PUT",
          body: JSON.stringify({
            charge: {
              amount_captured: result.amount_captured,
              amount_refunded: result.amount_refunded,
              failure_code: result.failure_code,
              invoice: result.invoice,
              livemode: result.livemode,
              paid: result.paid,
              payment_method: result.payment_method,
              receipt_url: result.receipt_url,
              receipt_email: result.receipt_email,
              receipt_number: result.receipt_number,
              refunded: result.refunded,
              refunds: result.refunds,
              status: result.status,
              payment_method_details: result.payment_method_details
            },
            charge_id: data.id
          }),
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
          }
        });
        return res.json({
          response: response
        });
      },
      err => {
        return res.json({
          error_message: err.message
        });
      }
    );
};
