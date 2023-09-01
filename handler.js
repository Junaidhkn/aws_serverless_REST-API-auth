'use strict';

const DynamoDb = require( 'aws-sdk/clients/dynamodb' )
const documentClient = new DynamoDb.DocumentClient( { region: 'ap-south-1' } )



module.exports.createNote = async ( event, context, callback ) => {
  const data = JSON.parse( event.body )
  try {
    const params = {
      TableName: 'notes',
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: 'attribute_not_exists(notesId)',
    }
    await documentClient.put( params ).promise()
    callback( null, {
      statusCode: 201,
      body: JSON.stringify( data )
    } )
  } catch ( error ) {
    callback( null, {
      statusCode: 500,
      body: JSON.stringify( error.message )
    } )
  }
};


module.exports.updateNote = async ( event ) => {
  const notesId = event.pathParameters.id
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `The note ${notesId} has been updated`,
        input: event,
      },
      null,
      2
    ),
  };

};


module.exports.deleteNote = async ( event ) => {
  const notesId = event.pathParameters.id
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `The note ${notesId} has been Deleted`,
        input: event,
      },
      null,
      2
    ),
  };

};


module.exports.getAllNotes = async ( event ) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'The Array of Notes!',
        input: event,
      },
      null,
      2
    ),
  };

};
