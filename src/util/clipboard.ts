export const saveToClipboard = (txt: string, onSuccess?: () => void) => {
  navigator.clipboard.writeText(txt).then(() => onSuccess?.());
};
