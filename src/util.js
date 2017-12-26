function displayError(text, appendText) {
  var errorArea = document.querySelector( '#errorArea' );

  if (!errorArea)
    return;

  // Do we want to stack the errors
  if (appendText === true && errorArea.innerHTML.length !== 0) {
    if (text !== null) {
      errorArea.innerHTML += '<br>' + text.toString();
      errorArea.style.display = 'block';
    }
  }

  // Clear errors between each calls
  else if (text !== null) {
    errorArea.innerHTML = text.toString()
    errorArea.style.display = 'block';
  }

  // Clear error area
  else {
    errorArea.style.display = 'none';
  }
}

function restTimeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

function restCheckStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  var error = new Error(response.status + ': ' + response.statusText)
  error.response = response
  throw error
}

function restParseJSON(response) {
  return response.json();
}

function restGET(uri, callback) {
  if (typeof fetch !== 'function') {
    return callback(new Error('Unsupported browser, missing support for "fetch"'));
  }

  if (typeof Promise === "undefined") {
    return callback(new Error('Unsupported browser, missing support for "Promise"'));
  }


  restTimeout(10000, fetch(uri))
    .then(restCheckStatus)
    .then(restParseJSON)
    .then(function(data) {
      callback(null, data);
    })
    .catch(function(error) {
      callback(error);
    });
}


function restPOST(uri, jsonData, callback) {
  if (typeof fetch !== 'function') {
    return callback(new Error('Unsupported browser, missing support for "fetch"'));
  }

  if (typeof Promise === "undefined") {
    return callback(new Error('Unsupported browser, missing support for "Promise"'));
  }

  restTimeout(10000, 
    fetch(uri, {
      mode: 'no-cors', // 'cors' by default
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    }))
    .then(restCheckStatus)
    .then(restParseJSON)
    .then(function(data) {
      if (typeof callback === 'function')
        callback(null, data);
    })
    .catch(function(error) {
      if (typeof callback === 'function')
        callback(error);
    });
}


export { restGET, restPOST, displayError };