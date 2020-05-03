
export var consts = {
  isMock: REACT_APP_MOCK,
  apiPort: REACT_APP_PORT,
  apiServer: REACT_APP_API_SERVER
};

if (typeof window.CALLBACK_REGISTRY == 'undefined')
{
  window.CALLBACK_REGISTRY = {'refreshRecipeGrid': (e => e)};
}

export var EXT_CALLBACK_REGISTRY = window.CALLBACK_REGISTRY;

