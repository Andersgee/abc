export async function sleep(ms = 1) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
