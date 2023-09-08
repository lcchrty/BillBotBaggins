
// declaring an ype to reassign AxiosResponse implicit "any" return to acess array properties

export type ServerResponse = {
	data: ServerData | null;
}
type ServerData = {
	node: string[];
}


/**
 * type reference for object received from salesforce and stored in redis cache
 * see below, will also need to be updated
 */

export type rawInvoiceData = {
	node: {
		Id: string,
		Invoice__c: { value: string },
		Invoice_Sent_Date__c: { value: string },
		npe01__Payment_Amount__c: { value: number },
		Opportunity_Account_Name__c: { value: string },
		Opportunity_18_Digit_ID__c: { value: string },
		npe01__Payment_Method__c: { value: string },
		npe01__Payment_Date__c: { value: string }
	}
}


/**
 * type reference for object retrieved and mapped from redis cache
 * should update to store this in redis on salesforce call instead of retrieving and mapping 
 */

export type invoiceData = {
	unique_invoice_id: string,
	invoice_number: string,
	invoice_amount: number,
	invoice_sent_date: string,
	invoice_paid_date: string,
	payment_method: string,
	opportunity_unique_id: string,
	account_name: string
}
