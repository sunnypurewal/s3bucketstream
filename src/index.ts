import { KeyStream, BatchStream } from "./streams"
import { generateKeys, generateBatch } from "./generators"
import { KeyStream as localKeyStream, BatchStream as localBatchStream } from "./local_streams"
import { generateKeys as localGenerateKeys, generateBatch as localGenerateBatch } from "./local_generators"

export {
  /* S3 Streams */
  KeyStream,
  BatchStream,
  /* S3 Generators */
  generateKeys, 
  generateBatch,
  /* Local Streams */
  localKeyStream,
  localBatchStream,
  /* Local Generators */
  localGenerateKeys, 
  localGenerateBatch
}