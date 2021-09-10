import * as React from 'react';
import { DatePicker } from "antd";

import '!style-loader!css-loader!antd/dist/antd.css';
export const CERReportPage = ()=> {

    const [date,setDate] = React.useState(null);

    function onChange(date, dateString) {
        console.log(date, dateString);
        setDate(date);
      }

    return <div>
        <h4>CER Report</h4>
        <div >
            <DatePicker value={date} 
            onChange={onChange} />
        </div>
    </div>
}