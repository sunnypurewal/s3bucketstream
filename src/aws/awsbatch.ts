import { get } from "./awslib"
import S3Object from "./s3object"

export async function getBatch(Bucket: string, Keys: string[]): Promise<S3Object[]> {
  return new Promise((resolve, reject) => {
    let result: S3Object[] = []
    let i = 0
    // console.log(`Getting batch of ${Keys.length} objects from ${Bucket}`)
    for (const Key of Keys) {
      get(Bucket, Key).then((s3obj: S3Object) => {
        result.push(s3obj)
      }).catch((err) => {
        reject(err)
      }).finally(() => {
        i++
        if (i === Keys.length) {
          // console.log(`Got ${result.length}/${Keys.length}`)
          resolve(result)
        } else if (i > Keys.length) {
          reject(new Error("Somehow exceeded keys.length"))
        }
      })
    }
  })
}