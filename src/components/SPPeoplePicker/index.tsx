
import * as React from 'react';
import classnames from 'classnames';
import * as ReactDOM from 'react-dom';
import {BaseComponent,
  NormalPeoplePicker,
  IBasePickerProps,
  ListPeoplePicker,
  CompactPeoplePicker,
  IPersonaProps,
    IBasePicker, 
    IBaseProps} from 'office-ui-fabric-react';

import { SPHttpClient } from '@pnp/sp';
// import { IBaseProps } from '@uifabric/utilities/BaseComponent';
import { sp,Web } from "@pnp/sp";
import UserApi from '../../sharepointapi/userApi'

sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },

  },
});

let siteColWeb = new Web(_spPageContextInfo.siteAbsoluteUrl);



const suggestionProps = {
  suggestionsHeaderText: 'Suggested People',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading'
};

interface SPCLientPeoplepickerState {
  items?:IPersonaProps[];
  value?:any;
  isProfile?:boolean;
  
}

interface SPClientPeoplePickerProps extends IBaseProps {
  value:IPersonaProps[];
  isprofile:boolean;
  onChange:(value: any)=> void;
  isMulti?:boolean;
  className?:string;
}

interface SPClientPeoplePickerElement extends Element {
  state:any;
}

// export default class SPClientPeoplePicker extends React.Component<SPClientPeoplePickerProps,SPCLientPeoplepickerState> {
  export default class SPClientPeoplePicker extends BaseComponent<SPClientPeoplePickerProps,SPCLientPeoplepickerState> {
  refs: {
    [key: string]: (Element);
    pplPicker:(SPClientPeoplePickerElement);
  }

  private _picker: IBasePicker<IPersonaProps>;


  constructor(props)
  {
    super(props)

    this.onChange = this.onChange.bind(this);
    this.state = {
      items:props.value,
      value:props.value,
      isProfile:this.props.isprofile || true,
    };
  }


  private getInitial(name: string){
    let initials = name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);
    return  initials.join().replace(/,/g,'');
  }



  private _ClientPeoplePickerSearchUser = (filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) => {
    const filter = `(substringof('${filterText}',FirstName) or substringof('${filterText}',LastName) or substringof('${filterText}',Title) or substringof('${filterText}',EMail)) and ContentType eq 'Person'`

    if (filterText) {
     return UserApi.GetUsers(filter)
      // .then(response => response.json())
      .then(data => {
        let results = data.map((item,idx)=>{
          return {
            id:item.Id,
            key: item.Id,
            imageUrl: item.Picture,
            imageInitials: item.Office,
            text: item.Title,
            // primaryText: item.Title,
            secondaryText: item.JobTitle,
            tertiaryText: item.Department,
            optionalText: item.Office
          }
        });

        // console.log(results);
        return this._convertResultsToPromise(results);
      });
      
    }
    else {
      return this._convertResultsToPromise([]);
    }
    
  }


  private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
    return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
  }

  onChange(items){
   
    this.props.onChange(items);
  }

  componentWillReceiveProps(nextProps: SPClientPeoplePickerProps)
  {
      if(nextProps !== this.props)
      {
        this.setState({
          items:nextProps.value,
          value:nextProps.value
        },()=>{
          // this.refs.pplPicker.state.items = nextProps.value
          // this._picker.items = nextProps.value
        })
      } 
  }

  render(){
    return  <CompactPeoplePicker 
      // ref="pplPicker"
      componentRef={this._resolveRef('_picker')}
        // onResolveSuggestions={this.props.isprofile ? this._ClientPeoplePickerSearchUser : this._StaffMasterOnFilterChanged }
        onResolveSuggestions={this._ClientPeoplePickerSearchUser}
        onChange={this.onChange}
        // selectedItems={this.state.items}
        getTextFromItem={ (persona) => persona.primaryText }
        className={classnames('ms-PeoplePicker', this.props.className)}
        pickerSuggestionsProps={ suggestionProps }
        key={ 'normal' }
        itemLimit={this.props.isMulti ? 20 : 1}
        defaultSelectedItems={this.state.items}
        resolveDelay={300}
        selectedItems={this.state.items}
      />
  }


}


