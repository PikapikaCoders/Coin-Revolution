//Start
var coin = new Decimal(0)
var coinGain = new Decimal(1)
var coinBest = new Decimal(0)
var inflation = new Decimal(0)
var tickspeed = new Decimal(1)
//Collapse
var knowledge = new Decimal(0)
var collapseTick = new Decimal(0)

//Update
function update() {
    tickMult = new Decimal(1)
    if (tickspeed.gte(1000)) tickMult = tickMult.times(tickspeed.div(1000))
    collapseTick = collapseTick.add(tickMult)

    mult = tickMult
    if (rankBought.gte(1)) mult = mult.times(3)
    if (rankBought.gte(5)) mult = mult.times(Decimal.pow(2, rankBought))
        exp = new Decimal(1)
        if (enhancerBought.gte(1)) exp = exp.times(1.4)
        if (collapseUpgrades[2]) mult = mult.times(knowledge.pow(exp))
    coin = coin.add(coinGain.times(inflation.add(1)).times(mult))
    changeElement("coins", "You have "+format(coin)+" coins.")
    if (coin.gt(coinBest)) coinBest = coin

    infMult = new Decimal(1)
    if (rankBought.gte(2)) infMult = infMult.times(3)
    inflation = coinBest.pow(0.5).div(10).times(infMult)
    changeElement("inflation", format(coinBest)+" total coins is translated into a "+format(inflation.times(100))+"% inflation, which is directly boosting your coin production by "+format(inflation.add(1))+"x.")

    if (rankBought.gte(30) || knowledge.gt(1)) removeClass("collapseDiv", "locked")
    knwMult = new Decimal(1)
    if (collapseUpgrades[5]) knwMult = knwMult.times(Decimal.log10(collapseTick.add(10)))
    if (enhancerBought.gte(3)) knwMult = knwMult.times(1.8)
    changeElement("knowledge", "You have "+format(knowledge)+" knowledge")
    changeElement("collapseButton", "Collapse the economy to gain +"+format(Decimal.pow(10, Decimal.log10(coinBest.add(10)).div(32)).times(knwMult))+" knowledge")
    updateCollapse()
}
var updateVar = setInterval(update, new Decimal(1000).div(tickspeed))

//Automation (After Update)
function automate() {
    if (rankBought.gte(9) || collapseUpgrades[4]) tickUpgrade()
    if (rankBought.gte(15) || collapseUpgrades[4]) rankUpgrade()
}
var automateVar = setInterval(automate, 1)

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
    mult = new Decimal(1)
    if (enhancerBought.gte(2)) mult = mult.times(1.5)
    if (collapseUpgrades[3]) free = free.add(Decimal.floor(Decimal.ln(knowledge).div(Decimal.ln(2))).times(mult))
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
        update()
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
            update()
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
        update()
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
    
    changeElement("rankDesc", "Current Effect: "+format(rankBought)+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(rankCost)+" Coins")
    changeElement("rankEffect", rankEffect)
}

