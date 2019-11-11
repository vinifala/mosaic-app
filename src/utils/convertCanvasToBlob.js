export const convertCanvasToBlob = (canvas, format) =>
  new Promise((fulfill, reject) => {
    try {
      canvas.current.toBlob(fulfill, format, 1);
    } catch (e) {
      reject(e);
    }
  });
