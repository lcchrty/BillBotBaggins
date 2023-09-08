const grpc = require("@grpc/grpc-js");
const fs = require("fs");
const jsforce = require("jsforce");
const avro = require("avro-js");

const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("pubsub_api.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const sfdcPackage = grpcObj.eventbus.v1;
// const root_cert = fs.readFileSync("roots.cer");

const conn = new jsforce.Connection({
  loginUrl: "https://escsocal--lc001.sandbox.my.salesforce.com",
});
const connectionResult = async () => await conn.login(username, password);
const orgId = connectionResult.organizationId;
const metaCallback = (_params, callback) => {
  const meta = new grpc.Metadata();
  meta.add("accesstoken", conn.accessToken);
  meta.add("instanceurl", conn.instanceUrl);
  meta.add("tenantid", orgId);
  callback(null, meta);
};
const callCreds = grpc.credentials.createFromMetadataGenerator(metaCallback);
// const combCreds = grpc.credentials.combineChannelCredentials(
//   grpc.credentials.createSsl(root_cert),
//   callCreds
// );
const client = new sfdcPackage.PubSub(
  "api.pilot.pubsub.salesforce.com:7443",
  combCreds
);

const topicName = "/event/Your_Custom_event__e";
let schemaId = "";
let schema;
client.GetTopic({ topicName: topicName }, (err, response) => {
  if (err) {
    //throw error
  } else {
    //get the schema information
    schemaId = response.schemaId;
    client.GetSchema({ schemaId: schemaId }, (error, res) => {
      if (error) {
        //handle error
      } else {
        schema = avro.parse(res.schemaJson);
      }
    });
  }
});

const subscription = client.Subscribe(); //client here is the grpc client.
//Since this is a stream, you can call the write method multiple times.
//Only the required data is being passed here, the topic name & the numReqested
//Once the system has received the events == to numReqested then the stream will end.
subscription.write({
  topicName: "/event/Your_platform_event__e",
  numRequested: 10,
});
//listen to new events.
subscription.on("data", function (data) {
  console.log("data => ", data);
  //data.events is an array of events. Below I am just parsing the first event.
  //Please add the logic to handle mutiple events.
  if (data.events) {
    const payload = data.events[0].event.payload;
    let jsonData = schema.fromBuffer(payload); //this schema is the same which we retreived earlier in the GetSchema rpc.
    console.log("Event details ==> ", jsonData);
  } else {
    //if there are no events then every 270 seconds the system will keep publishing the latestReplayId.
  }
});
subscription.on("end", function () {
  console.log("ended");
});
subscription.on("error", function (err) {
  console.log("error", JSON.stringify(err)); //handle errors
});
subscription.on("status", function (status) {
  console.log("status ==> ", status);
});

const dataToPublish = {
  Some_Text_Field__c: { string: "Test" },
  Another_Boolean_Field__c: { boolean: false },
  CreatedDate: new Date().getTime(), //This is Required
  CreatedById: "0057X000003ilJfQAI", //Id of the current user. This is required.
};
client.Publish(
  {
    topicName: "/event/Your_Custom_Event__e",
    events: [
      {
        id: "124", // this can be any string
        schemaId: schemaId, //This is the same schemaId that we retrieved earlier.
        payload: schema.toBuffer(dataToPublish), //The schema here is the avro generated schema
      },
    ],
  },
  function (err, response) {
    if (err) {
      console.log("error from publishing ", err);
    } else {
      console.log("Response ", response);
    }
  }
);
