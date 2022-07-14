
import {DataService} from './DataService';
import {RecipeData} from './DataService';

export class MockDataService extends DataService
{
  recipeBook : Map<string, RecipeData>;
  nameForID : Map<string, string>;
  idCount = 0;
  constructor()
  {
    super();
    this.recipeBook = 
      new Map([
          ['Good Recipe',{name:'Good Recipe', text:'This is a recipe', id:this.getNextID()}],
          ['Better Recipe',{name:'Better Recipe', text:'This is a better recipe. It contains all the good things you love to eat and is full of sugar.', keyIngredients:['Sugar', 'Honey', 'Peanut Butter Cups'], id:this.getNextID()}],
          ['Awesomesauce Recipe',{name:'Awesomesauce Recipe', text:'This is the best recipe of all',
             keyIngredients:['Bacon', 'More Bacon'],
             commonIngredients:['Flour', 'Onions', 'Cheesy bits'],
             id:this.getNextID()}],
          ['Bad Recipe',{name:'Bad Recipe', text:'This recipe is made of fail and sadness',
             keyIngredients:['Fail', 'Sadness'],
             commonIngredients:['Flour', 'Water', 'Spinach'],
             id:this.getNextID()}],
          ['Jerked Jerky',{name:'Jerked Jerky', text:'Jerk it good', keyIngredients:['Jerky'],
             commonIngredients:['Sauce', 'Onions'],
             id:this.getNextID()}]
          ]);
    this.nameForID = new Map();
    for (let value of Array.from(this.recipeBook.values()))
    {
       this.nameForID.set(value.id, value.name);
    }
  }

  getNextID() : string
  {
    return "" + this.idCount++; 
  }


  getNameForIDNum(id: string) : string
  {
    return this.nameForID.has(id) ? this.nameForID.get(id)! : '';
  }

  getRecipes() : Promise<RecipeData[]>
  {
    return new Promise(function (this: MockDataService, resolve : any, reject : any)
    {
      resolve(Array.from(this.recipeBook.values()));
    }.bind(this));
  }

  deleteRecipe(name : string)  : Promise<RecipeData[]>
  {
    this.recipeBook.delete(name);
    return this.getRecipes();
  }
  
  editRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    this.recipeBook.set(name, recipeData);
    return this.getRecipes();
  }
  
  addRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    recipeData.id = this.getNextID();
    this.recipeBook.set(name, recipeData);
    this.nameForID.set(recipeData.id, name);
    return this.getRecipes();
  }

  setOrder(orderedItems: string[]) : Promise<void>
  {
    return new Promise(function (this: MockDataService, resolve : any, reject : any)
    {
      resolve();
    }.bind(this));
  }
}
