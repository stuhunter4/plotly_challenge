// use the D3 library to read in samples.json
d3.json("samples.json").then((importedData) => {
    var data = importedData;
    console.log(data);
    // append list of id's to the dropdown menu
    var ddownMenu = d3.select("#selDataset");
    for (var i = 0; i < data.names.length; i++) {
        ddownMenu.append("option").text(data.names[i]);
    }
});

// helper function to select data and return an array of values..
// @param {array} rows, and @param {integer} index
function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}

// on change to the DOM, call optionChanged()
d3.selectAll("#selDataset").on("change", optionChanged);

// function called by DOM changes
function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    // assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    console.log(dataset);
    // filter by dropdown menu option and assign data to variables
    d3.json("samples.json").then((data) => {
        console.log(data.samples[5]['id']);
        
        var sample_values = [];
        var otu_ids = [];
        var otu_labels = [];

        for (var i = 0; i < data.names.length; i++) {
            if (data.samples[i]['id'] == dataset) {
                sample_values.push(data.samples[i]['sample_values']);
                otu_ids.push(data.samples[i]['otu_ids']);
                otu_labels.push(data.samples[i]['otu_labels']);
                break;
            }
            else {
                console.log("whoops!")
            }
        }
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        buildHbar(sample_values, otu_ids, otu_labels);
        //buildBubble();
        //buildPanel();
        //buildGauge();
    });
}

function buildHbar(sample_values, otu_ids, otu_labels) {
    slice_sample = sample_values[0].slice(0,10);
    slice_ids = otu_ids[0].slice(0,10);
    slice_labels = otu_labels[0].slice(0,10);

    var new_ids = [];
    for (var i = 0; i < slice_ids.length; i++) {
        new_ids.push(`OTU ${slice_ids[i]}`);
    }

    console.log(slice_sample);
    console.log(new_ids);
    console.log(slice_labels);
    var data = [{
        type: 'bar',
        x: slice_sample,
        y: new_ids,
        text: slice_labels,
        orientation: 'h'
    }];
    console.log(data)
    Plotly.newPlot('bar', data);
}