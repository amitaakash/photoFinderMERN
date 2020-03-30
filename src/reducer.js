export const reducer = (state, action) => {
  console.log('===>', action);

  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        name: action.user.name,
        id: action.user.id,
        email: action.user.email,
        images: action.user.images,
        photo: action.user.photo
      };
    case 'LOGOUT_USER':
      return {};
    default:
      throw new Error();
  }
};
