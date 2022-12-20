import json
import datetime
import time
import os
import dateutil.parser
import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


# --- Helpers that build all of the responses ---

def get_slots(intent_request):
    return intent_request['currentIntent']['slots']

def elicit_slot(session_attributes, intent_name, slots, slot_to_elicit, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message
        }
    }


def confirm_intent(session_attributes, intent_name, slots, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intent_name,
            'slots': slots,
            'message': message
        }
    }


def close(session_attributes, fulfillment_state, message):
    response = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return response


def delegate(session_attributes, slots):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }


# --- Helper Functions ---


def safe_int(n):
    """
    Safely convert n value to int.
    """
    if n is not None:
        return int(n)
    return n


def try_ex(func):
    """
    Call passed in function in try block. If KeyError is encountered return None.
    This function is intended to be used to safely access dictionary.

    Note that this function would have negative impact on performance.
    """

    try:
        return func()
    except KeyError:
        return None


def isvalid_room_type(room_type):
    
    return float(room_type) <= 6 and float(room_type) >= 0


def isvalid_date(date):
    try:
        dateutil.parser.parse(date)
        return True
    except ValueError:
        return False
        
def parse_int(n):
    try:
        return int(n)
    except ValueError:
        return float('nan')

def get_day_difference(later_date, earlier_date):
    later_datetime = dateutil.parser.parse(later_date).date()
    earlier_datetime = dateutil.parser.parse(earlier_date).date()
    return abs(later_datetime - earlier_datetime).days


def add_days(date, number_of_days):
    new_date = dateutil.parser.parse(date).date()
    new_date += datetime.timedelta(days=number_of_days)
    return new_date.strftime('%Y-%m-%d')


def build_validation_result(isvalid, violated_slot, message_content):
    if message_content is None:
        return {
            "isValid": isvalid,
            "violatedSlot": violated_slot,
        }
    return {
        'isValid': isvalid,
        'violatedSlot': violated_slot,
        'message': {'contentType': 'PlainText', 'content': message_content}
    }


def validate_sub(room_type, location, monthly_spend, checkin_date, checkout_date, email):
    # nights = safe_int(try_ex(lambda: slots['Nights']))
    # room_type = try_ex(lambda: slots['RoomType'])
    # location = try_ex(lambda: slots['AreaType'])
    # monthly_spend = try_ex(lambda: slots['Spend'])
    # checkin_date = try_ex(lambda: slots['CheckInDate'])
    # checkout_date = try_ex(lambda: slots['CheckOutDate'])
    # email = try_ex(lambda: slots['EmailAdd'])
    valid_cities = ['new york', 'ny', 'nyc','new york city']
    if location is not None and location.lower() not in valid_cities:
        return build_validation_result(
            False,
            'AreaType',
            'Sorry we currently only support apartment in NYC area.'
        )

    if checkin_date:
        if not isvalid_date(checkin_date):
            return build_validation_result(False, 'CheckInDate', 'I did not understand your check in date.  When would you like to check in?')
        if datetime.datetime.strptime(checkin_date, '%Y-%m-%d').date() <= datetime.date.today():
            return build_validation_result(False, 'CheckInDate', 'Reservations must be scheduled at least one day in advance.  Can you try a different date?')

    if checkout_date is not None and (parse_int(checkout_date)  < 1):
        return build_validation_result(
            False,
            'CheckOutDate',
            'The number of days cannot be less than 1, please enter a invalid number of days. How many days would you like to stay for?'
        )
    
    if monthly_spend is not None and (parse_int(monthly_spend) < 1600):
        return build_validation_result(
            False,
            'Spend',
            'There are no apartments below $1600 near the New York area, please re-enter your price.'
        )

    if room_type and not isvalid_room_type(room_type):
        return build_validation_result(False, 'RoomType', 'I did not recognize that room type.  We only have bedrooms number less than 6. Please type in an valid number.')

    if email is not None:
        ses_client = boto3.client("ses", region_name="us-east-1")
        email_list = ses_client.list_verified_email_addresses()['VerifiedEmailAddresses']
        print(email_list)
        if email not in email_list:
            response = ses_client.verify_email_identity(EmailAddress = email)
            return build_validation_result(False,
                                          'EmailAdd',
                                          'Please valid your email address and input the email address again.'
                                          )


    return {'isValid': True}

