'use strict';

module.exports.createNote = async ( event ) => {
  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

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
