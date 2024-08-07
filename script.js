//Start
var coin = new Decimal(0)
var coinBest = new Decimal(0)
var inflation = new Decimal(0)
var tickspeed = new Decimal(1)
//Collapse
var knowledge = new Decimal(0)
var collapseTick = new Decimal(0)
//Cash
var cash = new Decimal(0)

//Update
function update() {
    var tickMult = new Decimal(1)
    if (tickspeed.gte(1000)) tickMult = tickMult.times(tickspeed.div(1000))
    collapseTick = collapseTick.add(tickMult)

    var mult = tickMult
    //Rank 1
    if (rankBought.add(getFreeRank()).gte(1)) mult = mult.times(3)
    //Rank 5
    var power = new Decimal(2)
    if (collapseUpgrades[6]) power = power.times(1.25)
    if (rankBought.add(getFreeRank()).gte(5)) mult = mult.times(Decimal.pow(power, rankBought.add(getFreeRank())))
    //CU 2
    var exp = new Decimal(1)
    if (enhancerBought.gte(1)) exp = exp.times(1.4)
    if (collapseUpgrades[2]) mult = mult.times(knowledge.add(1).pow(exp))
    //CU 7
    if (collapseUpgrades[7]) mult = mult.times(knowledge.pow(0.1).times(3).add(1))
    //Cash
    if (cash.gte(1)) mult = mult.times(cash.pow(3))
    coin = coin.add(new Decimal(1).times(inflation.add(1)).times(mult))
    if (cashChallangeActive) changeElement("coins", "You have "+format(coin)+" coins <span style=\"color:red\">inside of Cash Bank</span>.")
    else changeElement("coins", "You have "+format(coin)+" coins.")
    if (coin.gt(coinBest)) coinBest = coin

    var infMult = new Decimal(1)
    //Rank 2
    if (rankBought.add(getFreeRank()).gte(2)) infMult = infMult.times(3)
    //CU 7
    if (collapseUpgrades[7]) infMult = infMult.times(knowledge.pow(0.1).times(3).add(1))
    inflation = coinBest.pow(0.5).div(10).times(infMult)
    changeElement("inflation", format(coinBest)+" total coins is translated into a "+format(inflation.times(100))+"% inflation, which is directly boosting your coin production by "+format(inflation.add(1))+"x.")

    //CU 9
    if (collapseUpgrades[9]) changeElement("rankReset", "Reset your tickspeed but give a boost according to rank")
    else changeElement("rankReset", "Reset your coins and tickspeed but give a boost according to rank")
    if (rankBought.add(getFreeRank()).gte(30) || knowledge.gt(1)) removeClass("collapseDiv", "locked")
    knwMult = new Decimal(1)
    //CU 5
    var mult = new Decimal(1)
    var exp = new Decimal(1)
    if (enhancerBought.gte(3)) {
        mult = mult.times(2)
        exp = exp.times(1.2)
    }
    if (collapseUpgrades[5] && !isNaN(Decimal.log10(collapseTick.add(10)).times(mult).pow(exp))) knwMult = knwMult.times(Decimal.log10(collapseTick.add(10)).times(mult).pow(exp))
    //CU 10
    if (collapseUpgrades[10]) knwMult = knwMult.times(new Decimal(getCollapseTime()).add(1).pow(0.6))
    //Cash Bank
    if (cashChallangeCompleted) knwMult = knwMult.times(cash.pow(0.5))
    changeElement("knowledge", "You have "+format(knowledge)+" knowledge")
    var knwGain = Decimal.pow(10, Decimal.log10(coinBest.add(10)).div(32)).times(knwMult)
    if (cashChallangeActive) knwGain = knwGain.pow(0.8)
    changeElement("collapseButton", "Collapse the economy to gain +"+format(knwGain)+" knowledge")
    if (enhancerBought.gte(5)) removeClass("chargedCollapseDiv", "locked")
    updateCollapse()

    if (knowledge.gt(1e30) || cash.gt(0) || cashInflationBought.gte(1)) removeClass("cashTab", "locked")
    if (knowledge.gt(1e30)) {
        var gain = Decimal.pow(3, cashInflationBought)
        //Enhancer 6
        if (enhancerBought.gte(6)) gain = gain.times(knowledge.pow(0.1).times(3).pow(0.5).add(1))
        cash = cash.add(gain.div(1000))
    }
    changeElement("cashDesc", "You have "+format(cash)+" cash")
    changeElement("cashBoost", "Due to currency exchange, coin production is boosted by x"+format(cash.pow(3))+".")
    if (cashChallangeCompleted) changeElement("cashChallangeCompletion", "CHALLANGE COMPLETED")
}
var updateVar = setInterval(update, new Decimal(1000).div(tickspeed))

