import * as React from 'react';

import {IMXHoDImport} from './imx';
import {IHILHoDImport} from './ihil';
import {ExportTable} from './table';
import { EUHoDimport } from './eu';
import { AEBHoDImport } from './aeb';
import { INASHoDImport } from './inas';

export namespace HoDImport {
    export interface Props {
        plant:string;
    }
} 

export const HoDImport:React.FC<HoDImport.Props> = (props)=> {

    const [form,setForm] = React.useState(null);
    const [data,setData] = React.useState([]);

    React.useEffect(()=>{
        console.log(props);
        setForm(loadComponent())
    },[props.plant])

    const loadComponent = ()=> {
        switch (props.plant) {
            case "AEB":
                return <AEBHoDImport onImport={(e)=>setData(e)} {...props}  />

            case "IMX":
                return <IMXHoDImport onImport={(e)=>setData(e)} {...props} />

            case "HITL":
            case "IHIL":
                return <IHILHoDImport onImport={(e)=>setData(e)} {...props} />

            case "EU":
                return <EUHoDimport onImport={(e)=>setData(e)} {...props} />

            case "INAS":
                return <INASHoDImport onImport={(e)=>setData(e)} {...props} />

            default:
                return null;
        }
    }

    return (
        <div>
            {form}
            {data.length > 0 && <ExportTable data={data} />}
        </div>
    );
}


