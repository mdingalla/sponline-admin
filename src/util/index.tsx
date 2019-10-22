
import Swal from 'sweetalert2'

const MySwal = Swal;

class Utility {
    
    static enumerateAtoZ() : string[] {
        let alphabet = [];
        for (var i = 65; i <= 90; i++) {
           alphabet.push(String.fromCharCode(i));
        }

        return alphabet;
    }

    static parseCostCentre(costcentre: string) : string {
       let start = costcentre.lastIndexOf("-");
       if (start < 0) return null;
       return costcentre.substring(start + 2).trim();
    }

    static getInitial(name: string){
        let initials = name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);
        return  initials.join().replace(/,/g,'');
      }

      static pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }

    static MyConfirmationAlert(title="Confirm Delete",titleText="File will be deleted.",confirmButtonText="Yes, delete it!"){
        return MySwal.fire({
            title:title,
            titleText:titleText,
            type:'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText
        })
    }

    static SimpleSwal(title="Confirm Delete",titleText="File will be deleted."){
        return MySwal.fire(title,titleText,"info")
    }
}

export default Utility;