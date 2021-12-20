const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.index = async function(req, res) {
  const { object } = req.body.input;
  console.log(object);
  const customer = await stripe.customers.retrieve(object.stripe_id);
  console.log(customer.id);
  return res.json({
      id: customer.id,
      balance: customer.balance,
      created: customer.created,
      currency: customer.currency,
      default_source: customer.default_source,
      delinquent: customer.delinquent,
      description: customer.description,
      discount: customer.discount,
      email: customer.email,
      invoice_prefix: customer.invoice_prefix,
      name: customer.name,
      next_invoice_sequence: customer.next_invoice_sequence,
      phone: customer.phone,
      shipping: customer.shipping,
      tax_exempt: customer.tax_exempt,
  });
};
