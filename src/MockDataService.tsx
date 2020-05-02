
import {DataService} from './DataService';
import {RecipeData} from './DataService';

export class MockDataService extends DataService
{
  recipeBook : Map<string, RecipeData>;
  constructor()
  {
    super();
    this.recipeBook = 
      new Map([
          ['Good Recipe',{name:'Good Recipe', text:'This is a recipe'}],
          ['Better Recipe',{name:'Better Recipe', text:'This is a better recipe. It contains all the good things you love to eat and is full of sugar.', keyIngredients:['Sugar', 'Honey', 'Peanut Butter Cups']}],
          ['Awesomesauce Recipe',{name:'Awesomesauce Recipe', text:'This is the best recipe of all',
             keyIngredients:['Bacon', 'More Bacon'],
             commonIngredients:['Flour', 'Onions', 'Cheesy bits']}],
          ['Bad Recipe',{name:'Bad Recipe', text:'This recipe is made of fail and sadness',
             keyIngredients:['Fail', 'Sadness'],
             commonIngredients:['Flour', 'Water', 'Spinach']}],
          ['Jerked Jerky',{name:'Jerked Jerky', text:'Jerk it good', keyIngredients:['Jerky'],
             commonIngredients:['Sauce', 'Onions']}]
          ]);
  }

  getRecipes() : Promise<RecipeData[]>
  {
    return new Promise(function (this: MockDataService, resolve : any, reject : any)
    {
      resolve(Array.from(this.recipeBook.values()));
    }.bind(this));
  }

  recipesNow() : RecipeData[]
  {
    return Array.from(this.recipeBook.values());
  }
  
  deleteRecipe(name : string) 
  {
    this.recipeBook.delete(name);
  }

}