//Collapse
function collapse(reset=false) {
    if (!reset) {
        if (rankBought.gte(30)) {
            knwMult = new Decimal(1)
            if (collapseUpgrades[5]) knwMult = knwMult.times(Decimal.log10(collapseTick.add(10)))
            knowledge = knowledge.add(Decimal.pow(10, Decimal.log10(coinBest.add(10)).div(32)).times(knwMult))
            rankUpgrade(true)
            rankBought = new Decimal(0)
            rankCost = new Decimal(100)
            collapseTick = new Decimal(0)
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
        collapseTick = new Decimal(0)
        nextEffect = "Coin production x3"
        rankEffect = "Nothing"
        changeElement("rankDesc", "Current Effect: "+format(rankBought)+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(Decimal.pow(10, rankBought).times(100))+" Coins")
        changeElement("rankEffect", rankEffect)
        rankUpgrade(true)
    }
}

//Collapse Upgrade
var collapseUpgrades = [null, false, false, false, false, false]
function collapseUpgrade(id) {
    if (id == 1) {
        if (knowledge.gte(15) && !collapseUpgrades[1]) {
            knowledge = knowledge.sub(15)
            collapseUpgrades[1] = true
            collapse(true)
        }
    } else if (id == 2) {
        if (knowledge.gte(500) && !collapseUpgrades[2]) {
            knowledge = knowledge.sub(600)
            collapseUpgrades[2] = true
            collapse(true)
        }
    } else if (id == 3) {
        if (knowledge.gte(3e3) && !collapseUpgrades[3]) {
            knowledge = knowledge.sub(3e3)
            collapseUpgrades[3] = true
            collapse(true)
        }
    } else if (id == 4) {
        if (knowledge.gte(1e5) && !collapseUpgrades[4]) {
            knowledge = knowledge.sub(1e5)
            collapseUpgrades[4] = true
            collapse(true)
        }
    } else if (id == 5) {
        if (knowledge.gte(3e5) && !collapseUpgrades[5]) {
            knowledge = knowledge.sub(3e5)
            collapseUpgrades[5] = true
            collapse(true)
        }
    }
}
function updateCollapse() {
    if (collapseUpgrades[1]) {
        removeClass("collapseUpgrade1", "sale")
        changeElement("collapseUpgrade1", "<b>Supersonic Speed</b><br>Tickspeed Upgrade base power +0.5")
    }
    if (collapseUpgrades[2]) {
        removeClass("collapseUpgrade2", "sale")
        exp = new Decimal(1)
        if (enhancerBought.gte(1)) exp = exp.times(1.4)
        changeElement("collapseUpgrade2", "<b>Information Bank</b><br>Coin is boosted by knowledge<br><br>Currently: x"+format(knowledge.pow(exp)))
    }
    if (collapseUpgrades[3]) {
        removeClass("collapseUpgrade3", "sale")
        mult = new Decimal(1)
        if (enhancerBought.gte(2)) mult = mult.times(1.5)
        changeElement("collapseUpgrade3", "<b>Quick Learning</b><br>Get free Tickspeed Upgrades depending on knowledge<br><br>Currently: "+format(Decimal.floor(Decimal.ln(knowledge).div(Decimal.ln(2))).times(mult))+" free upgrades")
    }
    if (collapseUpgrades[4]) {
        removeClass("collapseUpgrade4", "sale")
        changeElement("collapseUpgrade4", "<b>Starting Resources</b><br>Unlock permanent Tickspeed and Rank Auto-Upgrade on collapse")
    }
    if (collapseUpgrades[5]) {
        removeClass("collapseUpgrade5", "sale")
        mult = new Decimal(1)
        if (enhancerBought.gte(3)) mult = mult.times(1.8)
        changeElement("collapseUpgrade5", "<b>Time Savings</b><br>You gain more knowledge based on tick passed<br><br>Currently: x"+format(Decimal.log10(collapseTick.add(10)).times(mult)))
    }
}

//Enhancers
var enhancerBought = new Decimal(0)
function enhancer(update=false) {
    if (!update && enhancerBought.lt(3)) {
        collapse(true)
        if (knowledge.gte(Decimal.pow(10, enhancerBought.min(2).times(2)).times(1e8))) {
            knowledge = knowledge.sub(Decimal.pow(10, enhancerBought.min(3).times(2)).times(1e8))
            enhancerBought = enhancerBought.add(1)
        }
    }

    if (enhancerBought.eq(0)) nextEffect = "Information Bank power ^1.4"
    else if (enhancerBought.eq(1)) nextEffect = "Quick Learning power x1.5"
    else if (enhancerBought.eq(2)) nextEffect = "Time Savings power x1.8"
    else nextEffect = "Maxed"

    if (enhancerBought.gte(0)) enhancerEffect = "Nothing"
    if (enhancerBought.gte(1)) enhancerEffect = "1 Enhancer: Information Bank power ^1.4"
    if (enhancerBought.gte(2)) enhancerEffect = enhancerEffect+"<br>2 Enhancers: Quick Learning power x1.5"
    if (enhancerBought.gte(3)) enhancerEffect = enhancerEffect+"<br>3 Enhancers: Time Savings power x1.8"

    changeElement("enhancerDesc", "Current Effect: "+format(enhancerBought)+" enhancers<br>Next Effect: "+nextEffect+"<br>Cost: "+format(Decimal.pow(10, enhancerBought.min(2).times(2)).times(1e8))+" Coins")
    changeElement("enhancerEffect", enhancerEffect)
}
