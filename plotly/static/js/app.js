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
        // create empty arrays to use in our visualizations
        var sample_values = [];
        var otu_ids = [];
        var otu_labels = [];
        var metadata = [];
        // loop through 'samples' to find the id that matches the selection..
        // then append the data to our empty arrays
        for (var i = 0; i < data.names.length; i++) {
            if (data.samples[i]['id'] == dataset) {
                sample_values.push(data.samples[i]['sample_values']);
                otu_ids.push(data.samples[i]['otu_ids']);
                otu_labels.push(data.samples[i]['otu_labels']);
                metadata.push(data.metadata[i]);
                break;
            }
            else {
                console.log("whoops!");
            }
        }
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);
        console.log(metadata);
        // call our build'Chart' functions with our filtered data
        buildHbar(sample_values, otu_ids, otu_labels);
        buildBubble(otu_ids, sample_values, otu_labels);
        buildPanel(metadata);
        //buildGauge();
    });
}

function buildHbar(sample_values, otu_ids, otu_labels) {
    // use the slice method to graph the first/top ten results
    slice_sample = sample_values[0].slice(0,10);
    slice_ids = otu_ids[0].slice(0,10);
    slice_labels = otu_labels[0].slice(0,10);
    // loop through ids to create a new array of id strings
    var new_ids = [];
    for (var i = 0; i < slice_ids.length; i++) {
        new_ids.push(`OTU ${slice_ids[i]}`);
    }
    // use the reverse method to reverse the order of elements in an array..
    // for better visualizations: maintaing descending order in the bar chart
    slice_sample.reverse();
    new_ids.reverse();
    slice_labels.reverse();

    //console.log(slice_sample);
    //console.log(new_ids);
    //console.log(slice_labels);
    // add attributes and plot the horizontal bar chart
    var data = [{
        type: 'bar',
        x: slice_sample,
        y: new_ids,
        text: slice_labels,
        orientation: 'h'
    }];
    Plotly.newPlot('bar', data);
}

function buildBubble(otu_ids, sample_values, otu_labels) {
    var dataB = [{
        x: otu_ids[0],
        y: sample_values[0],
        text: otu_labels[0],
        mode: 'markers',
        marker: {
            color: otu_ids[0],
            size: sample_values[0]
        }
    }];
    var layoutB = {
        title: 'OTU ID',
        showlegend: false,
        height: 600,
        width: 1200
    };
    Plotly.newPlot('bubble', dataB, layoutB)
}

function buildPanel(metadata) {
    // create a reference to the panel body
    var pbody = d3.select("#sample-metadata");
    // empty the body
    pbody.html("");
    var info = metadata[0];
    // iterate through each key and value
    Object.entries(info).forEach(([key, value]) => {
        pbody.append("p").text(`${key}: ${value}`);
    });
}