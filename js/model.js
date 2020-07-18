let model = {
    converstations: [],
    currentConverstation: null,
    [`scoreboard_xo`]: [],
    [`scoreboard_ship`]: [],
    friendRe:[],
    friendList:[],
    currentUser: null,
    game: null,
    point: 0
}
model.saveConverstations = function (converstations) {
    model.converstations = converstations
}
model.saveCurrentConverstation = function (converstation) {
    model.currentConverstation =  converstation
}
// model