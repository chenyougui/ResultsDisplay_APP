var roi = ee.FeatureCollection("users/chenwugui7170/FJ_database/Fujian_Sanming_jiangle"),
    S2 = ee.ImageCollection("COPERNICUS/S2_HARMONIZED"),
    S1 = ee.ImageCollection("COPERNICUS/S1_GRD"),
    Forest = ee.Image("projects/ee-chenmus/assets/LUCC/Forest0323"),
    LUCC_verify_points = ee.FeatureCollection("projects/ee-chenwugui7170/assets/samples_all/train_points_LUCC"),
    LUCC_classify_points = ee.FeatureCollection("projects/ee-chenwugui7170/assets/samples_all/verify_points_LUCC"),
    FC_verify_points = ee.FeatureCollection("projects/ee-chenmus/assets/FC/validation"),
    FC_classify_points = ee.FeatureCollection("projects/ee-chenmus/assets/FC/train_new"),
    R_S1WinterS2WinterCloudy = ee.Image("projects/ee-chenmus/assets/LUCC/2018_winter_S1_S2winterCloudy"),
    R_S1winter = ee.Image("projects/ee-chenmus/assets/LUCC/2018_winter_S1"),
    R_S1winterS2year = ee.Image("projects/ee-chenmus/assets/LUCC/2018_winter_S1_S2year"),
    R_S2WinterCloudy = ee.Image("projects/ee-chenwugui7170/assets/ClassificationReuslts/Result_S2WinterCloudy"),
    R_S2winter = ee.Image("projects/ee-chenmus/assets/LUCC/2018_winterCloudy_S2"),
    R_S2year = ee.Image("projects/ee-chenmus/assets/LUCC/2018_winter_S2"),
    R_S1S2winter = ee.Image("projects/ee-chenmus/assets/LUCC/2018_winter_S12"),
    FC_S2_BIT = ee.Image("projects/ee-chenmus/assets/FC/orignalS2"),
    FC_A_S1S2 = ee.Image("projects/ee-chenmus/assets/FC/orignalS1S2no"),
    FC_B_S1S2 = ee.Image("projects/ee-chenmus/assets/FC/orignalS1S2");


var styling = { color: 'red', fillColor: '00000000' };
var studyarea = roi.style(styling)

function maskS2clouds(image) {
    var qa = image.select('QA60');
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
        qa.bitwiseAnd(cirrusBitMask).eq(0))
    return image.updateMask(mask).divide(10000)
        .select("B.*")
        .copyProperties(image, ["system:time_start"])
}
var S2_year = S2.filterDate('2018-01-01', '2019-01-01')
    .filter(ee.Filter.lt('CLOUD_COVERAGE_ASSESSMENT', 5))
    .map(maskS2clouds)
    .mosaic().clip(roi)
    .visualize({ bands: ['B4', 'B3', 'B2'], min: 0.0, max: 0.3 });
var S2_winter = S2.filterDate('2018-12-01', '2019-03-01')
    .filter(ee.Filter.lt('CLOUD_COVERAGE_ASSESSMENT', 5))
    .map(maskS2clouds)
    .mosaic().clip(roi)
    .visualize({ bands: ['B4', 'B3', 'B2'], min: 0.0, max: 0.3 });
var S2_wintercloudy = S2.filterDate('2018-12-01', '2018-12-19')
    .filter(ee.Filter.lt('CLOUD_COVERAGE_ASSESSMENT', 5))
    .map(maskS2clouds)
    .mosaic().clip(roi)
    .visualize({ bands: ['B4', 'B3', 'B2'], min: 0.0, max: 0.3 });

var S1_winter_VV = S1.filterDate('2018-12-01', '2019-03-01')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
    .select(['VV'])
    .mean()
    .clip(roi)
    .visualize({ min: -25, max: 0 });


var S1_winter_VH = S1.filterDate('2018-12-01', '2019-03-01')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
    .select(['VH'])
    .mean()
    .clip(roi)
    .visualize({ min: -25, max: 0 });




///////Results
var Forest = Forest.updateMask(Forest).visualize({ palette: 'green' });

