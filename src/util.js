function displayError(error, appendText) {
  if (error)
    console.log(error);

  const errorArea = document.querySelector( '#errorArea' );

  if (!errorArea)
    return;

  // Do we want to stack the errors
  if (appendText === true && errorArea.innerHTML.length !== 0) {
    if (error !== null) {
      errorArea.innerHTML += '<br>' + error.toString();
      errorArea.style.display = 'inline-block';
    }
  }

  // Clear errors between each calls
  else if (error !== null) {
    errorArea.innerHTML = error.toString();
    errorArea.style.display = 'inline-block';
  }

  // Clear error area
  else {
    errorArea.style.display = 'none';
  }

  //if (error)
  //  throw error;
}

function restTimeout(ms, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

function restCheckStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.status + ': ' + response.statusText);
  error.response = response;
  throw error;
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
    .then((data) => {
      callback(null, data);
    })
    .catch((error) => {
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
    .then((data) => {
      if (typeof callback === 'function')
        callback(null, data);
    })
    .catch((error) => {
      if (typeof callback === 'function')
        callback(error);
    });
}


function throttle(fn, threshhold, scope) {
  let last;
  let deferTimer;
  threshhold || (threshhold = 250);
  return function () {
    const context = scope || this;

    const now = Date.now();
    const args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}


export { restGET, restPOST, displayError, throttle };