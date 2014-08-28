var BackgroundWorker = {};
(function () {

    if (window.Worker) {

        var worker = new Worker('js/worker.js');

        var callbackQueue = [];
        worker.onmessage = function (event) {
            var callback = callbackQueue.shift();
            if (callback && typeof callback === "function") {
                var result = JSON.parse(event.data);
                callback(result);
            }
        }

        function callFunction(functionName) {
            return function () {
                //TODO : ici je suis sûr qu'on peut faire mieux.
                // le pb étant que "arguments" n'étant pas un array, je peux pas le balancer tel quel au worker
                var args = [];
                var callback = null;
                for (var fnArg in arguments) {
                    if (typeof arguments[fnArg] === "function") {
                        var callback = arguments[fnArg];
                    } else {
                        args.push(arguments[fnArg]);
                    }
                }
                callbackQueue.push(callback);

                var message = JSON.stringify({
                    functionName: functionName,
                    args: args
                });

                worker.postMessage(message);
            }
        }

        for (var fn in Code) {
            if (Code[fn] && typeof Code[fn] === "function") {
                BackgroundWorker[fn] = callFunction(fn);
            }
        }
    } else {
        //TODO : fallback
    }
})();