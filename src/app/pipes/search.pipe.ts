import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(data: any, search: any): any {
    if (search === undefined) {
      return data;
    } else if((search != undefined || search != '') && data != undefined){
      return data.filter((d:any) =>{
        if (Array.isArray(d.products)) {
          return d.name.toLowerCase().includes(search.toLowerCase());
        } else {
          if (typeof d.products === 'object') {
            console.log('sjsjs')
            return d.products.name.toLowerCase().includes(search.toLowerCase()) ||  d.products.supplier.toLowerCase().includes(search.toLowerCase());
          } else return d.name.toLowerCase().includes(search.toLowerCase()) || d.supplier.toLowerCase().includes(search.toLowerCase());
        }
      })
    }
  }

}
