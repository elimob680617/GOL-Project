const fs = require("fs");
require('dotenv').config();
// const args = require('yargs').argv;
// let args = process.argv.slice(2);
// throw new Error(`Duplicate Name:${process.env}`);
// const [, services] = process.argv
//   .find((arg) => arg.includes("--services"))
//   .split("=");
const services = process.env.REACT_APP_GQL_SUB_SYSTEM_NAMES
const endpoints = Object.keys(process.env).filter((_) =>
  _.includes("ENDPOINT")
);

function makeApiClient(service) {
  // starts from the package json path.
  const apiPath = `src/_apis/${service.toLowerCase()}.ts`;

  let content = `import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { GraphQLClient } from "graphql-request";
  
const client = new GraphQLClient(
  process.env.${endpoints.find((_) =>
    _.includes("_" + service + "_")
  )} as string
);
  
export async function ${service.toLowerCase()}BaseQuery(args: any, api: any, extraOptions: any) {
  const rawBaseQuery = graphqlRequestBaseQuery({ client });
  const result = await rawBaseQuery(args, api, extraOptions);
  return result;
}
  
export const api = createApi({
  baseQuery: ${service.toLowerCase()}BaseQuery,
  reducerPath: "${service}",
  endpoints: () => ({}),
  keepUnusedDataFor: 0
});
  
export default client;
  
  `;
  if(!fs.existsSync('src/_apis')) {
    fs.mkdirSync('src/_apis');
  }
  fs.writeFile(apiPath, content, (err) => {
    if (err) {
      throw new Error(err.message);
    }
  });
}

let indexFile = ""

services.split(',').map((service) => {
  makeApiClient(service);
  indexFile += `export { default as ${service.toLowerCase()} } from './${service.toLowerCase()}'\n`
});

// create index file
fs.writeFile('src/_apis/index.ts', indexFile, (err) => {
  if (err) {
    throw new Error(err.message);
  }
});