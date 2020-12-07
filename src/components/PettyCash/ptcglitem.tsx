import * as React from 'react';
import { PettyCashApi } from '../../sharepointapi/iconnectApi';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const PTCGLItemFix:React.FunctionComponent = ()=> {

    const [data,setData] = React.useState<any[]>([]);

    React.useEffect(()=>{
        async function loadQuery(){

           let ptcarray = [];

           const query = await PettyCashApi.PTCNextQuery(`WFlowStatus eq 'APPROVED' and Modified gt '12/7/2020'`);

           for (let index = 0; index < query.length; index++) {
               const element = query[index];

               const ptcnextItems = await PettyCashApi.GetPTCItemsByPTCId(element.Id);

               const ptcglItems = await PettyCashApi.GLAppSearch(element.Title);

               if(ptcnextItems.length != ptcglItems.length)
               {
                    ptcarray.push(element);
               }

               if(index % 10 == 0) await timeout(5000);

               
           }

           setData(ptcarray);


        }

        loadQuery();
    },[])

    return (
        <ul>
            {data.map((i)=>{
                return <li>
                    {i.Title}
                    <a target="_blank" 
                    href={`https://interplexgroup.sharepoint.com/sites/app/PettyCash/Lists/PTC%20GL%20Items/AllItems.aspx?FilterField1=LinkTitle&FilterValue1=${i.Title}&FilterType1=Computed&viewid=5abd2c1c%2D04fa%2D41a9%2Db7fa%2D243595a9baa3`}
                     >Open PTC GL Items</a>
                     <a href={`https://interplexgroup.sharepoint.com/sites/app/PettyCash/Pages/MainApp.aspx/edit/${i.Id}`} 
                     target="_blank">
                         Open PTC
                     </a>
                </li>
            })}
        </ul>
    )
};