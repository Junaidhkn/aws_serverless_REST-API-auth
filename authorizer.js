const generatePolicy = ( principalId, effect, resource ) => {
   let authResponse = {};

   authResponse.principalId = principalId;
   if ( effect && resource ) {
      let policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      let statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
   }
   return authResponse;

};

exports.handler = ( event, context, callback ) => {
   // lambda authorizer code
   var token = event.authorizationToken; // "allow" or "deny"
   switch ( token ) {
      case "allow":
         callback( null, generatePolicy( "user", "Allow", event.methodArn ) );
         break;
      case "deny":
         callback( null, generatePolicy( "user", "Deny", event.methodArn ) );
         break;
      default:
         callback( "Error: Invalid token" );
   }
};