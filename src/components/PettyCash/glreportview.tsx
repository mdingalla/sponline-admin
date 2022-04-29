declare var unescape;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DatePicker, Dropdown, TextField } from "office-ui-fabric-react";
import * as PivotTableUI from "react-pivottable/PivotTableUI";
import "!style-loader!css-loader!react-pivottable/pivottable.css";
import 'react-pivottable/pivottable.css';
import * as SearchActions from "../../actions/glreport";
import { GLReportItems } from "../../../types/models";

const data = [["attribute", "attribute2"], ["value1", "value2"]];

const DayPickerStrings = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],

  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],

  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],

  shortDays: ["S", "M", "T", "W", "T", "F", "S"],

  goToToday: "Go to today"
};

export namespace GLReportView {
  export interface Props {
    // searchactions:typeof SearchActions;
    glreport: GLReportItems;
    searchactions: typeof SearchActions;
  }

  export interface State {
    StartDate: Date;
    EndDate: Date;
    valueFilter: any;
  }
}

export const GLReportView = (props:GLReportView.Props)=> {
  const { glreport } = props;

  let e = new Date();
    let pmonth = e.getMonth();
    let pday = e.getDay();
    let s = new Date(e.getFullYear(), pmonth - 1, pday);

  const [endDt,setEndDt] = React.useState(e);
  const [startDt,setStartDt] = React.useState(s);
  const [valueFilter,setvalueFilter] = React.useState();
  const [loader,setLoader] = React.useState(null)

  React.useEffect(()=>{
    if(glreport.querying)
    {
      setLoader(SP.UI.ModalDialog.showWaitScreenWithNoClose('Querying Report...',
      'Please wait while request is in progress...'));
    }
    else
    {
      if(loader) loader.close();
    }
  },[props])

  const handleSubmitClick = ()=> {
    props.searchactions.queryGL2(startDt, endDt);
    
  }

  const handleTableToExcel = ()=> {
    let uri = "data:application/vnd.ms-excel;base64,",
      template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) {
          return c[p];
        });
      };

    let table: any = "pvtTable";
    let name = "GL Report";

    if (!table.nodeType) table = document.getElementsByClassName(table);

    if (table && table.length > 0) {
      var ctx = { worksheet: name || "Worksheet", table: table[0].innerHTML };
      window.location.href = uri + base64(format(template, ctx));
    }
  }

  const handlePivotChange = (e: any) => {
      const {EndDate,StartDate,...rest} = e;
      setEndDt(EndDate);
      setStartDt(StartDate);
      setvalueFilter(rest);
  }

  

  let pivottable =
    glreport &&
    glreport.data &&
    glreport.data.length > 0 &&
    !glreport.querying ? (
      <PivotTableUI
        data={glreport.data}
        aggregatorName="Sum"
        cols={["ExpenseCategory"]}
        rows={["Employee"]}
        vals={["Amount"]}
        valueFilter={endDt}
        onChange={s => handlePivotChange(s)}
        {...valueFilter}
      />
    ) : null;

  let exportBtn =
    glreport && glreport.data && glreport.data.length > 0 ? (
      <button
        type="button"
        className="btn btn-success"
        onClick={() => handleTableToExcel()}
      >
        Export
      </button>
    ) : null;
  
 
  

  return (
    <div className="row-fluid form-horizontal">
      <div className="col-md-12">
        <div className="form-group well">
          <label className="control-label col-md-2">Start Date</label>
          <div className="col-md-3">
            <DatePicker
              strings={DayPickerStrings}
              itemRef="startDt"
              allowTextInput={true}
              onSelectDate={date => setStartDt(date)}
              value={startDt}
              placeholder="Select a date..."
            />
          </div>
          <label className="control-label col-md-2">End Date</label>
          <div className="col-md-3">
            <DatePicker
              strings={DayPickerStrings}
              itemRef="endDt"
              allowTextInput={true}
              onSelectDate={date => setEndDt(date)}
              value={endDt}
              placeholder="Select a date..."
            />
          </div>
          <div className="col-md-2">
            <div className="btn-toolbar">
              <button
                type="button"
                onClick={() => handleSubmitClick()}
                className="btn btn-primary"
              >
                Submit
              </button>
              {exportBtn}
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">{pivottable}</div>
    </div>
  );
}

