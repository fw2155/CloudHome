import json
import boto3
import io
# import requests

s3Client = boto3.client('s3')

def sendses(emailadd, message):
    
    SENDER = "djd28176@gmail.com" 
    RECIPIENT = emailadd 
    print(message)
    
    AWS_REGION = "us-east-1"
    
    
    SUBJECT = "Oh! we found something new! Check it out!"

    # The email body for recipients with non-HTML email clients.

    BODY_TEXT = message
                
    # The HTML body of the email.
    BODY_HTML = """<html>
    <head></head>
    <body>
    <h1>This is the most recent listing: </h1>
        """+ message+ """
    </body>
    </html>"""            

    # The character encoding for the email.
    CHARSET = "UTF-8"

    # Create a new SES resource and specify a region.
    client = boto3.client('ses',region_name='us-east-1')
    
    # Try to send the email.
    try:
        #Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
        
                        'Data': BODY_HTML
                    },
                    'Text': {
        
                        'Data': BODY_TEXT
                    },
                },
                'Subject': {

                    'Data': SUBJECT
                },
            },
            Source=SENDER
        )
    # Display an error if something goes wrong.	
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
        

def lambda_handler(event, context):
    #Get bucket and file name
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    
    #Get object
    response = s3Client.get_object(Bucket=bucket,Key=key)
    
    #Process  data
    reader = response['Body'].read().decode('utf-8')
    print(reader)
    data = json.loads(reader)
    print(data)
    
    
    
    # header = {"index" : {"_index" : "apartments", "_type":"Apartment","_id": str(data['id'])}}
    # content = {"ID" :data['id'],"FullAddress":data['address'].strip('\"'),"Address":data['address-front'],"Bedroom": str(data['bedroom']),"Price":str(data['price'])}
    # # payload = json.dumps(header)
    
    # url = 'https://search-cloudhomesublease-rqtvo6tnihljd5b4iunny2q7ci.us-east-1.es.amazonaws.com/' + 'apartments/Apartment/_bulk'
    # requests.post(url, auth = ('sublease', 'J@indong025'), json=header).json()
    # requests.post(url, auth = ('sublease', 'J@indong025'), json=content).json()
    
    email = data["contact"]
    apt_address = data['address']
    num_bedroom = data['bedroom']
    num_bathroom = data['bathroom']
    apt_endDate = data['endDate']
    apt_contact = data['contact']
    apt_price = data['price']
    apt_note = data['other']
            
    message = "<p>{}b{}b, located at {}, with price: ${}. You can contact the owner of the listing house through this email: {}. Also, these are some extra infos for the house: {} </p>".format(num_bedroom, num_bathroom, apt_address,apt_price, apt_contact, apt_note)
    # recipients = "zz3523@nyu.edu"
    
    ses_client = boto3.client("ses", region_name="us-east-1")
    email_list = ses_client.list_verified_email_addresses()['VerifiedEmailAddresses']
    print(email_list)
    
    for i in email_list:
        sendses(i, message)
        print(i)