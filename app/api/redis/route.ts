// NextRequest object from next server
import { NextRequest, NextResponse } from "next/server";
// import client object to interact with redis and DB connection function from our redis.ts file
import { client, redisConnect } from "../../../lib/redis";

import { invoiceData, rawInvoiceData } from "@/app/types";

/* 
 * GET request for retrieving invoice data from redis cache
*/
export const GET = async (req: NextRequest): Promise<NextResponse | undefined> => {
	try {
		await redisConnect() //open redis connection on hot reload

		/**
		 * retrieve caches invoice records from redisDB
		 * need to update to account for new storage key-value pair where organziation anme is key and invoice data is value with each invoice store as an object in the array
		 */

		const cachedInvoicesParse = await client.get("newest invoices")

		// type check for if what returns from client.get is a string to account for potential null
		if (typeof cachedInvoicesParse === 'string') {
			// parse string
			const parsed = JSON.parse(cachedInvoicesParse);
			// map to new object sorted for ease of data access
			const cachedInvoices = parsed.map((element: rawInvoiceData): invoiceData => {
				// destructure assignment for node object
				const { Id, Invoice__c, Invoice_Sent_Date__c, npe01__Payment_Amount__c, Opportunity_Account_Name__c, Opportunity_18_Digit_ID__c, npe01__Payment_Method__c, npe01__Payment_Date__c } = element.node
				// return sorted object
				return ({
					unique_invoice_id: Id,
					invoice_number: Invoice__c.value,
					invoice_amount: npe01__Payment_Amount__c.value,
					invoice_sent_date: Invoice_Sent_Date__c.value,
					invoice_paid_date: npe01__Payment_Date__c.value,
					payment_method: npe01__Payment_Method__c.value,
					opportunity_unique_id: Opportunity_18_Digit_ID__c.value,
					account_name: Opportunity_Account_Name__c.value
				})
			})
			console.log("cachedInvoices", cachedInvoices)
			return new NextResponse(JSON.stringify(cachedInvoices))
		}
		return new NextResponse('No new invoices to report');
	}
	catch (err) {
		console.log(err)
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}