export abstract class DataService
{
  abstract getRecipes() : Promise<string[]>;

}