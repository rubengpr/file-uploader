export const handleError = (error: unknown): { message: string; statusCode: number } => {
  if (typeof error === 'object' && error !== null && 'message' in error && 'statusCode' in error) {
    return {
      message: String(error.message),
      statusCode: Number(error.statusCode)
    };
  }
  
  return {
    message: error instanceof Error ? error.message : "Something went wrong",
    statusCode: 500
  };
}