def validate_apt(room_type, location, monthly_spend, checkin_date, checkout_date, needs, email):
    valid_needs = ['close', 'luxury','budget']
    valid_cities = ['new york', 'ny', 'nyc','new york city']
    
    if needs is not None and needs.lower() not in valid_needs:
        return build_validation_result(
            False,
            'NeedsType',
            'Invaild input, please select close, luxury Or budget.'
        )
        
    if location is not None and location.lower() not in valid_cities:
        return build_validation_result(
            False,
            'AreaType',
            'Sorry we currently only support apartment in NYC area.'
        )

    if checkin_date:
        if not isvalid_date(checkin_date):
            return build_validation_result(False, 'CheckInDate', 'I did not understand your check in date.  When would you like to check in?')
        if datetime.datetime.strptime(checkin_date, '%Y-%m-%d').date() <= datetime.date.today():
            return build_validation_result(False, 'CheckInDate', 'Reservations must be scheduled at least one day in advance.  Can you try a different date?')

    if checkout_date is not None and (parse_int(checkout_date)  < 1):
        return build_validation_result(
            False,
            'CheckOutDate',
            'The number of days cannot be less than 1, please enter a invalid number of days. How many days would you like to stay for?'
        )
    
    if monthly_spend is not None and (parse_int(monthly_spend) < 1600):
        return build_validation_result(
            False,
            'Spend',
            'There are no apartments below $1600 near the New York area, please re-enter your price.'
        )

    if room_type and not isvalid_room_type(room_type):
        return build_validation_result(False, 'RoomType', 'I did not recognize that room type. We only have bedrooms number less than 6. Please type in an valid number.')

    if email is not None:
        ses_client = boto3.client("ses", region_name="us-east-1")
        email_list = ses_client.list_verified_email_addresses()['VerifiedEmailAddresses']
        print(email_list)
        if email not in email_list:
            response = ses_client.verify_email_identity(EmailAddress = email)
            return build_validation_result(False,
                                          'EmailAdd',
                                          'Please valid your email address and input the email address again.'
                                          )


    return {'isValid': True}



""" --- Functions that control the bot's behavior --- """


def book_apt(intent_request):
    """
    Performs dialog management and fulfillment for booking a hotel.

    Beyond fulfillment, the implementation for this intent demonstrates the following:
    1) Use of elicitSlot in slot validation and re-prompting
    2) Use of sessionAttributes to pass information that can be used to guide conversation
    """
    room_type = get_slots(intent_request)['RoomType']
    location = get_slots(intent_request)['AreaType']
    monthly_spend = get_slots(intent_request)['Spend']
    checkin_date = get_slots(intent_request)['CheckInDate']
    checkout_date = get_slots(intent_request)['CheckOutDate']
    needs = get_slots(intent_request)['NeedsType']
    email = get_slots(intent_request)['EmailAdd']


    if intent_request['invocationSource'] == 'DialogCodeHook':
        # Validate any slots which have been specified.  If any are invalid, re-elicit for their value
        validation_result = validate_apt(room_type, location, monthly_spend, checkin_date, checkout_date,needs, email)
        slots = get_slots(intent_request)

        if not validation_result['isValid']:
                    slots[validation_result['violatedSlot']] = None
                    return elicit_slot(intent_request['sessionAttributes'],
                                    intent_request['currentIntent']['name'],
                                    slots,
                                    validation_result['violatedSlot'],
                                    validation_result['message'])

        output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}

        return delegate(output_session_attributes, get_slots(intent_request))

    if intent_request['invocationSource'] == 'FulfillmentCodeHook':
        sqs_client = boto3.client("sqs", region_name="us-east-1")
        queue_url = sqs_client.get_queue_url(QueueName='diningSug.fifo')['QueueUrl']

        response = sqs_client.send_message(
            QueueUrl = queue_url,
            MessageAttributes={
                "RoomType": {
                      'DataType' : 'Number',
                      'StringValue' : room_type
                  },
                  "AreaType": {
                      'DataType' : 'String',
                      'StringValue' : location
                  },
                  "Spend": {
                      'DataType' : 'Number',
                      'StringValue' : monthly_spend
                  },
                  'CheckInDate':{
                    'DataType' :'String',
                    'StringValue' : checkin_date

                  },
                  'CheckOutDate':{
                    'DataType' :'Number',
                    'StringValue' : checkout_date

                  },
                  'NeedsType': {
                    'DataType' : 'String',
                    'StringValue' : needs
                  },
                  "EmailAdd": {
                      'DataType' : 'String',
                      'StringValue' : email
                  }
            },
            MessageBody='string',
            MessageDeduplicationId='string',
            MessageGroupId='string'
        )
        print("test001")
        
        
        return close(intent_request['sessionAttributes'],
             'Fulfilled',
             {'contentType': 'PlainText',
              'content': 'Thank you, I will now sending the apartment information to your email address at: {}.  Let me know if you need anything else.'.format(email)})

