

export function handlePrintErrors(error: any): string {
  if (error.error.message === "timeout of 15000ms exceeded" || error.error.reason === "timeout") {
    return 'Connection timeout! Nu s-a putut realiza conexiunea la imprimanta!';
  } else if (error.error.code === "EHOSTDOWN") {
    return 'Server cazut! Nu s-a putut realiza conexiunea la imprimanta!';
  } else if (error.error.code == "EHOSTUNREACH") {
    return 'Server inacesibil! Nu s-a putut realiza conexiunea la imprimanta!';
  } else {
    return error.error.message || 'An unknown error occurred';
  }
}