var LUCC_vis = {
    min: 1,
    max: 5,
    palette: ["#f4a460", "#a9a9a9", "#ff0000", "#228b22", "#0000ff"]
};
var FC_vis = {
    min: 1,
    max: 5,
    palette: ['a6cee3', '1f78b4', '33a02c', 'fb9a99', 'e31a1c',
        'ff7f00', 'cab2d6', '6a3d9a'
    ]
};
var Result_S1S2winter = R_S1S2winter.visualize(LUCC_vis).clip(roi);
var Result_S1WinterS2WinterCloudy = R_S1WinterS2WinterCloudy.visualize(LUCC_vis).clip(roi);
var Result_S1winter = R_S1winter.visualize(LUCC_vis).clip(roi);
var Result_S1winterS2year = R_S1winterS2year.visualize(LUCC_vis).clip(roi);
var Result_S2WinterCloudy = R_S2WinterCloudy.visualize(LUCC_vis).clip(roi);
var Result_S2winter = R_S2winter.visualize(LUCC_vis).clip(roi);
var Result_S2year = R_S2year.visualize(LUCC_vis).clip(roi);

var FC_Result_FC_S2_BIT = FC_S2_BIT.visualize(FC_vis).clip(roi)
var FC_Result_FC_A_S1S2 = FC_A_S1S2.visualize(FC_vis).clip(roi)
var FC_Result_FC_B_S1S2 = FC_B_S1S2.visualize(FC_vis).clip(roi)
var dem = ee.Image("NASA/NASADEM_HGT/001").clip(roi);
var aoi_dem = dem.select('elevation');
var elevationVis = {
    min: 0,
    max: 2000,
};
var DEM = aoi_dem.visualize(elevationVis).clip(roi)

var styling = {
    color: '1e90ff',
    fillColor: 'ff475788',
    lineType: 'dotted',
    pointSize: 4,
    pointShape: 'circle'
};
var styling2 = {
    min: 1,
    max: 8,
    palette: ["a52a2a", "d2b48c", "ffe4b5", "f0e68c", "9acd32", "87ceeb", "7fff00", "3cb371", "006d2c", "00441b"]
};
var lucc_var_point = LUCC_verify_points.style(styling);
var lucc_cla_point = LUCC_classify_points.style(styling);
var fc_cla_point = FC_classify_points.style(styling);
var fc_var_point = FC_verify_points.style(styling);

////////// display
var images = {
    'Study Area': studyarea,
    'S2_year': S2_year,
    'S2_winter': S2_winter,
    'S2_wintercloudy': S2_wintercloudy,
    'S1_winter_VV': S1_winter_VV,
    'S1_winter_VH': S1_winter_VH,
    'DEM': DEM,
    'LC_train_samplepoints': lucc_cla_point,
    'FC_train_samplepoints': fc_cla_point,




}; ////left
var images2 = {

    'Forest Area': Forest, //
    'LC_validation_samplepoints': lucc_var_point,
    'FC_validation_samplepoints': fc_var_point,
    'LC_Result_S1S2winter': Result_S1S2winter,
    'LC_Result_S1WinterS2WinterCloudy': Result_S1WinterS2WinterCloudy,
    'LC_Result_S1winter': Result_S1winter,
    'LC_Result_S1winterS2year': Result_S1winterS2year,
    'LC_Result_S2WinterCloudy': Result_S2WinterCloudy,
    'LC_Result_S2winter': Result_S2winter,
    'LC_Result_S2year': Result_S2year,
    'FC_Result_FC_S2_BIT': FC_Result_FC_S2_BIT,
    'FC_Result_FC_A_S1S2': FC_Result_FC_A_S1S2,
    'FC_Result_FC_B_S1S2': FC_Result_FC_B_S1S2



}; ////right

//print(images)
var leftMap = ui.Map();
leftMap.setControlVisibility(false);
var leftSelector = addLayerSelector(leftMap, 0, 'top-left');

var rightMap = ui.Map();
rightMap.setControlVisibility(false);
var rightSelector = addLayerSelector2(rightMap, 1, 'top-right');

function addLayerSelector(mapToChange, defaultValue, position) {
    var label = ui.Label('Choose an image to visualize');

    // This function changes the given map to show the selected image.
    function updateMap(selection) {
        mapToChange.layers().set(0, ui.Map.Layer(images[selection]));
    }
    var select = ui.Select({ items: Object.keys(images), onChange: updateMap });
    select.setValue(Object.keys(images)[defaultValue], true);

    var controlPanel =
        ui.Panel({ widgets: [label, select], style: { position: position } });

    mapToChange.add(controlPanel);
}

