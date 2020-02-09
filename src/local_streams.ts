import { generateBatch, generateKeys } from "./local_generators"
const { Readable } = require("stream")
import { cpus } from "os"

export function KeyStream(Bucket: string, MaxKeys = 1000, highWaterMark: number = cpus().length - 1) {
  return Readable.from(generateKeys(Bucket, MaxKeys), { highWaterMark })
}

export function BatchStream(Bucket: string, MaxKeys: number = 1000, highWaterMark: number = cpus().length - 1) {
  return Readable.from(generateBatch(Bucket, MaxKeys), { highWaterMark })
}
