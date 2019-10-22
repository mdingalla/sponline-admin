export const pagePath = _spPageContextInfo.webServerRelativeUrl + "Pages/MainApp.aspx";
export const AdminPagePath = _spPageContextInfo.webServerRelativeUrl + "Pages/AdminApp.aspx";
export const SignatoryAdminPagePath = `${AdminPagePath}/signatory/:id`;
export const SharePointOnlineUrl = `https://interplexgroup.sharepoint.com/sites/applications`
export const CerReportpagePath = _spPageContextInfo.webServerRelativeUrl + "/SitePages/CERReport.aspx";
export const CostCentrePagePath = _spPageContextInfo.webServerRelativeUrl + "Pages/CostCenterMain.aspx";
// export const pagePath = _spPageContextInfo.webServerRelativeUrl + "Pages/iconnectutil.aspx";
export const SPOnlineLegalSite = `https://interplexgroup.sharepoint.com/sites/Region/Corp/legal`
export const DayPickerStrings = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
  
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
  
    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
  
    shortDays: [
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S'
    ],
  
    goToToday: 'Go to today'
  };


export const CorporateCR = 'CorporateCR';

export const BootstrapTableOptions = {
  paginationSize: 4,
  SitePagestartIndex: 1,
  // alwaysShowAllBtns: true, // Always show next and previous button
  // withFirstAndLast: false, // Hide the going to First and Last page button
  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
  // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  firstPageText: 'First',
  prePageText: 'Back',
  nextPageText: 'Next',
  lastPageText: 'Last',
  nextPageTitle: 'First page',
  prePageTitle: 'Pre page',
  firstPageTitle: 'Next page',
  lastPageTitle: 'Last page',
  // showTotal: true,
  // paginationTotalRenderer: customTotal,
  sizePerPageList: [{
    text: '50', value: 50
  }, {
    text: '100', value: 100
  }]
  // , {
  //   text: 'All', value: products.length
  // }] // A numeric array is also available. the purpose of above example is custom the text
};