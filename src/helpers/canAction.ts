const canAction = (action: string, resource?: string) => {
  // const role = store.getState().auth.role || '';
  // if (!role) return false;

  // const abilities = defineAbilitiesFor(role);
  // return abilities.can(action, resource);
  return true;
};

export default canAction;
