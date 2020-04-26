export interface RecipeData
{
  name: string;
  text: string;
}

export abstract class DataService
{
  abstract getRecipes() : Promise<RecipeData[]>;

}