var BackgroundWorker = {};
(function () {

    function checkFunctionArgs(originalArgs) {
        var args = [];
        var callback = null;
        for (var fnArg in originalArgs) {
            if (typeof originalArgs[fnArg] === "function") {
                callback = originalArgs[fnArg];
            } else {
                args.push(originalArgs[fnArg]);
            }
        }
        return {
            args: args,
            callback: callback
        };
    }

    if (window.Worker) {
        var worker = new Worker('js/worker.js');

        var callbackQueue = [];
        worker.onmessage = function (event) {
            var callback = callbackQueue.shift();
            if (callback && typeof callback === "function") {
                var result = event.data;
                callback(result);
            }
        }

        function callFunctionAsync(functionName) {
            return function () {
                var functionArgs = checkFunctionArgs(arguments);
                callbackQueue.push(functionArgs.callback);

                var message = {
                    functionName: functionName,
                    args: functionArgs.args
                };

                worker.postMessage(message);
            }
        }

        for (var fn in Code) {
            if (Code[fn] && typeof Code[fn] === "function") {
                BackgroundWorker[fn] = callFunctionAsync(fn);
            }
        }
    } else {
        function callFunctionSync(functionName) {
            return function() {
                var functionArgs = checkFunctionArgs(arguments);
                var result = Code[functionName](functionArgs.args);
                if (functionArgs.callback) {
                    functionArgs.callback(result);
                }
            }
        }

        for (fn in Code) {
            if (Code[fn] && typeof Code[fn] === "function") {
                BackgroundWorker[fn] = callFunctionSync(fn);
            }
        }
    }
})();