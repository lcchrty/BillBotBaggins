import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";


export async function POST(req) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let data = await req.json()
    let invoice = data.invoiceId
    console.log('data sent to checkout session is: ', invoice)
 
    // const data = {clientSecret: paymentIntent.client_secret,}
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: invoice.amount_due,  
            product_data: {
              // name: invoice.id
              name: `Invoice ${invoice.id}`
            }
          }, 
          quantity: 1,
        }
      ],
      mode: 'payment',
      // customer: id add customer ID for easier checkout for returning customer
      // invoice_creation: true,
      success_url: 'http://localhost:3000/success', //redirect to sucessfully paid invoice with button to download  page
      cancel_url: 'http://localhost:3000' // redirect to homepage when cancelled

    })
    return NextResponse.json(session.url)

};