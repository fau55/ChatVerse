import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user'; 

@Pipe({
  name: 'searchByName'
})
export class SearchByNamePipe implements PipeTransform {

  transform(users: User[], searchName: string): User[] {
    if (!users || !searchName) {
      return users; // Return the original array if there are no users or no search term
    }
    
    searchName = searchName.toLowerCase(); // Convert search term to lowercase for case-insensitive comparison

    return users.filter(user => {
      // Concatenate first name and last name and then perform case-insensitive search
      const fullName = user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase();
      return fullName.includes(searchName);
    });
  }
}

