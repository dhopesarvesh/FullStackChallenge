export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const isValidPassword = (password) => {
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
    return passwordRegex.test(password);
  };
  
  export const isValidName = (name) => {
    return name && name.length >= 20 && name.length <= 60;
  };
  
  export const isValidAddress = (address) => {
    return address && address.length <= 400;
  };
  