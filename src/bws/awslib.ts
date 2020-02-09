import { promises, writeFile } from "fs"
import S3Object from "../aws/s3object"
import { rejects } from "assert"

export async function get(Bucket: string, Key: string): Promise<S3Object> {
  let buffer = await promises.readFile(`./s4/${Bucket}/${Key}`)
  let obj = new S3Object(Key, Bucket, buffer.toString())
  return obj
}

export async function put(Bucket: string, Key: string, Body: string): Promise<void> {
  return new Promise((resolve) => {
    writeFile(`./s4/${Bucket}/${Key}`, Body, () => {
      resolve()
    })
  })
}

export async function list(Bucket: string, StartAfter: string | undefined = undefined, MaxKeys: number = 1000): Promise<string[]> {
  return new Promise((resolve, reject) => {
    promises.readdir(`./s4/${Bucket}`).then((files) => {
      let sorted = files.sort()
      if (StartAfter === undefined) {
        if (sorted.length > 0) {
          resolve(sorted.slice(0, MaxKeys))
        } else {
          reject()
        }
      } else {
        let startIndex = sorted.indexOf(StartAfter)
        if (startIndex !== -1) {
          resolve(sorted.slice(startIndex+1, startIndex+1+MaxKeys))
        } else if (sorted.length > 0) {
          resolve(sorted.slice(0, MaxKeys))
        } else {
          reject()
        }
      }
    })
  })
}