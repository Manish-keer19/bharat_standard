// utils/response.ts
export const sendResponse = (res:any, { status = 200, success = true, message = "", data = null, meta = undefined }:any) => {
  return res.status(status).json({
    success,
    message,
    data,
    ...(meta && { meta })
  })
}