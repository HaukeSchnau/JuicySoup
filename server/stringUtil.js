function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function capitalizeEveryWord(string) {
    return string
        .split(".")
        .slice(0, -1)
        .join(".")
        .split(" ")
        .map(word => capitalize(word))
        .join(" ");
}

function dashToCamelCase(str) {
    return str.replace(/-([a-z])/g, function(g) {
        return g[1].toUpperCase();
    });
}

function camelCaseToDash(myStr) {
    return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

module.exports = {
    camelCaseToDash,
    dashToCamelCase,
    capitalize,
    capitalizeEveryWord,
};
