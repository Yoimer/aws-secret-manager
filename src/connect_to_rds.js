/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. The 'SDK for JavaScript Developer Guide' for v3 is also
scheduled for release later in 2020.

Purpose:
secrets_getsecretvalue.ts demonstrates how to retrieve a secret from Amazon Secrets Manager.

Inputs (replace in code):
- SECRET_ID

Running the code:
node secrets_getsecretvalue.js
 */

// snippet-start:[secrets.JavaScript.retrieve.getSecretsValueV3]
// Import required AWS SDK clients and commands for Node.js
import {
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { secretsClient } from "./libs/secretsClient.js" ;
import mysql from 'mysql';

// Set the parameters
const params = {
  SecretId: "", //e.g. arn:aws:secretsmanager:REGION:XXXXXXXXXXXX:secret:mysecret-XXXXXX
};

const run = async () => {
  let data;
  let rds;
  try {
    data = await secretsClient.send(new GetSecretValueCommand(params));
    //console.log("data", data);
    // parse secret values

    rds = JSON.parse(data.SecretString);

    // connects to RDS
    var connection = mysql.createConnection({
      host     : rds.host,
      user     : rds.username,
      password : rds.password,
      port     : rds.port
    });

    connection.connect(function(err) {
      if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
      }
    
      console.log('Connected to database.');
    });
    
    connection.end();

    return data; // For unit tests.
  } catch (err) {
    console.log("err", err);
  }
  let secret;
  if ("SecretString" in data) {
    secret = data.SecretString;
  } else {
    console.log("else:", data);

    // Create a buffer
    const buff = new Buffer(data.SecretBinary, "base64");
    secret = buff.toString("ascii");
  }
  return secret;
};
run();
// snippet-end:[secrets.JavaScript.retrieve.getSecretsValueV3]
// For unit tests.
// module.exports = {run, params}


// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html
