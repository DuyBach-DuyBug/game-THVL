let model = {
    converstations: [],
    currentConverstation: null,
    [`scoreboard_xo`]: [],
    [`scoreboard_ship`]: [],
    [`scoreboard_brick`]: [],
    friendRe:[],
    friendList:[],
    currentUser: null,
    game: null,
}
model.saveConverstations = function (converstations) {
    model.converstations = converstations
}
model.saveCurrentConverstation = function (converstation) {
    model.currentConverstation =  converstation
}
// model