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

}
