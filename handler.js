'use strict';

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient( {
  region: 'ap-south-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000
  }
} );
const documentClient = DynamoDBDocumentClient.from( client );

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME || 'notes'


module.exports.createNote = async ( event, context ) => {
  context.callbackWaitsForEmptyEventLoop = false
  const data = JSON.parse( event.body )
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: 'attribute_not_exists(notesId)',
    }
    await documentClient.send( new PutCommand( params ) )
    return {
      statusCode: 201,
      body: JSON.stringify( data )
    }
  } catch ( error ) {
    return {
      statusCode: 500,
      body: JSON.stringify( error.message )
    }
  }
};


module.exports.updateNote = async ( event, context ) => {
  context.callbackWaitsForEmptyEventLoop = false
  const notesId = event.pathParameters.id
  const data = JSON.parse( event.body )

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      UpdateExpression: 'set #title = :title, #body = :body',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body
      },

      ConditionExpression: 'attribute_exists(notesId)',
    }
    await documentClient.send( new UpdateCommand( params ) )
    return {
      statusCode: 200,
      body: JSON.stringify( data )
    }
  } catch ( error ) {
    return {
      statusCode: 500,
      body: JSON.stringify( error.message )
    }
  }
};


module.exports.deleteNote = async ( event, context ) => {
  context.callbackWaitsForEmptyEventLoop = false
  const notesId = event.pathParameters.id
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId
      },
      ConditionExpression: 'attribute_exists(notesId)',
    }
    await documentClient.send( new DeleteCommand( params ) )
    return {
      statusCode: 200,
      body: JSON.stringify( { message: 'Note deleted successfully' } )
    }

  } catch ( error ) {
    return {
      statusCode: 500,
      body: JSON.stringify( error.message )
    }
  }
};


module.exports.getAllNotes = async ( _event, context, callback ) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    }
    const notes = await documentClient.send( new ScanCommand( params ) )
    return {
      statusCode: 200,
      body: JSON.stringify( notes )
    }
  } catch ( error ) {
    return {
      statusCode: 500,
      body: JSON.stringify( error.message )
    }
  }
};
