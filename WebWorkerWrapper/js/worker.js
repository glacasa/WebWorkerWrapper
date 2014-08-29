importScripts("code.js");

onmessage = function messageHandler(event) {

    if (event.data) {
        var data = event.data;

        var fn = data.functionName;
        var result = Code[fn].apply(null, data.args);

        postMessage(result);
    }
}
