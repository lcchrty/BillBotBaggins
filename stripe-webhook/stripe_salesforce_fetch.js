import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const createConfig = (method, url, data) => {
  return {
    method,
    maxBodyLength: Infinity,
    url,
    headers: {
      "X-Chatter-Entity-Encoding": "false",
      "Content-Type": "application/json",
      Authorization: process.env.SALESFORCE_TOKEN,
      Cookie: process.env.SALESFORCE_COOKIE_AUTH,
    },
    data,
  };
};

export const salesforcePaid = async (stripeId) => {
  // query to fetch the salesforce record id based on the stripeId

  let fetchData = JSON.stringify({
    query: `query payments ($stripeId: TextArea) {
        uiapi {
            query {
            npe01__OppPayment__c (where: { Stripe_Invoice_ID__c: { eq: $stripeId } }) {
                edges {
                node {
                    Id
                }
                }
            }
            }
        }
        }`,
    variables: { stripeId: stripeId },
  });

  let fetchConfig = createConfig(
    "post",
    process.env.SALESFORCE_GRAPHQL_URI,
    fetchData
  );

  const fetchedRecordData = await axios.request(fetchConfig);

  const recordId =
    fetchedRecordData.data.data.uiapi.query.npe01__OppPayment__c.edges[0].node
      .Id;

  // format date to acceptable format for salesforce
  const currentDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  // use that record id to mark the invoice at that record id as paid in salesforce and include the current date paid
  let payData = JSON.stringify({
    allowSaveOnDuplicate: false,
    fields: {
      npe01__Paid__c: true,
      npe01__Payment_Method__c: "Credit Card",
      npe01__Payment_Date__c: currentDate,
    },
  });

  let config = createConfig(
    "patch",
    proces.env.SALESFORCE_API_URI + recordId,
    payData
  );
  await axios.request(config);
};
