
import {DataService} from './DataService';

export class MockDataService extends DataService
{
  getRecipes() : Promise<string[]>
  {
    return new Promise(function (resolve, reject)
    {
      resolve(['This is a recipe', 'This is a better recipe', 'This is the best recipe of all']);
    });
  }
}
