import { promises, writeFile } from "fs"
import S3Object from "../aws/s3object"

export async function get(Bucket: string, Key: string): Promise<S3Object> {
  let buffer = await promises.readFile(`./s3/${Bucket}/${Key}`)
  let obj = new S3Object(Key, Bucket, buffer.toString())
  return obj
}

export async function put(Bucket: string, Key: string, Body: string): Promise<void> {
  return new Promise((resolve) => {
    writeFile(`./s3/${Bucket}/${Key}`, Body, () => {
      resolve()
    })
  })
}

export async function list(Bucket: string, StartAfter: string | undefined = undefined, MaxKeys: number = 1000): Promise<string[]> {
  return new Promise((resolve) => {
    promises.readdir(`./s3/${Bucket}`).then((files) => {
      files = files.filter(f => f.includes(".html"))
      resolve(files.slice(0, MaxKeys))
    })
  })
}