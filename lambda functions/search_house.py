from requests.auth import HTTPBasicAuth
from botocore.exceptions import ClientError
import json
import urllib3
import random
import boto3
import os
import requests
import logging

import pymysql

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


#RDS
endpoint = "sublease-db.cowre0y5eh87.us-east-1.rds.amazonaws.com"
user = "admin"
password = '12345678'
dbname = "sublease_schema"
connection = pymysql.connect(
    host=endpoint, user=user, passwd=password, db=dbname)
print('connected to SQL!')

#ElasticSearch
URL = 'https://search-cloudhome-lzmdqlyhdunmzuo3pflo7d6tzi.us-east-1.es.amazonaws.com'
username = 'cloudhome'
password = 'J@indong025'

dynamo_client = boto3.client('dynamodb')
CHARSET = "UTF-8"


def lambda_handler(event, context):
    # print(event)

    aptInfo = event["queryStringParameters"]["q"]
    headers = event['headers']
    # print(aptInfo)
    # print(headers)
    if headers and 'isgeneral' in headers:
        if headers['isgeneral'] == 'general':
            payload = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "Address": aptInfo
                                }
                            }
                        ]
                    }
                }
            }
            url = 'https://search-cloudhome-lzmdqlyhdunmzuo3pflo7d6tzi.us-east-1.es.amazonaws.com/' + \
                'apartments/Apartment/_search'
            data = requests.get(url, auth=(
                'cloudhome', 'J@indong025'), json=payload).json()  # .content.decode()
            # print(data)
            try:
                dataFromES = data["hits"]["hits"]
                houseArr = []
                for each in dataFromES:
                    house = each['_source']
                    houseArr.append(house)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT',
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Credentials': True
                    },
                    'body': json.dumps({"results": houseArr})
                }
            except KeyError:
                logger.debug("Error extracting hits from ES response")
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT',
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Credentials': True
                    },
                    'body': json.dumps('Sorry, no result!')
                }
        elif headers['isgeneral'] == 'sublease':

            cursor = connection.cursor()

            sql = "SELECT * FROM info WHERE city LIKE '%{}%' OR address LIKE '%{}%' OR zipcode LIKE '%{}%' OR other LIKE '%{}%'".format(
                aptInfo, aptInfo, aptInfo, aptInfo)
            cursor.execute(sql)
            rows = cursor.fetchall()
            houseArr = []
            keys = ('city', 'address', 'zipcode', 'bedrooms', 'bathroom', 'startDate', 'endDate', 'contact', 'price', 'other')
            print(rows)
            for row in rows:
                dict_item = dict(zip(keys, row))
                if not isinstance(dict_item['startDate'], str):
                    dict_item['startDate'] = dict_item['startDate'].strftime('%Y-%m-%d')
                if not isinstance(dict_item['endDate'], str):
                    dict_item['endDate'] = dict_item['endDate'].strftime('%Y-%m-%d')
                if not isinstance(dict_item['price'], str):
                    dict_item['price'] = str(dict_item['price'])
                houseArr.append(dict_item)
            print(houseArr)
            return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT',
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Credentials': True
                    },
                    'body': json.dumps({"results": houseArr})
                }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': True
        },
        'body': json.dumps('Hello from Lambda!')
    }
