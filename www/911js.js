var oldDate;
var map;
var mapArray;
var mapArrayCounter;
var mapOpen;
var listOpen;

window.onload = function () {
    init();   
   // document.addEventListener('deviceready', init, false);
};

function init()
{
    mapArrayCounter=0;
    mapOpen = false;
    listOpen = false;
    mapArray = new Array();
    $.ajax({
      url: "https://data.hartford.gov/resource/anj2-ytvy.json?$where=alm_date>'2015-01-15T00:00:00'",
      context: document.body
        }).done(function(data) {
            parseReturn(data.reverse());
        });
    $( document ).ajaxComplete(function() {
        $("#incidentList").listview().listview('refresh');    
    });
     
}

function showIncidentList()
{
    if(!listOpen)
       {
        document.getElementById('listContent').style.display = "block";   
     } else
     {
        document.getElementById('listContent').style.display = "none";
     }
    listOpen = !listOpen;
}

function parseReturn(data)
{
    var x = 0;
    console.log(data.length);  
    $.each(data, function(){
        var alarmDate = data[x].alm_date;
        var alarmTime = data[x].alm_time;
        var description = data[x].descript;
        var street = data[x].street;
        var long = data[x].longitude;
        var lat = data[x].latitude;
        var incidentType = data[x].inci_type;
        var zip = data[x].zip;
        x++;
        
        populateIL(dateClean(alarmDate), description, street, alarmTime, incidentType);
        makeMapArray(lat,long);
    });
        //console.log(mapArray);
}

function makeMapArray(lat,long)
{
        //console.log(mapArrayCounter);
        mapArray[mapArrayCounter] = lat;
        mapArrayCounter++;
        mapArray[mapArrayCounter] = long;
        mapArrayCounter++;
       
}   

function dateClean(alarmDate)
{
    var month = alarmDate.substring(5,7);
    var day = alarmDate.substring(8,10);
    var year = alarmDate.substring(0,4);
    var theDate = month + "/" + day + "/" + year;
    return theDate;
}

function populateIL(alarmDate, description, street, alarmTime, incidentType)
{
    //console.log(incidentType);
    //console.log(codes_to_category['113']);
    var incident = codes_to_category[$.trim(incidentType)];
    if(alarmDate != oldDate){
        var out = "<li data-role='list-divider'><h1>" + alarmDate + "</h1></li>";
    } else
    {
        var out = "";
    }
    if(street != undefined) out += "<li><h2>Street: " + street + "</h2>";
    if(incidentType == undefined){ out += "<h3>Incident Type Code: "+incidentType+"</h3>" }
    else if(incident == undefined){ out += "<h3>No Incident Type Provided</h3>" }
    else { out += "<h3>" + incident + " (Code "+$.trim(incidentType)+")</h3>" }
    if(alarmTime != undefined) out += "<p>Time: " + alarmTime + "<br/>";
    if(description != undefined) out += "Incident Description: " + description + "</p>";
    out += "</li>";
    //console.log(out);
    document.getElementById('incidentList').innerHTML += out;
    oldDate = alarmDate;
}

function showMap()
{
    if(!mapOpen){
    document.getElementById('mapDiv').style.display = "Block";  
    map = L.map('map').setView([41.76, -72.67], 13);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);
    $(window).resize();
    for(x=0; x < mapArray.length; x=x+2)
    {
           var marker = L.marker([mapArray[x], mapArray[(x+1)]]).addTo(map);
    }
    }else
    {
        document.getElementById('mapDiv').style.display = "none";   
    }
    mapOpen = !mapOpen;
}