function addLayerSelector2(mapToChange, defaultValue, position) {
    var label = ui.Label('Choose an results to visualize');
    var label2 = ui.Label('Click to get LC value')

    // This function changes the given map to show the selected image.
    function updateMap(selection) {
        mapToChange.layers().set(0, ui.Map.Layer(images2[selection]));
    }
    var select = ui.Select({ items: Object.keys(images2), onChange: updateMap });
    select.setValue(Object.keys(images2)[defaultValue], true);

    var controlPanel =
        ui.Panel({ widgets: [label, select], style: { position: position } });

    mapToChange.add(controlPanel);
}

var splitPanel = ui.SplitPanel({
    firstPanel: leftMap,
    secondPanel: rightMap,
    wipe: true,
    style: { stretch: 'both' }
});

// Set the SplitPanel as the only thing in the UI root.
ui.root.widgets().reset([splitPanel]);
var linker = ui.Map.Linker([leftMap, rightMap]);
rightMap.style().set('cursor', 'crosshair');
leftMap.setCenter(117.48, 26.77, 12);
////// legend title
var visLabels = {
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '4px 4px 4px 4px',
    border: '1px solid 3182bd',
    color: 'black',
    backgroundColor: 'deebf7',
    textAlign: 'left',
    stretch: 'horizontal'
};
var header = ui.Label('Classification results for land cover types, forest distribution and dominant tree species', { fontSize: '25px', fontWeight: 'bold', color: '4A997E' });
var notes = ui.Label('Notes:', { fontSize: '12px', fontWeight: 'bold' })
var notes2 = ui.Label('Use the map on the left to view the classification sample points and the classification source data. ' +
        'Use the map on the right to view the validation sample points and the classification results. ' +
        'Slide the button in the middle to compare the classification source data and the classification results.', { fontSize: '12px' })
    //App summary
var text = ui.Label(
    'This map shows the data sources used for classification, the sample points used for validation and classification, and the classification results for the study area.  ' +
    'Use the tools in the map to explore the classification results.', { fontSize: '15px' });


var text2 = ui.Label(
    'The classification result codes are as follows: 1, 2, 3, 4, 5 correspond to Cropland, Bare soil, Building, Forest, and Water, respectively.', { fontSize: '12px' });

var text3 = ui.Label('CULA is the abbreviation for Chinese fir (Cunninghamia lanceolata). ' +
    'PM is the abbreviation for Pinus masson. ' +
    'HB is the abbreviation for hard-leaved mixed forest (with hard-leaved tree species accounting for 65% or more of the total stocking).' +
    'SB is the abbreviation for soft-leaved mixed forest (with soft-leaved tree species accounting for 65% or more of the total stocking).' +
    'BB is the abbreviation for Bamboos.' +
    'EF is the abbreviation for Economic forest.' +
    'SH is the abbreviation for Shrubs.' +
    'Others represents other tree species in mixed or pure forests.', { fontSize: '12px' });
var legendPanel = ui.Panel({
    widgets: [ui.Label('LC', { fontSize: '15px', fontWeight: 'bold' })],
    layout: ui.Panel.Layout.flow('vertical'),
    style: {
        position: 'top-center',
    },
});
var legendPanel_2 = ui.Panel({
    widgets: [ui.Label("Dominant tree species", { fontSize: '15px', fontWeight: 'bold' })],
    layout: ui.Panel.Layout.flow('vertical'),
    style: {
        position: 'bottom-right',
    },
});
var makeRow = function(color, name) {

    // Create the label that is actually the colored box.
    var colorBox = ui.Label({
        style: {
            backgroundColor: '#' + color,
            // Use padding to give the box height and width.
            padding: '8px',
            margin: '0 0 4px 0',
            position: 'top-center'
        }
    });

    // Create the label filled with the description text.
    var description = ui.Label({
        value: name,
        style: { margin: '0 0 4px 6px', position: 'top-center' }
    });

    // return the panel
    return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
    });
};
var palette = ["f4a460", "a9a9a9", "ff0000", "228b22", "0000ff", "74c476", "41ab5d", "238b45", "006d2c", "00441b"];
var palette_2 = ['a6cee3', '1f78b4', '33a02c', 'fb9a99', 'e31a1c', 'ff7f00', 'cab2d6', '6a3d9a'];
// name of the legend
var names = ["CropLand-1",
    "Bare soil-2",
    "Building-3",
    "Forest-4",
    "water-5",
];
var names_2 = ["CULA-1",
    "PM-2",
    "HB-3",
    "SB-4",
    "BB-5",
    "EF-6",
    "SH-7",
    "Others-8"
];

