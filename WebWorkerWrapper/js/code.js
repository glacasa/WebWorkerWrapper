var Code = {
    MakeLotsOfCalculations: function (count) {
        var result = 0;
        for (var i = 0; i < count; i++) {
            var a = Math.exp(i) + Math.cos(i);
            result += i;
        }
        return result;
    },

    DoSomethingFast: function () {
        return "hello";
    }
};
