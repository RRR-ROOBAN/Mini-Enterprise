import stripe
import os

stripe.api_key = os.getenv(

"STRIPE_SECRET_KEY"

)


def create_payment(

    amount

):

    intent=stripe.PaymentIntent.create(

        amount=

        int(

        amount*100

        ),

        currency="usd"

    )

    return{

        "client_secret":

        intent.client_secret

    }