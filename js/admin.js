function AdminViewModel() {
    var self = this;

    self.chars = ko.observableArray([]);
    self.selected = ko.observable();

    self.char_names = ko.computed(function() {
        return self.chars().map(function(value, index, all) {
            return value.name || '';
        });
    });

    self.get_selected = function() {
        for (var i=0; i < self.chars().length; i++) {
            if (self.chars()[i].name === self.selected) {
                return self.chars()[i];
            }
        }
        return null;
    }
    
    self.new_ = function() {
        var pcm = new PCViewModel();
        ko.cleanNode(document.getElementById("pc"));
        ko.applyBindings(pcm, document.getElementById('pc'));
        self.chars.push(pcm);
        self.selected(pcm.name);
        if (localStorage) {
            localStorage.setItem('admin', ko.mapping.toJSON(self));
        }
    }

    self.load = function() {
        var pcm = ko.mapping.fromJS(self.get_selected(), {}, new PCViewModel());
        ko.cleanNode(document.getElementById("pc"));
        ko.applyBindings(pcm, document.getElementById('pc'));
        if (localStorage) {
            localStorage.setItem('admin', ko.mapping.toJSON(self));
        }
    }

    self.delete_ = function() {
        
    }
    self.save = function() {
        if (localStorage) {
            localStorage.setItem('admin', ko.mapping.toJSON(self));
        }
    }
}

var model;
if (localStorage && localStorage.getItem('admin')) {
    model = ko.mapping.fromJSON(localStorage.getItem('admin'), {}, new AdminViewModel());
    model.load();
} else {
    model = new AdminViewModel();
    model.new_();
}
ko.applyBindings(model, document.getElementById('admin'));