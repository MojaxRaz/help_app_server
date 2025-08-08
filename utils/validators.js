exports.validateAlert = (data) => {
  if (!data.type || !data.description) return false;
  return true;
};
