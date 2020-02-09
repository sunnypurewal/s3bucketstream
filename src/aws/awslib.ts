import AWS from "aws-sdk"
import S3Object from "./s3object"
const s3 = new AWS.S3()

export async function get(Bucket: string, Key: string): Promise<S3Object> {
  return new Promise((resolve, reject) => {
    let params = {
      Bucket,
      Key
    }
    s3.getObject(params, (err, data) => {
      if (err) reject(err)
      else resolve({ Body: data["Body"]!.toString(), Key, Bucket })
    })
  })
}

export async function put(Bucket: string, Key: string, Body: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let params = {
      Bucket,
      Key,
      Body
    }
    s3.putObject(params, (err, _) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function list(Bucket: string, StartAfter: string|undefined = undefined, MaxKeys: number = 1000): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let params: AWS.S3.ListObjectsV2Request = {
      Bucket,
      MaxKeys
    }
    if (StartAfter !== undefined && StartAfter !== null) {
      params.StartAfter = StartAfter
    }
    // console.log(`Listing ${MaxKeys} from ${Bucket}`)
    s3.listObjectsV2(params, (err, data) => {
      if (err) reject(err)
      else {
        let contents = data["Contents"]
        if (contents !== undefined) {
          let Keys: string[] = []
          contents.forEach((c) => {
            if (c["Key"]) {
              Keys.push(c["Key"])
            }
          })
          resolve(Keys)
        }
      }
    })
  })
}