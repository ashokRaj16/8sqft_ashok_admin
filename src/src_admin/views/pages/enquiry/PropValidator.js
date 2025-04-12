
const validateProperty = (req) => {
  const newErrors = {}

  if(!req.email) {
    newErrors.email = 'Email is required.';
  }
  if(!req.password) {
    newErrors.password = 'Password is required.';
  }
  if(req.email && !validator.isEmail(req.email)) {
    newErrors.email = 'Email is not valid format.';
  }
  return newErrors;
}
