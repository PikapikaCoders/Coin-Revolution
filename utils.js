function changeElement(id, context) {
    document.getElementById(id).innerHTML = context
}
function addClass(id, name) {
    document.getElementById(id).classList.add(name)
}
function removeClass(id, name) {
    document.getElementById(id).classList.remove(name)
}
function checkClass(id, name) {
    document.getElementById(id).classList.contains(name)
}

function format(decimal, precision=2, scientificPrecision=2) {
    if (decimal.eq(0)) return (0).toFixed(precision)  
    else if (decimal.lt(1e3) && decimal.gt(0)) return decimal.toStringWithDecimalPlaces(precision)
    else if (decimal.lt(new Decimal("eee15")) || decimal.lt(0)) return toScientific(decimal, scientificPrecision)
    else return "ERROR"
}
function toScientific(decimal, precision=2) {
    mag = Decimal.floor(Decimal.log10(decimal))
    if (isNaN(Decimal.log10(decimal))) mag = new Decimal(0)
    mult = decimal.div(Decimal.pow(10, mag)).toStringWithDecimalPlaces(precision)
    if (new Decimal(mag).gte(1e3)) {
        mag = format(new Decimal(mag), 0, 3)
        mult = ""
    }
    return mult+"e"+mag
}