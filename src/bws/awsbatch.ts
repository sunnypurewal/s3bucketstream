import { get } from "./awslib"
import S3Object from "../aws/s3object"

export async function getBatch(Bucket: string, Keys: string[]): Promise<S3Object[]> {
  return new Promise((resolve, reject) => {
    let result: S3Object[] = []
    let i = 0
    // // console.log(`Getting batch of ${keys.length} objects from ${bucket}`)
    for (const Key of Keys) {
      get(Bucket, Key).then((obj) => {
        result.push(obj)
      }).catch((err) => {
        reject(err)
      }).finally(() => {
        i++
        if (i === Keys.length) {
          resolve(result)
        } else if (i > Keys.length) {
          reject(new Error("Somehow exceeded keys.length"))
        }
      })
    }
  })
}