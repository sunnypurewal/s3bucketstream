import { list } from "./aws/awslib"
import { getBatch } from "./aws/awsbatch"
import fs from "fs"

let keysPath: string|undefined = undefined

export async function* generateKeys(Bucket: string, MaxKeys: number = 1000) {
  let StartAfter: string | undefined = undefined
  if (keysPath && fs.existsSync(keysPath)) {
    // User can define a filepath to read from
    // containing the current progress in the form
    // of a list of Keys.
    let keyfile = fs.readFileSync(keysPath).toString()
    let keys = keyfile.split("\n").sort()
    let progress: string|undefined = undefined
    for (let i = keys.length-1; i >= 0; i--) {
      progress = keys[i]
      if (progress !== undefined && progress.length > 0) {
        break
      }
    }
    if (progress !== undefined && progress.length > 0) {
      StartAfter = progress
      // console.log(`Found existing progress, continuing from ${StartAfter}`)
    }
  }
  let Keys = await list(Bucket, StartAfter, MaxKeys)
  StartAfter = Keys.slice(-1)[0]
  yield { Bucket, Keys }
  while (Keys.length === MaxKeys) {
    Keys = await list(Bucket, StartAfter, MaxKeys)
    StartAfter = Keys.slice(-1)[0]
    yield { Bucket, Keys }
  }
  StartAfter = undefined
}

export async function* generateBatch(Bucket: string, MaxKeys:number = 1000) {
  for await (let keygen of generateKeys(Bucket, MaxKeys)) {
    let batch = await getBatch(keygen.Bucket, keygen.Keys)
    yield batch
  }
}
