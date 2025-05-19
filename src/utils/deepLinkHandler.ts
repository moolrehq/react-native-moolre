export const isMoolreCallback = (url: string): boolean => {
  try {
    return url.startsWith("moolre://payment-callback");
  } catch {
    return false;
  }
};

export const parseMoolreCallback = (
  url: string
): { status?: string; reference?: string } | null => {
  try {
    const parsed = new URL(url);
    const status = parsed.searchParams.get("status") || undefined;
    const reference = parsed.searchParams.get("reference") || undefined;
    return { status, reference };
  } catch (err) {
    return null;
  }
};
