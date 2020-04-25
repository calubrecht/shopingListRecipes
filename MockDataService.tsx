
import {DataService} from './DataService';

export default class MockDataService extends DataService
{
  getRecipes() : string[]
  {
    return ['This is a recipe', 'This is a better recipe'];
  }
}
