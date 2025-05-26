/**
 * Change Element by ID
 */
function changeElement(id, context) {
    document.getElementById(id).innerHTML = context
}

/**
 * Add Class to Element
 */
function addClass(id, name) {
    document.getElementById(id).classList.add(name)
}

/**
 * Remove Class to Element
 */
function removeClass(id, name) {
    document.getElementById(id).classList.remove(name)
}

/**
 * Check if Element contains Class
 */
function checkClass(id, name) {
    document.getElementById(id).classList.contains(name)
}

/**
 * Format Decimal with EternalNotations
 */
function format(decimal) {
    if (decimal.gte(1e3) || decimal.lt(0.1)) output = EternalNotations.Presets.Scientific.format(decimal)
    else output = decimal.toFixed(2)
    return output;
}

/**
 * Does a log using the ln(num)/ln(base) method. Never returns NaN.
 */
function lnLog(decimal, base) {
    return Decimal.ln(decimal).div(Decimal.ln(base))
}