const { GraphQLClient } = require("graphql-request");
const bcrypt = require("bcrypt");

const client = new GraphQLClient(process.env.MARKETING_CHECK_BILPP_HASURA_URL, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
  }
});

const register = async (email, password) => {
  const variables = {
    email,
    password
  };
  const salt = await bcrypt.genSalt(10);
  variables.password = await bcrypt.hash(variables.password, salt);
  const query = `mutation userRegister($email: String, $password: String) {
    result: insert_users_one(object: {email: $email, password: $password, team: {data: {name: "My Team"}}}, on_conflict: {constraint: users_email_key}) {
      id
      team_id
      role
      status
      email
    }
  }`;
  let result = await client
    .request(query, variables)
    .then(data => {
      return data.result;
    })
    .catch(err => {
      return err;
    });
  return result;
};

const login = async (email, password) => {
  const variables = {
    email
  };
  const query = `query userLogin($email: String) {
    result: users(where: {email: {_eq: $email}}) {
      id
      team_id
      email,
      password
    }
  }`;
  let result = await client
    .request(query, variables)
    .then(data => {
      if (data.result) {
        return data.result[0];
      }
      return null;
    })
    .catch(err => {
      return err;
    });
  return result;
};

exports.register = register;
exports.login = login;
exports.verify = register;
exports.client = client;
