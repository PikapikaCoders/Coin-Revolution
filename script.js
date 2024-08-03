//Variables
var coin = new Decimal(0)
var coinGain = new Decimal(1)
var coinBest = new Decimal(0)
var inflation = new Decimal(0)
var tickspeed = new Decimal(1)
var knowledge = new Decimal(0)

//Update
function update() {
    mult = new Decimal(1)
    if (tickspeed.gte(1000)) mult = mult.times(tickspeed.div(1000))
    if (rankBought.gte(1)) mult = mult.times(3)
    if (rankBought.gte(5)) mult = mult.times(Decimal.pow(2, rankBought))
    if (collapseUpgrades[2]) mult = mult.times(knowledge)
    coin = coin.add(coinGain.times(inflation.add(1)).times(mult))
    changeElement("coins", "You have "+format(coin)+" coins.")
    if (coin.gt(coinBest)) coinBest = coin

    infMult = new Decimal(1)
    if (rankBought.gte(2)) infMult = infMult.times(3)
    inflation = coinBest.pow(0.5).div(10).times(infMult)
    changeElement("inflation", format(coinBest)+" total coins is translated into a "+format(inflation.times(100))+"% inflation, which is directly boosting your coin production by "+format(inflation.add(1))+"x.")

    changeElement("knowledge", "You have "+format(knowledge)+" knowledge")
    changeElement("collapseButton", "Collapse the economy to gain +"+format(Decimal.pow(10, Decimal.log10(coinBest.add(10)).div(32)))+" knowledge")
    if (collapseUpgrades[2]) changeElement("collapseUpgrade2", "<b>Information Bank</b><br>Coin is boosted by knowledge<br><br>Currently: x"+format(knowledge))
    if (collapseUpgrades[3]) changeElement("collapseUpgrade3", "<b>Quick Learning</b><br>Get free Tickspeed Upgrades depending on knowledge<br><br>Currently: "+format(Decimal.floor(Decimal.ln(knowledge).div(Decimal.ln(2))))+" free upgrades")
}
var updateVar = setInterval(update, new Decimal(1000).div(tickspeed))

//Automation (After Update)
function automate() {
    if (rankBought.gte(9)) tickUpgrade()
    if (rankBought.gte(15)) rankUpgrade()
}
var automateVar = setInterval(automate, 100)

//Tickspeed Upgrade
var tickspeedBought = new Decimal(0)
var getTickspeedBase = function() {
    tickspeedBase = new Decimal(1.2)
    if (rankBought.gte(3)) tickspeedBase = tickspeedBase.add(0.3)
    if (collapseUpgrades[1]) tickspeedBase = tickspeedBase.add(0.5)
    return tickspeedBase
}
var getFreeTickspeed = function() {
    free = new Decimal(0)
    if (collapseUpgrades[3]) free = free.add(Decimal.floor(Decimal.ln(knowledge).div(Decimal.ln(2))))
    return free
}
function tickUpgrade() {
    if (tickspeedBought.gte(14)) cost = Decimal.pow(8, tickspeedBought.sub(14).max(0)).times(1e5)
    else cost = Decimal.pow(2, tickspeedBought).times(10)
    if (coin.gte(cost)) {
        coin = coin.sub(Decimal.pow(2, tickspeedBought).times(10))
        tickspeedBought = tickspeedBought.add(1)
        tickspeed = tickspeed.times(getTickspeedBase())
        clearInterval(updateVar)
        updateVar = setInterval(update, new Decimal(1000).div(tickspeed))
        if (tickspeedBought.gte(14)) cost = Decimal.pow(8, tickspeedBought.sub(14).max(0)).times(1e5)
        else cost = Decimal.pow(2, tickspeedBought).times(10)
        changeElement("tickspeedDesc", "Current Effect: x"+format(tickspeed)+"<br>Next Effect: x"+format(tickspeed.times(getTickspeedBase()))+"<br>Cost: "+format(cost)+" Coins")
    }
}