def book_sub(intent_request):

    room_type = get_slots(intent_request)['RoomType']
    location = get_slots(intent_request)['AreaType']
    monthly_spend = get_slots(intent_request)['Spend']
    checkin_date = get_slots(intent_request)['CheckInDate']
    checkout_date = get_slots(intent_request)['CheckOutDate']
    email = get_slots(intent_request)['EmailAdd']


    # session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}

    # reservation = json.dumps({
    #     'RoomType': room_type,
    #     'AreaType': location,
    #     'Spend': monthly_spend,
    #     'CheckInDate': checkin_date,
    #     'CheckOutDate': checkout_date,
    #     'EmailAdd': email
    # })

    # session_attributes['currentReservation'] = reservation

    if intent_request['invocationSource'] == 'DialogCodeHook':
        # Validate any slots which have been specified.  If any are invalid, re-elicit for their value
        validation_result = validate_sub(room_type, location, monthly_spend, checkin_date, checkout_date, email)
        slots = get_slots(intent_request)

        if not validation_result['isValid']:
                    slots[validation_result['violatedSlot']] = None
                    return elicit_slot(intent_request['sessionAttributes'],
                                    intent_request['currentIntent']['name'],
                                    slots,
                                    validation_result['violatedSlot'],
                                    validation_result['message'])

        output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}

        return delegate(output_session_attributes, get_slots(intent_request))

    if intent_request['invocationSource'] == 'FulfillmentCodeHook':
        print("12312312312123131313")
        sqs_client = boto3.client("sqs", region_name="us-east-1")
        queue_url = sqs_client.get_queue_url(QueueName='diningSug.fifo')['QueueUrl']
        print("test000")

        response = sqs_client.send_message(
            QueueUrl = queue_url,
            MessageAttributes={
                "RoomType": {
                      'DataType' : 'String',
                      'StringValue' : room_type
                },
                "AreaType": {
                      'DataType' : 'String',
                      'StringValue' : location
                },
                "Spend": {
                      'DataType' : 'Number',
                      'StringValue' : monthly_spend
                },
                'CheckInDate':{
                    'DataType' :'String',
                    'StringValue' : checkin_date
                },
                'CheckOutDate':{
                    'DataType' :'Number',
                    'StringValue' : checkout_date
                },
                "EmailAdd": {
                      'DataType' : 'String',
                      'StringValue' : email
                }
            },
            MessageBody='string',
            MessageDeduplicationId='string',
            MessageGroupId='string'
        )
        print("test001")
        
        
        return close(intent_request['sessionAttributes'],
             'Fulfilled',
             {'contentType': 'PlainText',
              'content': 'Thank you, I will now sending the apartment information to your email address at: {}.  Let me know if you need anything else.'.format(email)})


# --- Intents ---

def greeting(intent_request):
    response = {
        "dialogAction" : {
            "type" : "Close",
            "fulfillmentState" : "Fulfilled",
            "message" : {
                "contentType" : "PlainText",
                "content" : "Hello NYU alumni! How can I help you?"
            }
        }
    }
    return response

def thankyou(intent_request):
    output = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    return close(
        output,
        'Fulfilled',
        {
            'contentType' : 'PlainText',
            'content' : "You are welcome."
        }
    )


def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """

    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'HelloIntent':
        return greeting(intent_request)
    elif intent_name == 'SubleaseIntent':
        return book_sub(intent_request)
    elif intent_name == 'BookHotel':
        return book_apt(intent_request)
    elif intent_name == 'ThankYou':
        return thankyou(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')


# --- Main handler ---


def lambda_handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    # By default, treat the user request as coming from the America/New_York time zone.
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))

    return dispatch(event)
