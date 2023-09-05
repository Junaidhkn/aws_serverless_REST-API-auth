'use strict';

const DynamoDb = require( 'aws-sdk/clients/dynamodb' )
const documentClient = new DynamoDb.DocumentClient( { region: 'ap-south-1' } )
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME || 'notes'


module.exports.createNote = async ( event, _context, callback ) => {
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
    await documentClient.put( params ).promise()
    callback( _null, {
      statusCode: 201,
      body: JSON.stringify( data )
    } )
  } catch ( error ) {
    callback( _null, {
      statusCode: 500,
      body: JSON.stringify( error.message )
    } )
  }
};


module.exports.updateNote = async ( event, _context, callback ) => {
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
    await documentClient.update( params ).promise()
    callback( _null, {
      statusCode: 200,
      body: JSON.stringify( data )
    } )
  } catch ( error ) {
    callback( _null, {
      statusCode: 500,
      body: JSON.stringify( error.message )
    } )
  }
};


module.exports.deleteNote = async ( event, _context, callback ) => {
  const notesId = event.pathParameters.id
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId
      },
      ConditionExpression: 'attribute_exists(notesId)',
    }
    await documentClient.delete( params ).promise()
    callback( _null, {
      statusCode: 200,
      body: JSON.stringify( { message: 'Note deleted successfully' } )
    } )

  } catch ( error ) {
    callback( _null, {
      statusCode: 500,
      body: JSON.stringify( error.message )
    } )
  }
};


module.exports.getAllNotes = async ( event ) => {

};