//Rank Upgrade
var rankBought = new Decimal(0)
var rankCost = new Decimal(100)
function rankUpgrade(reset=false) {
    if (!reset) {
        if (coin.gte(rankCost)) {
            rankBought = rankBought.add(1)
            mult = new Decimal(10)
            if (rankBought.gte(30)) mult = Decimal.pow(10, rankBought.sub(29).max(0))
            rankCost = rankCost.times(mult)
            rankUpdate() 
            coin = new Decimal(0)
            coinGain = new Decimal(1)
            coinBest = new Decimal(0)
            inflation = new Decimal(0)
            tickspeed = Decimal.pow(getTickspeedBase(), getFreeTickspeed())
            tickspeedBought = new Decimal(0)
            if (tickspeedBought.gte(14)) cost = Decimal.pow(8, tickspeedBought.sub(14).max(0)).times(1e5)
            else cost = Decimal.pow(2, tickspeedBought).times(10)
            changeElement("tickspeedDesc", "Current Effect: x"+format(tickspeed)+"<br>Next Effect: x"+format(tickspeed.times(getTickspeedBase()))+"<br>Cost: "+format(cost)+" Coins")
            clearInterval(updateVar)
            updateVar = setInterval(update, new Decimal(1000).div(tickspeed))
        }
    } else {
        coin = new Decimal(0)
        coinGain = new Decimal(1)
        coinBest = new Decimal(0)
        inflation = new Decimal(0)
        tickspeed = Decimal.pow(getTickspeedBase(), getFreeTickspeed())
        tickspeedBought = new Decimal(0)
        if (tickspeedBought.gte(14)) cost = Decimal.pow(8, tickspeedBought.sub(14).max(0)).times(1e5)
        else cost = Decimal.pow(2, tickspeedBought).times(10)
        changeElement("tickspeedDesc", "Current Effect: x"+format(tickspeed)+"<br>Next Effect: x"+format(tickspeed.times(getTickspeedBase()))+"<br>Cost: "+format(cost)+" Coins")
        clearInterval(updateVar)
        updateVar = setInterval(update, new Decimal(1000).div(tickspeed))
    }
    
}
function rankUpdate() {
    if (rankBought.eq(0)) nextEffect = "Coin production x3"
    else if (rankBought.eq(1)) nextEffect = "Inflation formula x3"
    else if (rankBought.eq(2)) nextEffect = "Tickspeed Upgrade base +0.3"
    else if (rankBought.eq(4)) nextEffect = "Coin production x2 per rank"
    else if (rankBought.eq(8)) nextEffect = "Automate Tickspeed Upgrade"
    else if (rankBought.eq(14)) nextEffect = "Automate Rank Upgrade"
    else if (rankBought.eq(29)) nextEffect = "Unlock Economy Collapse"
    else nextEffect = "Progress to the next rank"
    
    if (rankBought.gte(0)) rankEffect = "Nothing"
    if (rankBought.gte(1)) rankEffect = "Rank 1: Coin production x3"
    if (rankBought.gte(2)) rankEffect = rankEffect+"<br>Rank 2: Inflation formula x3"
    if (rankBought.gte(3)) rankEffect = rankEffect+"<br>Rank 3: Tickspeed Upgrade base +0.3"
    if (rankBought.gte(5)) rankEffect = rankEffect+"<br>Rank 5: Coin production x2 per rank"
    if (rankBought.gte(9)) rankEffect = rankEffect+"<br>Rank 9: Automate Tickspeed Upgrade"
    if (rankBought.gte(15)) rankEffect = rankEffect+"<br>Rank 15: Automate Rank Upgrade"
    if (rankBought.gte(30)) rankEffect = rankEffect+"<br>Rank 30: Unlock Economy Collapse"

    if (rankBought.eq(30)) removeClass("collapseDiv", "locked")
    
    changeElement("rankDesc", "Current Effect: "+format(rankBought)+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(rankCost)+" Coins")
    changeElement("rankEffect", rankEffect)
}

function collapse(reset=false) {
    if (!reset) {
        if (rankBought.gte(30)) {
            knowledge = knowledge.add(Decimal.pow(10, Decimal.log10(coinBest.add(10)).div(32)))
            rankUpgrade(true)
            rankBought = new Decimal(0)
            rankCost = new Decimal(100)
            nextEffect = "Coin production x3"
            rankEffect = "Nothing"
            changeElement("rankDesc", "Current Effect: "+format(rankBought)+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(Decimal.pow(10, rankBought).times(100))+" Coins")
            changeElement("rankEffect", rankEffect)
        } else {
            alert("You need Rank 30 to use this button!")
        }
    } else { 
        rankBought = new Decimal(0)
        rankCost = new Decimal(100)
        nextEffect = "Coin production x3"
        rankEffect = "Nothing"
        changeElement("rankDesc", "Current Effect: "+format(rankBought)+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(Decimal.pow(10, rankBought).times(100))+" Coins")
        changeElement("rankEffect", rankEffect)
        rankUpgrade(true)
    }
}

var collapseUpgrades = [null, false, false, false]
function collapseUpgrade(id) {
    if (id == 1) {
        if (knowledge.gte(15) && !collapseUpgrades[1]) {
            knowledge = knowledge.sub(15)
            removeClass("collapseUpgrade1", "sale")
            changeElement("collapseUpgrade1", "<b>Supersonic Speed</b><br>Tickspeed Upgrade base power +0.5")
            collapseUpgrades[1] = true
            collapse(true)
        }
    } else if (id == 2) {
        if (knowledge.gte(500) && !collapseUpgrades[2]) {
            knowledge = knowledge.sub(600)
            removeClass("collapseUpgrade2", "sale")
            collapseUpgrades[2] = true
            collapse(true)
        }
    } else if (id == 3) {
        if (knowledge.gte(3e3) && !collapseUpgrades[3]) {
            knowledge = knowledge.sub(3e3)
            removeClass("collapseUpgrade3", "sale")
            collapseUpgrades[3] = true
            collapse(true)
        }
    }
}
