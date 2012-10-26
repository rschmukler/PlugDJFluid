class PlugDJFluidApp
  constructor: ->
    @muted = false
    @setEvents()
    window.fluid.addDockMenuItem("Mute", @toggleMute)

  setEvents: ->
    API.addEventListener(API.USER_FAN, @newFan)
    API.addEventListener(API.FRIEND_JOIN, @friendJoin)
    API.addEventListener(API.DJ_ADVANCE, @trackChange)

  toggleMute: =>
    if @muted
      window.fluid.removeDockMenuItem("Unmute")
      window.fluid.addDockMenuItem("Mute", @toggleMute)
    else
      window.fluid.removeDockMenuItem("Mute")
      window.fluid.addDockMenuItem("Unmute", @toggleMute)

    $('#button-sound').click()
    @muted = !@muted

  durationToString: (duration) ->
    hours = Math.floor((duration / 3600))
    minutes = Math.floor((duration / 60) % 60)
    seconds = duration % 60

    if hours > 0
      return "#{hours}:#{minutes}:#{seconds}"
    else
      return "#{minutes}:#{seconds}"




  showWindow: =>
    window.fluid.unhide()
    window.fluid.active()

  newFan: (user) =>
    unless @muted
      growlOptions =
        title: "New fan"
        description: "#{user.username} is now your fan!"
        sticky: false
        onclick: @showWindow

      window.fluid.showGrowlNotification(growlOptions)

  friendJoin: (user) =>
    unless @muted
      growlOptions =
        title: "Friend joined"
        description: "#{user.username} has joined the room"
        sticky: false
        onclick: @showWindow
      window.fluid.showGrowlNotification(growlOptions)

  trackChange: (obj) =>
    unless @muted
      media = API.getMedia()
      growlOptions =
        title: media.title
        description: "#{media.author} - #{@durationToString(media.duration)}"
        sticky: false
        onclick: @showWindow
      window.fluid.showGrowlNotification(growlOptions)




window.PlugDJFluidApp = new PlugDJFluidApp()
