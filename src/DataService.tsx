export interface RecipeData
{
  name: string;
  text: string;
  keyIngredients?: string[];
  commonIngredients?: string[];
}

export abstract class DataService
{
  abstract getRecipes() : Promise<RecipeData[]>;

  abstract deleteRecipe(name : string) : void;
  
  abstract editRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>;
  abstract addRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>;
}
