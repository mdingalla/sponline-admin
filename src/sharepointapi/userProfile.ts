import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery, PagedItemCollection} from '@pnp/sp'

const myWeb = new Web(_spPageContextInfo.siteAbsoluteUrl);



class UserProfile {
    static GetProfile(userid){
       
        return myWeb.siteUserInfoList.items.getById(userid).get()
    }
}

export default UserProfile;