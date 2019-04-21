export = extractUrlVariableName

const urlVariableRegex = /\{[^}]+\}/g

function removeNonChars (variableName: string) {
  return variableName.replace(/^\W+|\W+$/g, '').split(/,/)
}
function extractUrlVariableName (url: string) {
  const matches = url.match(urlVariableRegex)

  if (!matches) {
    return []
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), [])
}
