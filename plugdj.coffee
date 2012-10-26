class PlugDJFluidApp
  constructor: ->
    @muted = false
    @setEvents()
    window.fluid.addDockMenuItem("Mute", @toggleMute)

  setEvents: ->
    API.addEventListener(API.USER_FAN, @newFan)
    API.addEventListener(API.FRIEND_JOIN, @friendJoin)
    API.addEventListener(API.DJ_ADVANCE, @trackChange)
    API.addEventListener(API.DJ_UPDATE, @djBoothChange)
    API.addEventListener(API.CHAT, @chatMessageHappened)

  djBoothChange: (djs) =>
    if djs.length < 5
      unless @muted
        growlOptions =
          title: "DJ Spot available"
          description: "Click to try and grab it"
          sticky: true
          onclick: @tryToDJ

        window.fluid.showGrowlNotification(growlOptions)


  chatMessageHappened: (data) =>
    if @isDJing()
      if data.type == "message"
        if data.message.match /^\/djs/
          growlOptions =
            title: "DJ Status Ping"
            description: "Click to show window"
            sticky: true
            onclick: @showWindow

          window.fluid.showGrowlNotification(growlOptions)


  isDJing: ->
    username = API.getSelf().username

    for dj in API.getDJs()
      return true if dj.username == username

    return false


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

  tryToDJ: ->
    $('#button-dj-play').click()
    @showWindow()




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
