const generatePolicy = ( principalId, effect, resource ) => {
   let authResponse = {};
   authResponse.principalId = principalId;
   if ( effect && resource ) {
      let policyDocument = {
         Version: '2012-10-17',
         Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
         }]
      };
      authResponse.policyDocument = policyDocument;
   }
   return authResponse;
}


exports.handler = ( event, context, callback ) => {
   let token = event.authorizationToken; // 'allow' or 'deny'
   switch ( token.toLowerCase() ) {
      case 'allow':
         callback( _null, generatePolicy( 'user', 'Allow', event.methodArn ) );
         break;
      case 'deny':
         callback( _null, generatePolicy( 'user', 'Deny', event.methodArn ) );
         break;
      default:
         callback( "Error: Invalid token" );
   }
}