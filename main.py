import turnkey_sdk
from turnkey_sdk.auth import EmailAuth, OAuth

# Initialize Turnkey SDK with your Private Key
private_key = 'e525bf29-5f4b-4323-90b2-f438f827a648'
turnkey = turnkey_sdk.init(private_key=private_key)

# Set up authentication
email_auth = EmailAuth(email='user@example.com')
oauth_auth = OAuth(client_id='YOUR_CLIENT_ID', client_secret='YOUR_CLIENT_SECRET')

# Create a Wallet
wallet = turnkey.create_wallet(auth=email_auth)
print("Wallet created:", wallet)
