
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
             commonIngredients:['Flour', 'Onions', 'Cheesy bits']}]
          ]);
  }

  getRecipes() : Promise<RecipeData[]>
  {
    return new Promise(function (this: MockDataService, resolve : any, reject : any)
    {
      resolve(Array.from(this.recipeBook.values()));
    }.bind(this));
  }
  
  deleteRecipe(name : string) 
  {
    this.recipeBook.delete(name);
  }

}
