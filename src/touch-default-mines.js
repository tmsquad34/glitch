const fetch = require("node-fetch");

async function addDefaultDataMines(object) {
  const addDefaultMines = `mutation MyMutation($object: data_mines_insert_input = {}) {
  insert_data_mines_one(object: $object) {
    id
  }
}
`;
  const graphqlReq = {
    query: addDefaultMines,
    variables: {object: object}
  };

  const data_mine_response = await fetch(
    process.env.MARKETING_CHECK_BILPP_HASURA_URL,
    {
      method: "POST",
      body: JSON.stringify(graphqlReq),
      headers: {
        "content-type": process.env.CONTENT_TYPE,
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      return data.data
    });

  return data_mine_response;
}

exports.index = async function(req, res) {
  const team_id = req.body.event.data.new.team_id;
  const touch_id = req.body.event.data.new.id;

  var default_mines = [
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '32bffd3f-b74d-4e4d-a868-600049e6e1b0',
        name: 'Bilpp Identify',
        description: '',
        event: 'bilpp::identify',
        parameters: ['email'],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '32bffd3f-b74d-4e4d-a868-600049e6e1b0',
        name: 'Bilpp Page Visit',
        description: '',
        event: 'bilpp::page',
        parameters: [],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '32bffd3f-b74d-4e4d-a868-600049e6e1b0',
        name: 'Bilpp Popup Show',
        description: '',
        event: 'bilpp::popup::show',
        parameters: ['template_id'],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '32bffd3f-b74d-4e4d-a868-600049e6e1b0',
        name: 'Bilpp Popup Close',
        description: '',
        event: 'bilpp::popup::close',
        parameters: ['template_id'],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Product Impressions',
        description: '',
        event: 'bilpp::ec::impressions',
        parameters: [
            'list',
            'list_id',
            'products.name',
            'products.id',
            'products.sku',
            'products.variant',
            'products.price',
            'products.currency',
            'products.brand',
            'products.categories',
            'products.index',
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Product Click',
        description: '',
        event: 'bilpp::ec::productClick',
        parameters: [
            'list',
            'list_id',
            'name',
            'id',
            'sku',
            'variant',
            'price',
            'currency',
            'brand',
            'categories',
            'index',
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Product Views',
        description: '',
        event: 'bilpp::ec::productView',
        parameters: [
            'name',
            'id',
            'sku',
            'variant',
            'price',
            'currency',
            'brand',
            'categories'
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Category Click',
        description: '',
        event: 'bilpp::ec::categoryClick',
        parameters: [
            'list',
            'list_id',
            'name',
            'id',
            'parents',
            'index'
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Category View',
        description: '',
        event: 'bilpp::ec::categoryView',
        parameters: [
            'list',
            'list_id',
            'name',
            'id',
            'parents'
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Promo Click',
        description: '',
        event: 'bilpp::ec::promoClick',
        parameters: [
            'list',
            'list_id',
            'name',
            'id',
            'category_id',
            'category_name',
            'product_id',
            'product_name',
            'index',
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Promo View',
        description: '',
        event: 'bilpp::ec::promoView',
        parameters: [
            'list',
            'list_id',
            'name',
            'id',
            'category_id',
            'category_name',
            'product_id',
            'product_name',
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Add Basket',
        description: '',
        event: 'bilpp::ec::addBasket',
        parameters: [
            'id',
            'name',
            'sku',
            'variant',
            'price',
            'currency',
            'brand',
            'categories',
            'qty',
            'total_amount'
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Remove Basket',
        description: '',
        event: 'bilpp::ec::removeBasket',
        parameters: [
            'id',
            'name',
            'sku',
            'variant',
            'price',
            'currency',
            'brand',
            'categories',
            'qty',
            'total_amount'
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Checkout',
        description: '',
        event: 'bilpp::ec::checkOut',
        parameters: [
            'name',
            'id',
            'sku',
            'variant',
            'price',
            'qty',
            'amount',
            'currency',
            'brand',
            'categories'
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Purchase',
        description: '',
        event: 'bilpp::ec::purchase',
        parameters: [
            'purchase_id',
            'transaction_id',
            'basket_id',
            'payment_method',
            'currency',
            'step',
            'tax',
            'shipping',
            'coupon',
            'discount',
            'affiliation',
            'revenue',
            'products.name',
            'products.id',
            'products.sku',
            'products.variant',
            'products.price',
            'products.qty',
            'products.amount',
            'products.currency',
            'products.brand',
            'products.categories',
            'products.index',  
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '608f3d9c-1d36-4886-abdf-bcc67cd574a5',
        name: 'Bilpp Refund',
        description: '',
        event: 'bilpp::ec::refund',
        parameters: [
            'purchase_id',
            'transaction_id',
            'currency',
            'tax',
            'shipping',
            'coupon',
            'discount',
            'affiliation',
            'payment_method',
            'expense',
            'products.name',
            'products.id',
            'products.sku',
            'products.variant',
            'products.price',
            'products.qty',
            'products.amount',
            'products.currency',
            'products.brand',
            'products.categories',
            'products.index',  
        ],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '66ed115d-5833-4e30-88b4-fc3339bb17c4',
        name: 'Bilpp Cookie Consent Accept',
        description: '',
        event: 'bilpp::cc::accept',
        parameters: [],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    },
    {
        settings: {},
        is_deletable: false,
        team_id: '...',
        touch_id: '...',
        data_mine_type_id: '66ed115d-5833-4e30-88b4-fc3339bb17c4',
        name: 'Bilpp Cookie Consent Reject',
        description: '',
        event: 'bilpp::cc::reject',
        parameters: ['email'],
        touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
    }
]
  
  default_mines.forEach(async element => {
    element.team_id = team_id;
    element.touch_id = touch_id;
    const addDataMines = await addDefaultDataMines( 
              element
            ).then(e => {
              return e;
            });
    console.log(addDataMines);
  });

  
  return res.status(200).json({
    response: "messagetext"
  });
};
