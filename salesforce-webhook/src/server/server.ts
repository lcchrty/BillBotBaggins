import express from 'express'
import salesforceController from './salesforce-pub-sub-api'


const app = express();
app.use(express.json());

/**
 * open salesforce pub-sub API connection
 */
salesforceController.run()
// app.use()

app.listen(3030, () => console.log('server is listening on port 3030'));