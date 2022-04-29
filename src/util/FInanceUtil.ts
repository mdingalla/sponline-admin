

class FinanceHelper {
    static  GetFinancialYear = (date?)=> {
        var mydate = !date ? new Date() : new Date(date);
        if ((mydate.getMonth() + 1) < 7) {
          return "FY" + mydate.getFullYear()
        } else {
          return "FY" + (mydate.getFullYear() + 1)
        }
        // return fiscalyear
      }

    static ParseAmount = (amt)=>{
      if(amt)  return parseFloat(amt.toString().replace(/,/g,''));
      return 0;
    }

    static GetBudgetType = (budgetType,assetClass,cer_total,) => {
      if(!budgetType)
      {
        if(assetClass && assetClass.startsWith("4") && 
        (!assetClass.startsWith("4000E") || !assetClass.startsWith("4500E"))){
          return "IT"
        }
        else
        {
          return (FinanceHelper.ParseAmount(cer_total) <= 25000) ? "Type A" : "Type B"
        }

      }
      else
      {
        return budgetType
      }
    }
}

export default FinanceHelper;