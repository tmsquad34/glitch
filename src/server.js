const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const balances = require("./balances");
const customers = require("./customers");

const cards = require("./cards");
const insert_card = require("./insert-card");
const insert_customer = require("./insert-customer");
const insert_activities = require("./insert-activities");

const contact_audiences = require("./contact-audiences");

const delete_card = require("./delete-card");

const form_default_mines = require("./form-default-mines");

const retrieve_card = require("./retrieve-card");
const insert_invoice = require("./insert-invoice");
const insert_charge = require("./insert-charge");

const new_user_notify = require("./new-user-notify");
const new_team_customer = require("./new-team-customer");
const new_team_notify = require("./new-team-notify");
const new_touch_notify = require("./new-touch-notify");
const new_sender_notify = require("./new-sender-notify");

const contact_hub = require("./contact-hub");
const notification_hub = require("./notification-hub");

const marketing_check = require("./marketing-check");
const data_counts = require("./data_counts");

const media_upload = require("./media-upload");
const import_contact = require("./import-contact");

const iot = require("./iot");

const send_notify = require("./send-notify");

const template_render = require("./template-render");
const test_pagination = require("./test-pagination");
const touch_default_mines = require("./touch-default-mines");

const help_mail = require("./help-mail");

const auth = require("./auth");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/balances", balances.index);
app.post("/customer_by_pk", customers.index);

app.post("/cards", cards.index);
app.post("/insert-card", insert_card.index);
app.post("/insert-activities", insert_activities.index);
app.post("/card-delete", delete_card.index);
app.post("/card-retrieve", retrieve_card.index);
app.post("/contact-audiences", contact_audiences.index);

app.post("/form-default-mines", form_default_mines.index);

app.post("/insert-customer", insert_customer.index);
app.post("/insert-charge", insert_charge.index);
app.post("/insert-invoice", insert_invoice.index);

app.post("/new-user-notify", new_user_notify.index);
app.post("/new-team-notify", new_team_notify.index);
app.post("/new-team-customer", new_team_customer.index);
app.post("/new-touch-notify", new_touch_notify.index);
app.post("/new-sender-notify", new_sender_notify.index);

app.post("/contact-hub", contact_hub.index);
app.post("/notification-hub", notification_hub.index);

app.post("/marketing-check", marketing_check.index);
app.post("/data-counts", data_counts.index);

app.post("/media-upload", media_upload.index);
app.post("/import-contact", import_contact.index);
app.post("/send-notify", send_notify.index);

app.post("/template-render", template_render.index);
app.post("/test-pagination", test_pagination.index);
app.post("/touch-default-mines", touch_default_mines.index);

app.post("/help-mail", help_mail.index);

app.all("/iot", iot.index);

app.post("/auth/login", auth.login);
app.post("/auth/register", auth.register);
app.post("/auth/verify", auth.verify);
app.post("/auth/webhook", auth.webhook);
app.post("/auth/me", auth.me);

app.listen(PORT);
