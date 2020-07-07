let model = {
    converstations: [],
    currentConverstation: null
}
model.saveConverstations = function (converstations) {
    model.converstations = converstations
}
model.saveCurrentConverstation = function (converstation) {
    model.currentConverstation =  converstation
}