import {sp} from '@pnp/sp'

sp.setup({
    sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl:"https://interplexgroup.sharepoint.com/sites/Region/Corp/legal"
      }
})

class UserApi {
  static GetUsers(filter){
    
      // return sp.web.siteUsers.filter(filter).get();

      return sp.web.siteUserInfoList.items.filter(filter).get();
  }

  static GetUserById(id){
    return sp.web.siteUserInfoList.items.getById(id).get();
  }
}

export default UserApi;