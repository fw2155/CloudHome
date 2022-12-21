import json
import boto3
import io
import botocore
# import requests


def sendses(emailadd, message):
    
    SENDER = "djd28176@gmail.com" 
    RECIPIENT = emailadd 
    print(message)
    
    AWS_REGION = "us-east-1"
    
    
    SUBJECT = "Someone is interested in your listing!"

    # The email body for recipients with non-HTML email clients.

    BODY_TEXT = message
                
    # The HTML body of the email.
    BODY_HTML = """<html>
    <head></head>
    <body>
    <h1>Don't miss out: </h1>
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
        print(response)
    # Display an error if something goes wrong.	
    except botocore.exceptions.ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
        

def lambda_handler(event, context):
    payload=json.loads(event['body'])
    
    address = payload["address"]
    renterName = payload["rentername"]
    renterEmail = payload["renteremail"]
    landlordEmail = payload["landlordemail"]
    
    message = "<p>{} is interested in your listing {}! Here is the contact of {} through this email: {}! Good luck with your sublease!</p>".format(renterName, address, renterName, renterEmail)
    recipients = landlordEmail
    
    sendses(recipients, message)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': True
        },
        'body': json.dumps('Sent to owner')
    }