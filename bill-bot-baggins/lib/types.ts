import { MouseEventHandler } from "react";

export type CustButtonProps = {
	btnType?: "button" | "submit";
	title: string;
	containerStyles?: string;
	handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export type PaymentProps = {
	sf_unique_id: string;
	account_name?: string;
	project_name?: string;
	payment_method?: string;
	invoice_sent_date?: string;
	invoice_due_date?: string;//due 14 days from invoice date
	payment_date?: string; //invoice_paid_date
	amount: number;
	invoice_id: string;
}

export type PaymentContProps = {

	payment_date: string;
	amount: number;
}


export type OptionProps = {
	title: string;
	value: string;
}

export type SearchFilterProps = {
	title: string;
	options: OptionProps[];
        onFilter: (value: string) => void;
}

export type SearchProps = {
	invoice_ID: string;
	setInvoice_ID: (invoice_ID: string) => void;
}

// declaring an interface to reassign AxiosResponse implicit "any" return to acess array properties

export type ServerResponse = {
	data: ServerData | PaymentProps | null;
}
type ServerData = {
	node: string;
}

export type InvoiceId = {
	invoiceId: string
}

export type Token = {
	token: string;
  };

export  type InvoiceProps = {
	node: {
	  Id: string,
	  Invoice__c: {
		value: string
	  },
	  Project_Number__c: {
		value: string | undefined
	  }
	  Invoice_Sent_Date__c: {
		value: string | undefined
	  },
	  npe01__Payment_Amount__c: {
		value: number
	  },
	  Opportunity_Account_Name__c: {
		value: string
	  },
	  npe01__Payment_Method__c: {
		value: string
	  },
	  npe01__Payment_Date__c: {
		value: string | undefined
	  },
	  npe01__Scheduled_Date__c: {
		value: string | undefined
	  }
	}
}

export type InvoiceDatas = {
	  "sf_unique_id": string,
	  "invoice_id": string,
	  "amount": number,
	  "invoice_sent_date": string,
	  "payment_date": string,
	  "invoice_due_date": string, //YYYY-MM-DD
	  "payment_method": string,
	  "project_name": string,
	  "account_name": string,
//	  "stripe_invoice_id": string
	}

export type DataArray =PaymentProps[];
