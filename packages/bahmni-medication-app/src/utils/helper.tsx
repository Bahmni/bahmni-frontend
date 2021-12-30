export const getPatientUuid = () => {
  const url = window.location.hash;
  const urlArray = url.split('/');
  return urlArray[urlArray.indexOf('patient') + 1];
};
