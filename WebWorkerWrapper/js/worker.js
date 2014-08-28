importScripts("code.js");

onmessage = function messageHandler(event) {

    if (event.data) {
        var data = JSON.parse(event.data);

        var fn = data.functionName;
        var result = Code[fn].apply(null, data.args);

        postMessage(JSON.stringify(result));
    }
}
