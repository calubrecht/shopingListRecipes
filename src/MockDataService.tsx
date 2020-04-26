
import {DataService} from './DataService';
import {RecipeData} from './DataService';

export class MockDataService extends DataService
{
  getRecipes() : Promise<RecipeData[]>
  {
    return new Promise(function (resolve, reject)
    {
      resolve(
        [
          {name:'Good Recipe', text:'This is a recipe'},
          {name:'Better Recipe', text:'This is a better recipe'},
          {name:'Awesomesauce Recipe', text:'This is the best recipe of all',
             keyIngredients:['Bacon', 'More Bacon'],
             commonIngredients:['Flour', 'Onions', 'Cheesy bits']}]);
    });
  }
}
