import pymysql
import json
import boto3
import time
import random
import string


endpoint = "sublease-db.cowre0y5eh87.us-east-1.rds.amazonaws.com"
user = "admin"
password = '12345678'
dbname = "sublease_schema"


connection = pymysql.connect(host=endpoint, user=user, passwd=password, db=dbname)

sql = """insert into `info` (city, address, zipcode, numberOfBedrooms, numberOfBathrooms, startDate, endDate, contact, price, other)
         values (%s, %s, %s, %s, %s, %s, %s,%s, %s, %s) 
    """


def generate_unique_filename():
    timestamp = str(time.time())
    random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    return f"{timestamp}-{random_string}.json"

def lambda_handler(event, context):
    payload=json.loads(event['body'])
    
    s3 = boto3.client('s3')
    bucket_name = 'cloud-home-sublease'
    
    file_name = generate_unique_filename()
        
    s3.put_object(Bucket=bucket_name, Key=file_name, Body=json.dumps(payload))
    
    
    
    
    # print(event)
    
    params = (
        payload['city'],
        payload['address'],
        payload['zipcode'],
        int(payload['bedroom']),
        int(payload['bathroom']),
        payload['startDate'],
        payload['endDate'],
        payload['contact'],
        int(payload['price']),
        payload['other']
    )
    # print(params)
    try:
        cursor = connection.cursor()
        # cursor.execute('SELECT * from info')
        # rows = cursor.fetchall()
        cursor.execute(sql,params)
        connection.commit()
        cursor.execute('SELECT * from info')
        rows = cursor.fetchall()
        print(rows)
    except ClientError as e:
        print(e)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True
        },
        'body': json.dumps('Hello to Lambda!')
    }
