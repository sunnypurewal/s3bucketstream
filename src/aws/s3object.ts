export default class S3Object {
  public Key: string
  public Bucket: String
  public Body: string
  constructor(Key: string, Bucket: string, Body: string) {
    this.Key = Key
    this.Bucket = Bucket
    this.Body = Body
  }
}