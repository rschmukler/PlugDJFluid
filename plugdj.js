// Generated by CoffeeScript 1.3.3
(function() {
  var PlugDJFluidApp,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  PlugDJFluidApp = (function() {

    function PlugDJFluidApp() {
      this.trackChange = __bind(this.trackChange, this);

      this.friendJoin = __bind(this.friendJoin, this);

      this.newFan = __bind(this.newFan, this);

      this.showWindow = __bind(this.showWindow, this);

      this.tryToDJ = __bind(this.tryToDJ, this);

      this.toggleMute = __bind(this.toggleMute, this);

      this.chatMessageHappened = __bind(this.chatMessageHappened, this);

      this.djBoothChange = __bind(this.djBoothChange, this);
      this.muted = false;
      this.autowoot = true;
      this.setEvents();
      window.fluid.addDockMenuItem("Mute", this.toggleMute);
    }

    PlugDJFluidApp.prototype.setEvents = function() {
      API.addEventListener(API.USER_FAN, this.newFan);
      API.addEventListener(API.FRIEND_JOIN, this.friendJoin);
      API.addEventListener(API.DJ_ADVANCE, this.trackChange);
      API.addEventListener(API.DJ_UPDATE, this.djBoothChange);
      return API.addEventListener(API.CHAT, this.chatMessageHappened);
    };

    PlugDJFluidApp.prototype.djBoothChange = function(djs) {
      var growlOptions;
      if (djs.length < 5) {
        if (!this.muted) {
          growlOptions = {
            title: "DJ Spot available",
            description: "Click to try and grab it",
            sticky: true,
            onclick: this.tryToDJ
          };
          return window.fluid.showGrowlNotification(growlOptions);
        }
      }
    };

    PlugDJFluidApp.prototype.chatMessageHappened = function(data) {
      var growlOptions;
      if (this.isDJing()) {
        if (data.type === "message") {
          if (data.message.match(/^\/djs/)) {
            growlOptions = {
              title: "DJ Status Ping",
              description: "Click to show window",
              sticky: true,
              onclick: this.showWindow
            };
            return window.fluid.showGrowlNotification(growlOptions);
          }
        }
      }
    };

    PlugDJFluidApp.prototype.isDJing = function() {
      var dj, username, _i, _len, _ref;
      username = API.getSelf().username;
      _ref = API.getDJs();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dj = _ref[_i];
        if (dj.username === username) {
          return true;
        }
      }
      return false;
    };

    PlugDJFluidApp.prototype.toggleMute = function() {
      if (this.muted) {
        window.fluid.removeDockMenuItem("Unmute");
        window.fluid.addDockMenuItem("Mute", this.toggleMute);
      } else {
        window.fluid.removeDockMenuItem("Mute");
        window.fluid.addDockMenuItem("Unmute", this.toggleMute);
      }
      $('#button-sound').click();
      return this.muted = !this.muted;
    };

    PlugDJFluidApp.prototype.durationToString = function(duration) {
      var hours, minutes, seconds;
      hours = Math.floor(duration / 3600);
      minutes = Math.floor((duration / 60) % 60);
      seconds = duration % 60;
      if (hours > 0) {
        return "" + hours + ":" + minutes + ":" + seconds;
      } else {
        return "" + minutes + ":" + seconds;
      }
    };

    PlugDJFluidApp.prototype.tryToDJ = function() {
      $('#button-dj-play').click();
      return this.showWindow();
    };

    PlugDJFluidApp.prototype.showWindow = function() {
      window.fluid.unhide();
      return window.fluid.active();
    };

    PlugDJFluidApp.prototype.newFan = function(user) {
      var growlOptions;
      if (!this.muted) {
        growlOptions = {
          title: "New fan",
          description: "" + user.username + " is now your fan!",
          sticky: false,
          onclick: this.showWindow
        };
        return window.fluid.showGrowlNotification(growlOptions);
      }
    };

    PlugDJFluidApp.prototype.friendJoin = function(user) {
      var growlOptions;
      if (!this.muted) {
        growlOptions = {
          title: "Friend joined",
          description: "" + user.username + " has joined the room",
          sticky: false,
          onclick: this.showWindow
        };
        return window.fluid.showGrowlNotification(growlOptions);
      }
    };

    PlugDJFluidApp.prototype.trackChange = function(obj) {
      var growlOptions, media;
      if (!this.muted) {
        media = API.getMedia();
        growlOptions = {
          title: media.title,
          description: "" + media.author + " - " + (this.durationToString(media.duration)),
          sticky: false,
          onclick: this.showWindow
        };
        window.fluid.showGrowlNotification(growlOptions);
      }
      if (this.autowoot) {
        return $('#button-vote-positive').click();
      }
    };

    return PlugDJFluidApp;

  })();

  window.PlugDJFluidApp = new PlugDJFluidApp();

}).call(this);
