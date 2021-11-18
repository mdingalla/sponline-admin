import {sp,SPHttpClient} from '@pnp/sp'

const spClient = new SPHttpClient();

sp.setup({
    sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl:"https://interplexgroup.sharepoint.com/sites/app"
      }
})

class UserApi {
  static GetUsers(filter){
    
      // return sp.web.siteUsers.filter(filter).get();

      return sp.web.siteUsers.filter(filter).get();
  }

  static async ensureUser(login){
    try {
      const loginName = `i:0#.f|membership|${login}`
      const restApi = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/ensureuser`;
      const data = await spClient.post(restApi, {
        body: JSON.stringify({ 'logonName': loginName })
      });

      if (data.ok) {
        const user = await data.json();
        if (user && user.d.Id) {
          // return user.d.Id;
          return user;
        }
      }
      return null; 
    } catch (error) {
      return null
    }
  }

  static GetUserById(id){
    return sp.web.siteUserInfoList.items.getById(id).get();
  }

  static GetUserByEmail(email){
    return sp.web.siteUsers.getByEmail(email);
  }
}

export default UserApi;