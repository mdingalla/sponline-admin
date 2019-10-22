import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'
import StaffMasterApi from './staffMasterApi';
import Utility from '../util';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';


const UserAccessRequest = "UserAccessRequest";

// let myWeb = new pnp.Web("https://iconnect.interplex.com/UserAccess");
let url = window.location.protocol + '//iconnect.interplex.com/UserAccess'
let myWeb = new Web(url);
// let myWeb = new pnp.Web(_spPageContextInfo.webAbsoluteUrl);
sp.setup({
  sp:{
      headers:{
          "Accept":"application/json;odata=verbose",
          "Content-Type":"application/json;odata=verbose",
      }
  }  
});

class UserAccessApi {
    static AppSearch(searchtext){
        let filter = "substringof('" + searchtext + "',Title) or substringof('" + searchtext + "',RefNo)";
        return myWeb.lists.getByTitle(UserAccessRequest)
            .items
            .filter(filter)
            .orderBy('Modified',false)
            .select('*,Author/Id,Author/Title,Editor/Id,Editor/Title').expand('Author/Id,Author/Title,Editor/Id,Editor/Title')
            .get();
    }


    static async PeopleToPicker(userid){
      const multiUser:any[] = userid && userid.results;
      if(multiUser)
      {
        const users = await Promise.all(
          multiUser.map(async (u)=>{
            return await this.ConvertPersona(u)
          })
        )

        return users;
      }
      else
      {
        return await this.ConvertPersona(userid)
      }
    }

    static async  ConvertPersona(userid: any, profile = true) {
      let query = profile
        ? await StaffMasterApi.getStaffMasterByWindowsId(userid)
        : await StaffMasterApi.GetStaffById(userid);
    
        let user = profile ? query[0] : query;
    
        if (user) {
          return {
            imageUrl: "",
            imageInitials:Utility.getInitial(user.Title),
            // imageInitials: user.EmpNo,
            id: user.WindowsIDId,
            text: user.Title,
            key: user.Id,
            // tertiaryText: user.Title,
            tertiaryText: user.Plant,
            // optionalText:user.Title,
            optionalText: user.Cost_x0020_Centre,
            // primaryText: user.Title,
            secondaryText: user.Title
          } as IPersonaProps
        }
    }

    static ConvertToPersona(userid: any, profile = true) {
        let query = profile
          ? StaffMasterApi.getStaffMasterByWindowsId(userid)
          : StaffMasterApi.GetStaffById(userid);
      
        // return  StaffMasterApi.getStaffMasterByWindowsId(userid)
        // .then((user)=>{
        return query.then(result => {
          let user = profile ? result[0] : result;
      
          if (user) {
            return Promise.resolve({
              imageUrl: "",
              imageInitials:Utility.getInitial(user.Title),
              // imageInitials: user.EmpNo,
              id: user.WindowsIDId,
              text: user.Title,
              key: user.Id,
              // tertiaryText: user.Title,
              tertiaryText: user.Plant,
              // optionalText:user.Title,
              optionalText: user.Cost_x0020_Centre,
              // primaryText: user.Title,
              secondaryText: user.Title
            } as IPersonaProps);
          }
        });
      }
}


export default UserAccessApi;