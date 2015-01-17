var oldDate;

window.onload = function () {
    init();   
   // document.addEventListener('deviceready', init, false);
};

function init()
{
    $.ajax({
      url: "https://data.hartford.gov/resource/anj2-ytvy.json?$where=alm_date>'2015-01-01T00:00:00'",
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
    document.getElementById('listContent').style.display = "block";   
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
    });
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
    out += "<li><h2>Street: " + street + "</h2>";
    out += "<h3>" + incident + "</h3>";
    out += "<p>Time: " + alarmTime + "<br/>";
    out += "Incident Description: " + description + "</p>";
    out += "</li>";
    //console.log(out);
    document.getElementById('incidentList').innerHTML += out;
    oldDate = alarmDate;
}