class NoErrorThrownError extends Error {}

const getError = async <TError>(
  call: () => unknown
): Promise<TError | undefined> => {
  try {
    await call();

    return undefined;
  } catch (error: unknown) {
    return error as TError;
  }
};

export default getError;
