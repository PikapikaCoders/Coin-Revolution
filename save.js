function saveVariablesToStorage() {
    localStorage.setItem("coin", coin)
    localStorage.setItem("coinGain", coinGain)
    localStorage.setItem("coinBest", coinBest)
    localStorage.setItem("inflation", inflation)
    localStorage.setItem("tickspeed", tickspeed)
    localStorage.setItem("knowledge", knowledge)
    localStorage.setItem("collapseTick", collapseTick)
    localStorage.setItem("tickspeedBought", tickspeedBought)
    localStorage.setItem("rankBought", rankBought)
    localStorage.setItem("rankCost", rankCost)
    localStorage.setItem("enhancerBought", enhancerBought)
    localStorage.setItem("collapseUpgrades", JSON.stringify(collapseUpgrades))
}
setInterval(saveVariablesToStorage, 1000)

function loadVariables() {
    if (localStorage.getItem("coin") !== null) {
        coin = new Decimal(localStorage.getItem("coin"))
    }
    if (localStorage.getItem("coinGain") !== null) {
        coinGain = new Decimal(localStorage.getItem("coinGain"))
    }
    if (localStorage.getItem("coinBest") !== null) {
        coinBest = new Decimal(localStorage.getItem("coinBest"))
    }
    if (localStorage.getItem("inflation") !== null) {
        inflation = new Decimal(localStorage.getItem("inflation"))
    }
    if (localStorage.getItem("tickspeed") !== null) {
        tickspeed = new Decimal(localStorage.getItem("tickspeed"))
    }
    if (localStorage.getItem("knowledge") !== null) {
        knowledge = new Decimal(localStorage.getItem("knowledge"))
    }
    if (localStorage.getItem("collapseTick") !== null) {
        collapseTick = new Decimal(localStorage.getItem("collapseTick"))
    }
    if (localStorage.getItem("tickspeedBought") !== null) {
        tickspeedBought = new Decimal(localStorage.getItem("tickspeedBought"))
    }
    if (localStorage.getItem("rankBought") !== null) {
        rankBought = new Decimal(localStorage.getItem("rankBought"))
    }
    if (localStorage.getItem("rankCost") !== null) {
        rankCost = new Decimal(localStorage.getItem("rankCost"))
    }
    if (localStorage.getItem("enhancerBought") !== null) {
        enhancerBought = new Decimal(localStorage.getItem("enhancerBought"))
    }
    if (localStorage.getItem("collapseUpgrades") !== null) {
        collapseUpgrades = JSON.parse(localStorage.getItem("collapseUpgrades"))
    }

    timeout = setTimeout(function() {
        if (tickspeedBought.gte(14)) cost = Decimal.pow(8, tickspeedBought.sub(14).max(0)).times(1e5)
        else cost = Decimal.pow(2, tickspeedBought).times(10)
        changeElement("tickspeedDesc", "Current Effect: x"+format(tickspeed)+"<br>Next Effect: x"+format(tickspeed.times(getTickspeedBase()))+"<br>Cost: "+format(cost)+" Coins")
        rankUpdate()
        enhancer(true)
    }, 100);
  
    clearInterval(updateVar)
    updateVar = setInterval(update, new Decimal(1000).div(tickspeed))
}
window.onload = loadVariables()

function deleteSaveFile() {
    localStorage.clear()
    location.reload()
}