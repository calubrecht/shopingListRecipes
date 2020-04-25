
import {DataService} from './DataService';

export class MockDataService extends DataService
{
  getRecipes() : Promise<string[]>
  {
    return new Promise(() => ['This is a recipe', 'This is a better recipe']);
  }
}
