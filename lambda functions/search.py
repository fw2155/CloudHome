import json
import boto3
import requests
import pymysql
import json
import boto3
import time
import random
import string
import pandas as pd
from heapq import heappush, heappop
from dataclasses import dataclass, field
from typing import Any

@dataclass(order=True)
class PrioritizedItem:
    priority: int
    item: Any=field(compare=False)
    
def sendses(emailadd, message):
    
    SENDER = "djd28176@gmail.com" 
    RECIPIENT = emailadd 
    print(message)
    
    AWS_REGION = "us-east-1"
    
    
    SUBJECT = "Hey This is your apartment suggestions!!"

    # The email body for recipients with non-HTML email clients.

    BODY_TEXT = message
                
    # The HTML body of the email.
    BODY_HTML = """<html>
    <head></head>
    <body>
    <h1>Hey This is your apartment suggestions: </h1>
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

def sendsesInvaild(emailadd):
    
    SENDER = "djd28176@gmail.com" 
    RECIPIENT = emailadd 

    AWS_REGION = "us-east-1"
    
    SUBJECT = "Sorry, we couldn't find the place that your looking for."

    # The email body for recipients with non-HTML email clients.

    BODY_TEXT = '<p> Sorry, no matches were found for your needs. </p>'
                
    # The HTML body of the email.
    BODY_HTML = """<html>
    <body>
        <p>Sorry, we couldn't find the place that your looking for. </p>
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
        
        
def search(bedroom,price,apt_type):
    payload = {
        "query": {
            "bool": {
                "must": [
                    {
                    "match":{
                        "Bedroom": str(bedroom)
                    }
                    },
                    {
                    "match":{
                        "Type": str(apt_type)
                    }
                    },
                    {
                    "range":{
                        "Price" : {
                            "lte" : int(price)
                        }
                    }
                    }
                ]
            }
        }
    }
    url = 'https://search-cloudhome-lzmdqlyhdunmzuo3pflo7d6tzi.us-east-1.es.amazonaws.com/' + 'apartments/Apartment/_search?size=1000'
    data = requests.get(url, auth = ('cloudhome', 'J@indong025'), json=payload).json()#.content.decode()
    #data = es.search(index="restaurants", body={"query": {"match": {'Cuisine':cuisine}}})
    # print("search complete", data.get('hits').get('hits'))#['hits']['hits'])
    return data['hits']['hits']

def searchSublist(bedroom,price):
    payload = {
        "query": {
            "bool": {
                "must": [
                    {
                    "match":{
                        "Bedroom": str(bedroom)
                    }
                    },
                    {
                    "range":{
                        "Price" : {
                            "lte" : int(price)
                        }
                    }
                    }
                ]
            }
        }
    }
    url = 'https://search-cloudhomesublease-rqtvo6tnihljd5b4iunny2q7ci.us-east-1.es.amazonaws.com/' + 'apartments/Apartment/_search'
    data = requests.get(url, auth = ('sublease', 'J@indong025'), json=payload).json()
    print("search complete", data.get('hits').get('hits'))#['hits']['hits'])
    return data['hits']['hits']

def get_apt_data(ids):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('apartment')
    ans = '<p> These are our recommendations for general search: </p>'
    i = 1
    pq_insertion_order = []
    
    for id in ids:
        response = table.get_item(
            Key={
                'id': id
            }
        )
        # print(response)
        response_item = response.get("Item")
        # print(response_item)
    
        
        apt_address = response_item['formattedAddress']
        num_bedroom = response_item['bedrooms']
        num_bathroom = response_item['bathrooms']
        apt_price = response_item['price']
        apt_type = response_item['propertyType']
        apt_distance = response_item['distanceToSchool']
        
        res = "{}b{}b, located at {}, with price: ${}. It's a {} and the distance to school is {} miles.".format(num_bedroom, num_bathroom, apt_address,apt_price, apt_type, apt_distance)
        
        heappush(pq_insertion_order, PrioritizedItem(-float(apt_distance),res))
        if (len(pq_insertion_order) >10):
            heappop(pq_insertion_order)
    
    lst = []
    for index in range(len(pq_insertion_order),0,-1):
        lst.append("<p>{}. {}</p>".format(index, heappop(pq_insertion_order).item))
    lst.reverse()
    for l in lst:
        ans += l
    
    print(ans)
    return ans 

# def get_apt_data(ids):
#     dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
#     table = dynamodb.Table('apartment')
#     ans = '<p> These are our recommendations for general search: </p>'
#     i = 1
    