// Add color and and names
for (var i = 0; i < 5; i++) {
    legendPanel.add(makeRow(palette[i], names[i]));
}

for (var i = 0; i < 8; i++) {
    legendPanel_2.add(makeRow(palette_2[i], names_2[i]));
}

var download1 = ui.Button('download');
var download2 = ui.Button('download')
var lucc_d = ui.Label('The best LC classfication resluts:');
var fc_d = ui.Label('The best FC classfication resluts:');
var lucc_panel = ui.Panel([lucc_d, download1], ui.Panel.Layout.Flow('vertical'));
var fc_panel = ui.Panel([fc_d, download2], ui.Panel.Layout.Flow('vertical'));
var panel = ui.Panel({
    widgets: [header, text, notes, notes2], //Adds header and text
    style: { width: '300px', position: 'middle-right' }
});
var intro = ui.Panel([
    ui.Label({
        value: '____________________________________________',
        style: { fontWeight: 'bold', color: '4A997E' },
    }),
]);
var intro1 = ui.Panel([
    ui.Label({
        value: '____________________________________________',
        style: { fontWeight: 'bold', color: '4A997E' },
    }),
]);
var intro2 = ui.Panel([
    ui.Label({
        value: '____________________________________________',
        style: { fontWeight: 'bold', color: '4A997E' },
    }),
]);
var intro3 = ui.Panel([
    ui.Label({
        value: '____________________________________________',
        style: { fontWeight: 'bold', color: '4A997E' },
    }),
]);



// Create an intro panel with labels.
var intro4 = ui.Panel([
    ui.Label({
        value: 'Click on the map to the right for information:',
        style: { fontSize: '16px', fontWeight: 'bold' }
    }),
]);
// Create panels to hold lon/lat values.
var lon = ui.Label();
var lat = ui.Label();
var Ls = ui.Label();
var FC = ui.Label();
var result_panel = ui.Panel([Ls, FC], ui.Panel.Layout.Flow('horizontal'));
var result_panel2 = ui.Panel([lon, lat], ui.Panel.Layout.Flow('horizontal'));


//Add this new panel to the larger panel we created 

panel.add(intro).add(intro4).add(result_panel2).add(result_panel).add(intro1)
    .add(legendPanel).add(lucc_panel).add(text2).add(intro2).add(legendPanel_2).add(fc_panel)
    .add(text3).add(intro3)
ui.root.insert(1, panel)
download1.onClick(function() {
    var region_down1 = Result_S1winterS2year;
    Export.image.toDrive({
        image: region_down1,
        description: 'LC_Result_S1winterS2year',
    });
});
download2.onClick(function() {
    var region_down1 = FC_Result_FC_B_S1S2;
    Export.image.toDrive({
        image: region_down1,
        description: 'FC_Result_FC_B_S1S2',
    });
});
rightMap.onClick(function(coords) {
    // Update the lon/lat panel with values from the click event.
    lon.setValue('Longitude: ' + coords.lon.toFixed(2)),
        lat.setValue('Latitude: ' + coords.lat.toFixed(2));

    var point = ee.Geometry.Point(coords.lon, coords.lat);
    //  


    function setValue(object, key, label) {
        var result = object.reduceRegion({
            reducer: ee.Reducer.first(),
            geometry: point,
            scale: 10
        }).get('classification')

        result.evaluate(setScore)

        function setScore(Score) {
            label.setValue(key + ': ' + Score)
        }
    }
    setValue(R_S1winterS2year, 'LC', Ls)
    setValue(FC_B_S1S2, 'FC', FC)

})