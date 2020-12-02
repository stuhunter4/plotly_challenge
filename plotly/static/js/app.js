// use the D3 library to read in samples.json
d3.json("samples.json").then((data) => {
    var names = data.names;
})

// append list of id's to the dropdown menu
var ddownMenu = d3.select("#selDataset");
var select = ddownMenu.select("select");
for (var i = 0; i < names.length; i++) {
    select.append("option").text(names[i]);
}



// helper function to select data and return an array of values
// @param {array} rows and @param {integer} index
function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}

// on change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// function called by DOM changes
function getData() {
    var dropdownMenu = d3.select("#selDataset");
    // assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    // 
    d3.json("samples.json").then((data) => {
        var ids
        var demo_info

    });
}