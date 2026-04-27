export function success(data: any, message = "Success") {
  return {
    status: "success",
    message,
    data,
  };
}

export function error(message = "Error") {
  return {
    status: "error",
    message,
    data: null,
  };
}