const fetch = require("node-fetch");
const { render } = require("template-file");

async function getTemplate(template_id) {
  const getTemplate = `
    query getTemplate($template_id: uuid = "") {
    templates(where: {id: {_eq: $template_id}}) {
      content
      attributes
    }
  }`;
  const graphqlReq = {
    query: getTemplate,
    variables: { template_id: template_id }
  };

  const template = await fetch(process.env.MARKETING_CHECK_BILPP_HASURA_URL, {
    method: "POST",
    body: JSON.stringify(graphqlReq),
    headers: {
      "content-type": process.env.CONTENT_TYPE,
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        return data;
      }
      return data.data.templates[0].content;
    });

  return template;

  err => {
    return err.message;
  };
}

async function getFormsAttributes(form_id) {
  const getFormsAttributes = `
  query getFormsAttributes($form_id: uuid = "") {
  forms(where: {id: {_eq: $form_id}}) {
    form_questions {
      attributes
    }
  }
}`;
  const graphqlReq = {
    query: getFormsAttributes,
    variables: { form_id: form_id }
  };

  const form_attributes = await fetch(
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
      if (data.errors) {
        return data;
      }
      return data.data.forms[0].form_questions[0].attributes;
    });

  return form_attributes;

  err => {
    return err.message;
  };
}

exports.index = async function(req, res) {
  const { object } = req.body.input;
  const { template_id, form_id, variables } = object;
  const template = await getTemplate(template_id);

  var content = "";
  if (variables != undefined) {
    template[0].attributes = variables.template
    for (let item of template) {
      var render_response = render(item.content, item.attributes);
      content += render_response + " ";
    }
    delete variables.template
    console.log("*****",variables);
    content = render(content,variables)
  } else {
    if (form_id == undefined) {
      if (template.errors) {
        return res.status(400).json({
          message: "no such template id"
        });
      }
      for (let item of template) {
        var render_response = render(item.content, item.attributes);
        content += render_response + " ";
      }
    }

    if (form_id != undefined) {
      const form_attributes = await getFormsAttributes(form_id);
      if (form_attributes.errors) {
        return res.status(400).json({
          message: "no such form id"
        });
      }
      for (let item of template) {
        var render_response = render(item.content, form_attributes);
        content += render_response + " ";
      }
    }
  }

  return res.json({
    content: content
  });
};
