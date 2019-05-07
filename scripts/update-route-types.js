const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const ROUTES = require("@octokit/routes");
const Handlebars = require("handlebars");
const set = require("lodash.set");
const pascalCase = require("pascal-case");
const prettier = require("prettier");
const { stringToJsdocComment } = require("string-to-jsdoc-comment");

const ROUTES_PATH = resolve(process.cwd(), "generated", "routes.ts");
const ROUTES_TEMPLATE_PATH = resolve(
  process.cwd(),
  "scripts",
  "routes.ts.template"
);

Handlebars.registerHelper("union", function(endpoints, key) {
  return endpoints.map(endpoint => endpoint[key]).join(" | ");
});
Handlebars.registerHelper("name", function(parameter) {
  let name = parameter.name;

  if (/[.\[]/.test(name)) {
    name = `"${name}"`;
  }

  if (parameter.required) {
    return name;
  }

  return `${name}?`;
});

Handlebars.registerHelper("type", function(parameter) {
  const type = typeMap[parameter.type] || parameter.type;

  if (parameter.allowNull) {
    return `${type} | null`;
  }

  return type;
});
const template = Handlebars.compile(readFileSync(ROUTES_TEMPLATE_PATH, "utf8"));

const endpointsByRoute = {};

const typeMap = {
  integer: "number",
  "integer[]": "number[]"
};

Object.keys(ROUTES).forEach(scope => {
  const scopeEndpoints = ROUTES[scope];
  scopeEndpoints.forEach(endpoint => {
    const route = `${endpoint.method} ${endpoint.path}`;

    if (!endpointsByRoute[route]) {
      endpointsByRoute[route] = [];
    }

    endpointsByRoute[route].push({
      optionsTypeName: pascalCase(`${scope} ${endpoint.idName}`) + "_Options",
      requestOptionsTypeName:
        pascalCase(`${scope} ${endpoint.idName}`) + "_RequestOptions"
    });
  });
});

const options = [];
const childParams = {};

Object.keys(ROUTES).forEach(scope => {
  const scopeEndpoints = ROUTES[scope];
  scopeEndpoints.forEach(endpoint => {
    const { method, url, params } = endpoint;

    const optionsTypeName =
      pascalCase(`${scope} ${endpoint.idName}`) + "_Options";
    const requestOptionsTypeName =
      pascalCase(`${scope} ${endpoint.idName}`) + "_RequestOptions";

    params
      .map(parameterize)
      // handle "object" & "object[]" types
      .map(param => {
        if (param.deprecated) {
          return;
        }

        const namespacedParamsName = pascalCase(
          `${scope}.${endpoint.idName}.Params`
        );

        if (param.type === "object" || param.type === "object[]") {
          const childParamsName = pascalCase(
            `${namespacedParamsName}.${param.key}`
          );
          param.type = param.type.replace("object", childParamsName);

          if (!childParams[childParamsName]) {
            childParams[childParamsName] = {};
          }
        }

        if (!/\./.test(param.key)) {
          return param;
        }

        const childKey = param.key.split(".").pop();
        const parentKey = param.key.replace(/\.[^.]+$/, "");

        param.key = childKey;

        const childParamsName = pascalCase(
          `${namespacedParamsName}.${parentKey}`
        );
        set(childParams, `${childParamsName}.${childKey}`, param);
      })
      .filter(Boolean);

    options.push({
      in: {
        name: optionsTypeName,
        params
      },
      out: {
        name: requestOptionsTypeName,
        method
      }
    });
  });
});

const result = template({
  endpointsByRoute,
  options
});

writeFileSync(ROUTES_PATH, prettier.format(result, { parser: "typescript" }));
console.log(`${ROUTES_PATH} updated.`);

function parameterize(definition) {
  if (definition === null) {
    return {};
  }

  const key = definition.name;
  const type = typeMap[definition.type] || definition.type;
  const enums = definition.enum
    ? definition.enum.map(JSON.stringify).join("|")
    : null;

  return {
    name: pascalCase(key),
    key: key,
    required: definition.required,
    type: enums || type,
    alias: definition.alias,
    deprecated: definition.deprecated,
    allowNull: definition.allowNull,
    jsdoc: stringToJsdocComment(definition.description)
  };
}
