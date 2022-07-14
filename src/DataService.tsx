export interface RecipeData
{
  name: string;
  id: string;
  text: string;
  keyIngredients?: string[];
  commonIngredients?: string[];
}

export abstract class DataService
{
  abstract getRecipes() : Promise<RecipeData[]>;

  abstract deleteRecipe(name : string)  : Promise<RecipeData[]>;
  
  abstract editRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>;
  abstract addRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>;
  abstract getNameForIDNum(id: string) : string;

  abstract setOrder(orderedItems: string[]) : Promise<void> ;
}
