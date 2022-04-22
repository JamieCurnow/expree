import * as fsPromises from 'fs/promises'
import * as path from 'path'

/** Get all the file paths in a directory */
export const getFilePaths = async (d: string): Promise<string[]> => {
  // get all files/folders in dir
  const list = await fsPromises.readdir(d, { withFileTypes: true })
  const filesArr = await Promise.all(
    list.map((x) => {
      const res = path.resolve(d, x.name)
      return x.isDirectory() ? getFilePaths(res) : [res]
    })
  )
  return Array.prototype.concat(...filesArr)
}