//Automation (After Update)
function automate() {
    if (rankBought.add(getFreeRank()).gte(9) || collapseUpgrades[4]) tickUpgrade()
    if (rankBought.add(getFreeRank()).gte(15) || collapseUpgrades[4]) rankUpgrade()
}
var automateVar = setInterval(automate, 1)

//Tickspeed Upgrade
var tickspeedBought = new Decimal(0)
var getTickspeedBase = function() {
    tickspeedBase = new Decimal(1.2)
    if (rankBought.add(getFreeRank()).gte(3)) tickspeedBase = tickspeedBase.add(0.3)
        var power = new Decimal(0.5)
        if (enhancerBought.gte(4)) power = power.add(0.05)
        if (collapseUpgrades[1]) tickspeedBase = tickspeedBase.add(power)
    return tickspeedBase
}
var getFreeTickspeed = function() {
    var free = new Decimal(0)
    var mult = new Decimal(1)
    if (enhancerBought.gte(2)) mult = mult.times(1.5)
    if (collapseUpgrades[3]) free = free.add(Decimal.floor(Decimal.ln(knowledge).div(Decimal.ln(2))).times(mult).max(1))
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
var getFreeRank = function() {
    var free = new Decimal(0)
    if (collapseUpgrades[8]) free = free.add(Decimal.floor(Decimal.log10(knowledge.add(10)).div(5)).max(1))
    return free
}
function rankUpgrade(reset=false) {
    if (!reset) {
        if (coin.gte(rankCost)) {
            rankBought = rankBought.add(1)
            var mult = new Decimal(10)
            if (rankBought.gte(30)) mult = Decimal.pow(10, rankBought.sub(29).max(0))
            rankCost = rankCost.times(mult)
            rankUpdate() 
            if (!collapseUpgrades[9]) {
                coin = new Decimal(0)
                coinBest = new Decimal(0)
                inflation = new Decimal(0)
                tickspeed = Decimal.pow(getTickspeedBase(), getFreeTickspeed())
                tickspeedBought = new Decimal(0)
            }
            if (tickspeedBought.gte(14)) cost = Decimal.pow(8, tickspeedBought.sub(14).max(0)).times(1e5)
            else cost = Decimal.pow(2, tickspeedBought).times(10)
            changeElement("tickspeedDesc", "Current Effect: x"+format(tickspeed)+"<br>Next Effect: x"+format(tickspeed.times(getTickspeedBase()))+"<br>Cost: "+format(cost)+" Coins")
            clearInterval(updateVar)
            updateVar = setInterval(update, new Decimal(1000).div(tickspeed))
            update()
        }
    } else {
        coin = new Decimal(0)
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
    if (rankBought.add(getFreeRank()).eq(0)) nextEffect = "Coin production x3"
    else if (rankBought.add(getFreeRank()).eq(1)) nextEffect = "Inflation formula x3"
    else if (rankBought.add(getFreeRank()).eq(2)) nextEffect = "Tickspeed Upgrade base +0.3"
    else if (rankBought.add(getFreeRank()).eq(4)) {
        var power = "2"
        if (collapseUpgrades[6]) power = "2.5"
        nextEffect = "Coin production x"+power+" per rank"
    }
    else if (rankBought.add(getFreeRank()).eq(8)) nextEffect = "Automate Tickspeed Upgrade"
    else if (rankBought.add(getFreeRank()).eq(14)) nextEffect = "Automate Rank Upgrade"
    else if (rankBought.add(getFreeRank()).eq(29)) nextEffect = "Unlock Economy Collapse"
    else nextEffect = "Progress to the next rank"
    
    if (rankBought.add(getFreeRank()).gte(0)) rankEffect = "Nothing"
    if (rankBought.add(getFreeRank()).gte(1)) rankEffect = "Rank 1: Coin production x3"
    if (rankBought.add(getFreeRank()).gte(2)) rankEffect = rankEffect+"<br>Rank 2: Inflation formula x3"
    if (rankBought.add(getFreeRank()).gte(3)) rankEffect = rankEffect+"<br>Rank 3: Tickspeed Upgrade base +0.3"
    if (rankBought.add(getFreeRank()).gte(5)) {
        var power = "2"
        if (collapseUpgrades[6]) power = "2.5"
        rankEffect = rankEffect+"<br>Rank 5: Coin production x"+power+" per rank"
    }
    if (rankBought.add(getFreeRank()).gte(9)) rankEffect = rankEffect+"<br>Rank 9: Automate Tickspeed Upgrade"
    if (rankBought.add(getFreeRank()).gte(15)) rankEffect = rankEffect+"<br>Rank 15: Automate Rank Upgrade"
    if (rankBought.add(getFreeRank()).gte(30)) rankEffect = rankEffect+"<br>Rank 30: Unlock Economy Collapse"
    
    changeElement("rankDesc", "Current Effect: "+format(rankBought.add(getFreeRank()))+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(rankCost)+" Coins")
    changeElement("rankEffect", rankEffect)
}

//Collapse
var collapseStart = performance.now()
var getCollapseTime = function() {
    return (performance.now()-collapseStart)/1000
}
function collapse(reset=false) {
    if (!reset) {
        if (rankBought.gte(30)) {
            knwMult = new Decimal(1)
            //CU 5
            mult = new Decimal(1)
            exp = new Decimal(1)
            if (enhancerBought.gte(3)) {
                mult = mult.times(2)
                exp = exp.times(1.2)
            }
            if (collapseUpgrades[5] && !isNaN(Decimal.log10(collapseTick.add(10)).times(mult).pow(exp))) knwMult = knwMult.times(Decimal.log10(collapseTick.add(10)).times(mult).pow(exp))
            //CU 10
            if (collapseUpgrades[10]) knwMult = knwMult.times(new Decimal(getCollapseTime()).add(1).pow(0.6))
            //Cash Bank
            if (cashChallangeCompleted) knwMult = knwMult.times(cash.pow(0.5))
            var knwGain = Decimal.pow(10, Decimal.log10(coinBest.add(10)).div(32)).times(knwMult)
            if (cashChallangeActive) knwGain = knwGain.pow(0.8)
            knowledge = knowledge.add(knwGain)
            rankUpgrade(true)
            rankBought = getFreeRank()
            rankCost = new Decimal(100)
            collapseTick = new Decimal(0)
            collapseStart = performance.now()
            nextEffect = "Coin production x3"
            rankEffect = "Nothing"
            changeElement("rankDesc", "Current Effect: "+format(rankBought)+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(Decimal.pow(10, rankBought).times(100))+" Coins")
            changeElement("rankEffect", rankEffect)
        } else {
            alert("You need Rank 30 to use this button!")
        }
    } else { 
        rankUpgrade(true)
        rankBought = getFreeRank()
        rankCost = new Decimal(100)
        collapseTick = new Decimal(0)
        collapseStart = performance.now()
        nextEffect = "Coin production x3"
        rankEffect = "Nothing"
        changeElement("rankDesc", "Current Effect: "+format(rankBought, 0)+" ranks<br>Next Effect: "+nextEffect+"<br>Cost: "+format(Decimal.pow(10, rankBought).times(100))+" Coins")
        changeElement("rankEffect", rankEffect)
    }
}

//Collapse Upgrade
var collapseUpgrades = [null, false, false, false, false, false, false, false, false, false, false]
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
    } else if (id == 6) {
        if (knowledge.gte(1e17) && !collapseUpgrades[6]) {
            knowledge = knowledge.sub(1e17)
            collapseUpgrades[6] = true
            collapse(true)
        }
    } else if (id == 7) {
        if (knowledge.gte(2e21) && !collapseUpgrades[7]) {
            knowledge = knowledge.sub(2e21)
            collapseUpgrades[7] = true
            collapse(true)
        }
    } else if (id == 8) {
        if (knowledge.gte(2e25) && !collapseUpgrades[8]) {
            knowledge = knowledge.sub(2e25)
            collapseUpgrades[8] = true
            collapse(true)
        }
    } else if (id == 9) {
        if (knowledge.gte(1e27) && !collapseUpgrades[9]) {
            knowledge = knowledge.sub(1e27)
            collapseUpgrades[9] = true
            collapse(true)
        }
    } else if (id == 10) {
        if (knowledge.gte(1e28) && !collapseUpgrades[10]) {
            knowledge = knowledge.sub(1e28)
            collapseUpgrades[10] = true
            collapse(true)
        }
    }
}
function updateCollapse() {
    if (collapseUpgrades[1]) {
        removeClass("collapseUpgrade1", "sale")
        var power = "0.5"
        if (enhancerBought.gte(4)) power = "0.55"
        changeElement("collapseUpgrade1", "<b>Supersonic Speed</b><br>Tickspeed Upgrade base power +"+power)
    }
    if (collapseUpgrades[2]) {
        removeClass("collapseUpgrade2", "sale")
        var exp = new Decimal(1)
        if (enhancerBought.gte(1)) exp = exp.times(1.4)
        changeElement("collapseUpgrade2", "<b>Information Bank</b><br>Coin is boosted by knowledge<br><br>Currently: x"+format(knowledge.add(1).pow(exp)))
    }
    if (collapseUpgrades[3]) {
        removeClass("collapseUpgrade3", "sale")
        var mult = new Decimal(1)
        if (enhancerBought.gte(2)) mult = mult.times(1.5)
        changeElement("collapseUpgrade3", "<b>Quick Learning</b><br>Get free Tickspeed Upgrades depending on knowledge<br><br>Currently: "+format(Decimal.floor(Decimal.ln(knowledge.add(2)).div(Decimal.ln(2))).times(mult).max(1))+" free upgrades")
    }
    if (collapseUpgrades[4]) {
        removeClass("collapseUpgrade4", "sale")
        changeElement("collapseUpgrade4", "<b>Starting Resources</b><br>Unlock permanent Tickspeed and Rank Auto-Upgrade on collapse")
    }
    if (collapseUpgrades[5]) {
        removeClass("collapseUpgrade5", "sale")
        var mult = new Decimal(1)
        var exp = new Decimal(1)
        if (enhancerBought.gte(3)) {
            mult = mult.times(2)
            exp = exp.times(1.2)
        }
        if (!isNaN(Decimal.log10(collapseTick.add(10)).times(mult).pow(exp))) changeElement("collapseUpgrade5", "<b>Time Savings</b><br>You gain more knowledge based on tick passed<br><br>Currently: x"+format(Decimal.log10(collapseTick.add(10)).times(mult).pow(exp)))
        else changeElement("collapseUpgrade5", "<b>Time Savings</b><br>You gain more knowledge based on tick passed<br><br>Currently: x1.00")
    }
    if (collapseUpgrades[6]) {
        removeClass("collapseUpgrade6", "sale")
        changeElement("collapseUpgrade6", "<b>Speed of Light</b><br>Rank 5 effect power x1.25")
    }
    if (collapseUpgrades[7]) {
        removeClass("collapseUpgrade7", "sale")
        changeElement("collapseUpgrade7", "<b>Information Tower</b><br>Coin and Inflation is boosted by knowledge<br><br>Currently: x"+format(knowledge.pow(0.1).times(3).add(1)))
    }
    if (collapseUpgrades[8]) {
        removeClass("collapseUpgrade8", "sale")
        changeElement("collapseUpgrade8", "<b>Learning Network</b><br>Get free Rank Upgrades depending on knowledge<br><br>Currently: "+format(Decimal.floor(Decimal.log10(knowledge.add(10)).div(5)).max(1))+" free upgrades")
    }
    if (collapseUpgrades[9]) {
        removeClass("collapseUpgrade9", "sale")
        changeElement("collapseUpgrade9", "<b>Voidless</b><br>Rank Upgrade doesn't reset anything")
    }
    if (collapseUpgrades[10]) {
        removeClass("collapseUpgrade10", "sale")
        changeElement("collapseUpgrade10", "<b>Rainy Day</b><br>You gain more knowledge based on real-time passed this online session<br><br>Currently: x"+format(new Decimal(getCollapseTime()).add(1).pow(0.6)))
    }
}

