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
    else if (!decimal.gte(1e3)) return decimal.toStringWithDecimalPlaces(precision)
    else if (!decimal.gte(new Decimal("eee15"))) return toScientific(decimal, scientificPrecision)
    else return "[Dev didn't made the formatting this big]"
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