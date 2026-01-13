let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;
  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
};
