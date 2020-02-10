# s3-bucket-stream

# Usage

You must provide aws credentials using [a credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) or [another method](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)

```
const { BatchStream } = require("s3-bucket-stream")

const readableStream = BatchStream("BucketNameGoesHere")

const read = () => {
  let batch = readableStream.read()
  if (batch) {
    console.log(`Fetched batch of size ${batch.length}`)
    process.nextTick(() => {
      readableStream.once("readable", read)
    })
  }
}

readableStream.once("readable", read)
```

## Using Generators
```
const { generateBatch } = require("s3-bucket-stream")

const main = async () => {
  let generator = generateBatch("BucketNameGoesHere", /* MaxKeys = 1000 */)
  for await (let item of gen) {
    console.log(item)
  }
}
main()
```

# What is s3-bucket-stream?

s3-bucket-stream contains methods to retrieve the contents of every file in an S3 bucket in lexicographical order. It exposes stream and generator APIs for retrieving a list of all Keys in a bucket and for retrieving the Body of every Key in a bucket. It is useful for running a batch process on an EC2 instance that pulls files from S3.

Note that making LIST and GET request to S3 buckets will incur a cost on your account. See [S3 Pricing](https://aws.amazon.com/s3/pricing/) for your region's costs.

Data transfer out of S3 buckets will also incur a cost on your account. See [S3 Pricing](https://aws.amazon.com/s3/pricing/) for details. Note that data transfer from S3 to EC2 is free.

# Local Testing

To eliminate costs while testing your batch process, you can use the library's built-in local filesystem reader. Create a folder at path `./s4` and the library will treat each subfolder of `./s4` as a bucket. You can then fill these folders with a small subset of files from your S3 buckets for testing locally. This local API is identical to the S3 API but will never make any requests to S3, only to your local filesystem.

## Usage

### Streams
```
const { localBatchStream } = require("s3-bucket-stream")
const readableStream = localBatchStream("FolderNameGoesHere")
// Use it the same way as BatchStream
const read = () => {
  let batch = readableStream.read()
  if (batch) {
    console.log("Fetched batch of size", batch.length)
    process.nextTick(() => {
      readableStream.once("readable", read)
    })
  }
}

readableStream.once("readable", read)
```

### Generators
```
const { localGenerateBatch } = require("s3-bucket-stream")

const main = async () => {
  let gen = localGenerateBatch("listings0", 1)
  for await (let item of gen) {
    console.log(item)
  }
}
main()
```

# API Reference

## Batch

`BatchStream` and `generateBatch` will return the following object:
```
{
  Key: string
  Bucket: String
  Body: string
}
```

## Key

`KeyStream` and `generateKeys` will return the following object
```
{
  Bucket: string
  Keys: string[]
}
```

Note that use of capitalization in the field names to match the `aws-sdk` interface.