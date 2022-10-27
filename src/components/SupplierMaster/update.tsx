import * as React from 'react';
import {Grid,TextField,Input } from '@material-ui/core';
import SiteCollectionApi from '../../sharepointapi/siteCollection';
var convert = require('xml-js');


const UpdateSupplierMasterXMLPage = ()=> {

    const [value,setValue] = React.useState<string>('');

    const xmlSource = `/sites/app/Shared%20Documents/SupplierXML/Supplier.xml`;

    const openXML = async ()=> {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET",xmlSource,false);
        xhttp.send();
        // const serializer = new XMLSerializer();
        // const xmlStr = serializer.serializeToString(xhttp.responseXML);

        var result1 = convert.xml2json(xhttp.responseText, {compact: true, spaces: 4});

        let json = JSON.stringify(JSON.parse(result1));

        await SiteCollectionApi.CreateFile(`/sites/app/Shared%20Documents/SupplierXML/`
        ,`/sites/app/Shared%20Documents/SupplierXML/supplier.json`,json);

        setValue(prev=>{
            return JSON.parse(result1)
        });

    }

    const handleSearch:React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> 
    = (e)=> {
        setValue(e.currentTarget.value);    
    };

    React.useEffect(()=>{
        openXML();
    },[]);

    return (
        <div>
            <h4>Supplier Master XML</h4>
            <Grid container>
                <Input onChange={handleSearch} value={value} />
            </Grid>
            <Grid container>
                <Grid item>

                </Grid>

                <Grid item>

                </Grid>
            </Grid>
        </div>
    );
};

export default UpdateSupplierMasterXMLPage;