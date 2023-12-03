var urlTest =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(urlTest);

export const isURL = (str) => {
  if (str.match(regex)) {
    return true;
  } else {
    return false;
  }
};

const getURLMetadata = (str0) => {};

export const url = {
  isURL,
};
