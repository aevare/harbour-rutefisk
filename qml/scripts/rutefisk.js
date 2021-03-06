/*
This file is part of harbour-rutefisk.

    harbour-rutefisk is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    harbour-rutefisk is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with harbour-rutefisk.  If not, see <http://www.gnu.org/licenses/>.
*/

.pragma library

function add_district(listModel) {
  var places = {};
  for(var i=0; i < listModel.count; i++) {
    var name = listModel.get(i).name;
    if(places.hasOwnProperty(name)) {
      listModel.setProperty(i, 'name', name + ' (' + listModel.get(i).district + ')');
      if(places[name] == 1)
        for (var j=0; j < i; j++) {
          if(listModel.get(j).name == name) {
            listModel.setProperty(j, 'name', name + ' (' + listModel.get(j).district + ')');
          }
        }
      places[name] = 2;
    } else {
      places[listModel.get(i).name] = 1;
    }
  }
}

function non_tz_date_parse(timestr) {
  var pat = /([A-Z]+|[+-][0-9]{2}:[0-9]{2})$/;
  if(pat.test(timestr)) {
    return new Date(timestr);
  } else {
    var ts;
    var date = new Date();
    if(date.getMonth() < 2) {
      ts = 'CET';
    } else if(date.getMonth() == 2) {
      var lastSunday = new Date(date.getFullYear(), 2, 31, 1);
      lastSunday.setDate(lastSunday.getDate()-lastSunday.getDay());
      ts = date < lastSunday ? 'CET' : 'CEST';
    } else if(date.getMonth() < 9) {
      ts = 'CEST';
    } else if(date.getMonth() == 9) {
      var lastSunday = new Date(date.getFullYear(), 9, 31, 1);
      lastSunday.setDate(lastSunday.getDate()-lastSunday.getDay());
      ts = date < lastSunday ? 'CEST' : 'CET';
    } else {
      ts = 'CET';
    }
    return new Date(timestr + ts);
  }
}

var lines = {};
var lineNumbers = {};
var lines_finished = false;
if (!lines_finished) {
    get_lines();
}

function get_lines() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      lines_finished = true;
      var data = JSON.parse(xhr.responseText);
      for(var index=0; index < data.length; index++) {
          lines[data[index]['ID']] = data[index]['Transportation'];
          lineNumbers[data[index]['Name']] = data[index]['ID'];
      };
    };
  };
  if(!lines_finished) {
    xhr.open("GET", "http://reisapi.ruter.no/Line/GetLines", true);
    xhr.send();
  }
}