#     for id in ids:
#         if i<=3:
#             response = table.get_item(
#                 Key={
#                     'id': id
#                 }
#             )
#             print(response)
#             response_item = response.get("Item")
#             print(response_item)

            
#             apt_address = response_item['formattedAddress']
#             num_bedroom = response_item['bedrooms']
#             num_bathroom = response_item['bathrooms']
#             apt_price = response_item['price']
#             apt_type = response_item['propertyType']
#             apt_distance = response_item['distanceToSchool']
            
#             ans += "<p>{}. {}b{}b, located at {}, with price: ${}. It's a {} and the distance to school is {} miles.</p>".format(i, num_bedroom, num_bathroom, apt_address,apt_price, apt_type, apt_distance)
#             # return ans
#             i += 1
#         else:
#             break
    
#     print(ans)
#     return ans 
    
# def get_sublease_data(ids):
#     dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
#     table = dynamodb.Table('cloud-sublease')
#     ans = '<p> These are our recommendations for sublease: </p>'
#     i = 1
    
#     for id in ids:
#         if i<=3:
#             response = table.get_item(
#                 Key={
#                     'id': id
#                 }
#             )
#             print(response)
#             response_item = response.get("Item")
#             print(response_item)

            
#             apt_address = response_item['address']
#             num_bedroom = response_item['bedroom']
#             num_bathroom = response_item['bathroom']
#             apt_endDate = response_item['endDate']
#             apt_contact = response_item['contact']
#             apt_price = response_item['price']
#             apt_note = response_item['other']
            
#             ans += "<p>{}. {}b{}b, located at {}, with price: ${}. You can contact the owner of the listing house through this email: {}. Also, these are some extra infos for the house: {} </p>".format(i, num_bedroom, num_bathroom, apt_address,apt_price, apt_contact, apt_note)
#             # return ans
#             i += 1
#         else:
#             break
    
#     print(ans)
#     return ans

    
def lambda_handler(event, context):
    
    print(event)
    message = event['Records'][0]['messageAttributes']
    print("check")
    print(message)
        
    if 'NeedsType' in message:
        try:
            print("Long term infos: ")
            num_bedroom = message['RoomType']['stringValue']
            apt_price = message['Spend']['stringValue']
            apt_type = message['NeedsType']['stringValue']
            contact_email = message['EmailAdd']['stringValue']
            
            ids = search(num_bedroom,apt_price,apt_type)
            ids = list(map(lambda x: x['_source']['ID'], ids))
            print("check ID")
            print(ids)
            if (ids == []):
                print("empty ids!!!")
                sendsesInvaild(contact_email)
            else:
                rest_details = get_apt_data(ids)
                sendses(contact_email, rest_details)
        except Exception as e:
            print(e)
        return {
            'statusCode': 200,
            'body': json.dumps('Hello from Lambda LF2!')
        }
    else:
        try:
            print("Short term infos: ")
            num_bedroom = message['RoomType']['stringValue']
            apt_price = message['Spend']['stringValue']
            contact_email = message['EmailAdd']['stringValue']
    
            endpoint = "sublease-db.cowre0y5eh87.us-east-1.rds.amazonaws.com"
            user = "admin"
            password = '12345678'
            dbname = "sublease_schema"
            connection = pymysql.connect(host=endpoint, user=user, passwd=password, db=dbname)

            params = (
                int(num_bedroom),
                int(apt_price)
            )
            sql = """select * 
                     from info
                     where %s = numberOfBedrooms 
                     AND %s > price
                """
                
            cursor= connection.cursor()
            cursor.execute(sql,params)
            rows = cursor.fetchall()
            # print(rows)
            df = pd.DataFrame(rows,columns=['city','address','zipcode','bedroom','bathroom','start','end','phone','price','info'])
            
            
            if (len(rows) == 0):
                print("empty ids!!!")
                sendsesInvaild(contact_email)
            else:
                print("match founded in rds!!!!!!")
                print(rows)
                ans = '<p> These are our recommendations for sublease: </p>' 
                for index, row in df.iterrows():
                  ans += "<p>{}. {}b{}b, located at {}, with price: ${}. You can contact the owner of the listing house through this email: {}. Also, these are some extra infos for the house: {} </p>".format(index+1, row['bedroom'], row['bathroom'], row['address'],row['price'], row['phone'], row['info'])
                    
                sendses(contact_email, ans)
                
        except Exception as e:
            print(e)
        return {
            'statusCode': 200,
            'body': json.dumps('Hello from Lambda LF2!')
        }
        
