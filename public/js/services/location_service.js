var LocationService = function (geochat, callback) {
    this.setupGeolocation(_.bind(callback, geochat));
};
LocationService.prototype = {
    setupGeolocation: function (callback) {
        if (!navigator.geolocation) {
            new Error('No geolocation!');
        };

        navigator.geolocation.getCurrentPosition(callback, this.geolocationError);
    },

    geolocationError: function (error) {
    }
};
