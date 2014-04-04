function DiceViewModel() {
    var self = this;

    self.total = ko.observable(0);
    self.rolls = ko.observableArray();

    self.roll = function(size) {
        var r = Math.floor(Math.random() * size) + 1;
        self.rolls().push(r);
        self.total(self.total() + r);
    }

    self.clear = function() {
        self.rolls([]);
        self.total(0);
    }

    self.sum = ko.computed(function() {
        if (self.total()) {
            var sum = self.rolls().join(" + ");
            sum = sum + " = " + self.total();
            return sum;
        }
        return "";
    });
}

// Activates knockout.js
ko.applyBindings(new DiceViewModel(), document.getElementById('dice'));