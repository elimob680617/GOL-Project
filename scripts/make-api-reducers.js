const fs = require("fs");
const path = require("path");
require('dotenv').config();

const services = process.env.REACT_APP_GQL_SUB_SYSTEM_NAMES
let getAllGeneratedFile = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          getAllGeneratedFile(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if(file.includes('.generated.ts')){
            results.push('src'+file.split('src')[1].replace(/\\/g, "/"));
          }
          next();
        }
      });
    })();
  });
};

getAllGeneratedFile('src/_graphql', function(err, results) {
  if (err) throw err;
  startGenerate(results)
});


function makeAPIReducers(paths, service) {
  // starts from the package json path.
  const apiPath = `src/store/reducerApis/${service}_APIs.ts`;

  const APIs = paths.reduce(
    (acc, path) => {
      // chnage import api in generated file
      fs.readFile(path, "utf-8", function (err, data) {
        if (err) throw err;
        var newValue = data.replace('replaceApi', service.toLowerCase());

        fs.writeFile(path, newValue, "utf-8", function (err) {
          if (err)
            throw new Error(`Change Generate File:${path} - Error: ${err}`);
        });
      });

      // create file api reducer
      const importValue = path.replace(".ts", "");
      const pathKey = getKey(importValue);

      if (acc.imports[pathKey]) {
        throw new Error(`Duplicate Name:${pathKey}`);
      }
      return {
        imports: {
          ...acc?.imports,
          [`api as ${pathKey}`]: importValue,
        },
        reducers: {
          ...acc?.reducers,
          [`[${pathKey}.reducerPath]`]: `${pathKey}.reducer`,
        },
        // middleware: [...acc?.middleware, `${pathKey}.middleware`],
      };
    },
    { imports: {}, reducers: {}, middleware: [] }
  );

  let content = "";
  Object.entries(APIs.imports).forEach(([key, value]) => {
    content += `import { ${key} } from '${value}' \n`;
  });
  content += `export const reducers = { \n`;
  Object.entries(APIs.reducers).forEach(([key, value]) => {
    content += `  ${key}: ${value}, \n`;
  });
  content += `} \n`;
  // content += `export const middleware = [${APIs.middleware.join(", ")}]`;

if(!fs.existsSync('src/store/reducerApis')) {
  fs.mkdirSync('src/store/reducerApis');
}

  fs.writeFile(apiPath, content, (err) => {
    if (err) {
      throw new Error(err.message);
    }
  });
}

function getKey(value) {
  function toCamelCase(str) {
    return str
      .replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
      })
      .replace(/\s/g, "")
      .replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
      });
  }
  const names = value?.split("/");
  const last = names[names.length - 1];
  return toCamelCase(last?.replace(".generated", "Api"));
}

function startGenerate(paths){
  
let importRootReducerApiContent = ""; // contains import root reducers api
let exportRootReducerApiContent = ""; // contains export root reducers api

services.split(',').map((service) => {
  const pathServices = paths
    .filter((_) => _.includes(`/${service.toLowerCase()}/`))
    .map((_) => "src/" + _.split("src/")[1]);
  // fs.writeFileSync(
  //   path.join(__dirname, service + "GeneratedPaths.json"),
  //   JSON.stringify(pathServices)
  // );
  makeAPIReducers(pathServices, service);

  importRootReducerApiContent += `import { reducers as ${service.toLowerCase()}ApiReducer } from "./${service}_APIs"\n`;
  exportRootReducerApiContent += `  ...${service.toLowerCase()}ApiReducer,\n`;
});

// create root reducer api file in redux/apis/

let rootReducerApiContent = importRootReducerApiContent;
rootReducerApiContent += `\nconst reducers = {\n${exportRootReducerApiContent}};\n
export default reducers;\n`;

fs.writeFile("src/store/reducerApis/index.ts", rootReducerApiContent, (err) => {
  if (err) {
    throw new Error(err.message);
  }
});

}