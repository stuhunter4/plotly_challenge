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
        }
        // call our build'Chart' functions with our filtered data
        buildHbar(sample_values, otu_ids, otu_labels);
        buildBubble(otu_ids, sample_values, otu_labels);
        buildPanel(metadata);
        buildGauge(metadata);
        
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
    // straightforward basic bubble chart using the json data
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
    // create variable to store metadata object
    var info = metadata[0];
    // iterate through each key and value of the metadata object..
    Object.entries(info).forEach(([key, value]) => {
        // append each key-value pair to the panel body
        pbody.append("p").text(`${key}: ${value}`);
    });
    
}

function buildGauge(metadata) {
    var infoG = metadata[0]['wfreq']
    console.log(infoG);
    // tried the gauge chart, didn't work; google searches reveal many use a half pie/donut..
    // with svg coordinates to draw a line indicator
    var dataG = [{
        type: "pie",
        showlegend: false,
        hole: 0.45,
        rotation: 90,
        values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100],
        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        direction: "clockwise",
        textinfo: "text",
        textposition: "indside",
        marker: {
            colors: ["rgba(253, 231, 37, 0.6)", "rgba(180, 222, 44, 0.6)", "rgba(109, 205, 89, 0.6)", "rgba(53, 183, 121, 0.6)", "rgba(31, 158, 137, 0.6)", "rgba(38, 130, 142, 0.6)", "rgba(49, 104, 142, 0.6)", "rgba(62, 74, 137, 0.6)", "rgba(72, 40, 120, 0.6)", "white"]
        },
        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        hoverinfo: "label"
    }];
    // due to my lack of execution using geometry, I used time, trial and error..
    // and this long if statement to give the correct (x, y) coordinates for the line end point
    if (infoG == 1) {
        var x = 0.25;
        var y = 0.6;
    }
    else if (infoG == 2) {
        var x = 0.28;
        var y = 0.69;
    }
    else if (infoG == 3) {
        var x = 0.36;
        var y = 0.76;
    }
    else if (infoG == 4) {
        var x = 0.46;
        var y = 0.8;
    }
    else if (infoG == 5) {
        var x = 0.54;
        var y = 0.8;
    }
    else if (infoG == 6) {
        var x = 0.64;
        var y = 0.76;
    }
    else if (infoG == 7) {
        var x = 0.72;
        var y = 0.69;
    }
    else if (infoG == 8) {
        var x = 0.76;
        var y = 0.6;
    }
    else if (infoG == 9) {
        var x = 0.79;
        var y = 0.51;
    }
    else {
        var x = 0.21;
        var y = 0.51;
    }
    var layoutG = {
        shapes:[{
            type: 'line',
            x0: 0.5,
            y0: 0.5,
            x1: x,
            y1: y,
            line: {
              color: 'red',
              width: 7
            }
          }],
        title: 'Belly Button Washing Frequency\nScrubs per Week',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
      };
    Plotly.newPlot('booth', dataG, layoutG, {staticPlot: true});
}
