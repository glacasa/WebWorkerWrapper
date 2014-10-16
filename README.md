WebWorkerWrapper
================

Javascript is a single-threaded language, but it is possible to execute javascript code on a background thread using Web Workers.

These workers have limitations, the most problematic for me was the way to communicate with the main thread : only string messages can be sent between the UI and the background threads. 

In order to have an easier way to communicate between threads, I made this wrapper, that will allow to directly call functions with parameters on the background threads, with a callback when the process is done.

The project contains the following files :

- js/code.js : this file contains a javascript object with the functions we want to call on background worker
- js/worker.js : the background worker itself
- js/wrapper.js : here we have the entry point for the background functions
- default.html : well, we need it to make all this work together

### How to use it

If you want to use a wrapper like this one, here is what you have to know :

The heavy tasks are in an object named `Code` in the `code.js` file. Only the functions in this object will be wrapped to be used in the worker. 

If you rename the file, update the first line of the `worker.js`.

If you rename the object `Code`, update the call to this object in `wrapper.js` and `worker.js`

In your html file, add a reference to `code.js` and `wrapper.js`. The `worker.js` is already referenced in `wrapper.js` (be careful to the path to the file) 


All the functions in the object `Code` can be directly called synchronously. An object `BackgroundWorker` is created with the same functions, and they can receive one more parameter : a callback to call at the end.

### Code sample

code.js :

    var Code = {
        HeavyCalculation(param1, param2) {
            // Do all your stuff here
            return "here is the result";
        }
    };

any other script :

    var output = document.getElementById("output");
    // Synchronous call
    // If you do this, the browser will freeze 
	var result = Code.HeavyCalculation(12, 456);
    output.textContent = result;
    
    // Asynchronous call
    // Here the browser won't freeze : the call is made in 
    // the background, at the end the result is displayed
    BackgroundWorker.HeavyCalculation(12, 456, function callback(result){
        output.textContent = result;
    });

### Limitations

As the messaging between the threads is limited to json objects, the parameters of the functions can only be serializables javascript objects ; no functions allowed.

The background worker is still single threaded : if you call several functions, they will be queued.

### Blog post

If you speak french, I explained all this code here : http://blog.lacasa.fr/2014/simplifier-worker-javascript.html
