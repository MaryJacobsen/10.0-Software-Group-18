    var cookie = Cookies.getJSON('credentials')
    var meetID = cookie.meetSession;

    $("#download-button").one("click", get_data);

    var url = window.location.origin;

    function get_data() {
      $.ajax({
        method: "get",
        headers: {
          "Authorization": 'Bearer ' + Cookies.getJSON('credentials').token
        },
        dataType: "json",
        url: url + "/team/" + meetID + "/meet",
        success: (teams) => {
          downloadCSV({
            filename: "meet-data.csv"
          }, teams);
          for (var i = 0; i < teams.length; i++) {

            $.ajax({
              method: "get",
              headers: {
                "Authorization": 'Bearer ' + Cookies.getJSON('credentials').token
              },
              dataType: "json",
              url: url + "/player/" + meetID + "/" + teams[i].id + "/",
              success: (players) => {
                downloadCSV({
                  filename: `team-data.csv`
                }, players);
              }
            });

          }
        }
      });

      $.ajax({
        method: "get",
        headers: {
          "Authorization": 'Bearer ' + Cookies.getJSON('credentials').token
        },
        dataType: "json",
        url: url + "/judge/meet/" + meetID + "/",
        success: (judges) => {
          downloadCSV({
            filename: "judge-data.csv"
          }, judges);
        }
      });
    }

    function convertArrayOfObjectsToCSV(args) {
      var result, ctr, keys, columnDelimiter, lineDelimiter, data;

      data = args.data || null;
      if (data == null || !data.length) {
        return null;
      }

      columnDelimiter = args.columnDelimiter || ',';
      lineDelimiter = args.lineDelimiter || '\n';

      keys = Object.keys(data[0]);

      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
        });
        result += lineDelimiter;
      });

      return result;
    }

    function downloadCSV(args, entry) {
      var data, filename, link;
      var csv = convertArrayOfObjectsToCSV({
        data: entry
      });
      if (csv == null) return;

      filename = args.filename || 'export.csv';

      if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    }