//Enhancers
var enhancerBought = new Decimal(0)
function enhancer(update=false) {
    var cost = Decimal.pow(10, enhancerBought.times(2)).times(1e8)
    if (enhancerBought.eq(3)) cost = new Decimal(1e15)
    if (enhancerBought.eq(4)) cost = new Decimal(1e18)
    if (enhancerBought.gte(5)) cost = new Decimal(3e37)
    if (!update && enhancerBought.lt(6)) {
        collapse(true)
        if (knowledge.gte(cost)) {
            knowledge = knowledge.sub(cost)
            enhancerBought = enhancerBought.add(1)
        }
    }

    if (enhancerBought.eq(0)) nextEffect = "Information Bank power ^1.4"
    else if (enhancerBought.eq(1)) nextEffect = "Quick Learning power x1.5"
    else if (enhancerBought.eq(2)) nextEffect = "Time Savings power x2 and ^1.2"
    else if (enhancerBought.eq(3)) nextEffect = "Supersonic Speed power +0.05"
    else if (enhancerBought.eq(4)) nextEffect = "Unlock Charged Collapse Upgrades"
    else if (enhancerBought.eq(5)) nextEffect = "Information Tower also boosts Cash with worse effect"
    else nextEffect = "Maxed"

    if (enhancerBought.gte(0)) enhancerEffect = "Nothing"
    if (enhancerBought.gte(1)) enhancerEffect = "1 Enhancer: Information Bank power ^1.4"
    if (enhancerBought.gte(2)) enhancerEffect = enhancerEffect+"<br>2 Enhancers: Quick Learning power x1.5"
    if (enhancerBought.gte(3)) enhancerEffect = enhancerEffect+"<br>3 Enhancers: Time Savings power x2 and ^1.2"
    if (enhancerBought.gte(4)) enhancerEffect = enhancerEffect+"<br>4 Enhancers: Supersonic Speed power +0.05"
    if (enhancerBought.gte(5)) enhancerEffect = enhancerEffect+"<br>5 Enhancers: Unlock Charged Collapse Upgrades"
    if (enhancerBought.gte(6)) enhancerEffect = enhancerEffect+"<br>6 Enhancers: Information Tower also boosts Cash with worse effect"

    changeElement("enhancerDesc", "Current Effect: "+format(enhancerBought, 0)+" enhancers<br>Next Effect: "+nextEffect+"<br>Cost: "+format(cost)+" Coins")
    changeElement("enhancerEffect", enhancerEffect)
}

//Cash
var cashInflationBought = new Decimal(0)
function cashInflation() {
    var cost = Decimal.pow(10, cashInflationBought).times(10)
    if (cashInflationBought.gte(9)) cost = Decimal.pow(10, cashInflationBought.sub(10).max(1)).times(1e10)
    if (knowledge.gte(cost)) {
        cashInflationBought = cashInflationBought.add(1)
        changeElement("cashInflationDesc", "Current Effect: x"+format(Decimal.pow(3, cashInflationBought))+"<br>Next Effect: x"+format(Decimal.pow(3, cashInflationBought.add(1)))+"<br>Require: "+format(cost)+" Cash")
    }
}

var cashChallangeCompleted = false;
var cashChallangeActive = false;
var savedKnowledge = new Decimal(0);
function cashChallange() {
    if (!cashChallangeActive) {
        collapse(true)
        savedKnowledge = knowledge
        knowledge = new Decimal(0)
    } else {
        knowledge = savedKnowledge
        collapse(true)
        if (knowledge.gte(1e25)) cashChallangeCompleted = true;
        savedKnowledge = new Decimal(0)
    }
    cashChallangeActive = !cashChallangeActive
}