
import {DataService} from './DataService';
import {RecipeData} from './DataService';

export class DataServiceImpl extends DataService
{
  apiServer : string;
  constructor()
  {
    super();
    this.handleErrors = this.handleErrors.bind(this);
    this.apiServer = '';
    if (process.env.REACT_APP_API_SERVER)
    {
      this.apiServer = process.env.REACT_APP_API_SERVER;
    }
    else if (process.env.REACT_APP_API_PORT)
    {
      this.apiServer = window.location.protocol + '//' +  window.location.hostname + ':' + process.env.REACT_APP_API_PORT;
    }
  }

  getRecipes() : Promise<RecipeData[]>
  {
    let req = {action: 'getRecipes'};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req)})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  deleteRecipe(name : string) 
  {
    // Does nothing, for now
  }
  
  editRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    let req = {action: 'editRecipe', recipe:recipeData};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req)})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }
  
  addRecipe(name : string, recipeData: RecipeData) : Promise<RecipeData[]>
  {
    let req = {action: 'addRecipe', recipe:recipeData};
    return fetch(
      this.apiServer + '/service/',
       {method: 'post', credentials:'include', body: JSON.stringify(req)})
         .then(this.handleErrors)
         .then(res => this.parseResponse(res));
  }

  parseResponse(response : Response)
  {
    return response.json().then(
      r => 
      {
        if (!r.isLoggedIn)
        {
          throw Error("Please log in again.");
        }
        if (r.error)
        {
          throw Error(r.error);
        }
        return r.recipes;
      });
  }

  handleErrors(response : Response)
  {
    if (!response.ok)
    {
      throw Error(response.statusText);
    }
    return response;
  } 
}
