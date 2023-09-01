import { Readable as ReadableStream } from 'node:stream';
import {
  BucketItem,
  BucketItemCopy,
  BucketItemStat,
  BucketStream,
  Client,
  CopyConditions,
  Encryption,
  IncompleteUploadedBucketItem,
  ItemBucketMetadata,
  LegalHoldOptions,
  Lifecycle,
  Lock,
  NotificationConfig,
  NotificationEvent,
  NotificationPoller,
  RemoveOptions,
  ReplicationConfig,
  ReplicationConfigOpts,
  Retention,
  SelectOptions,
  Tag,
  TagList,
  UploadedObjectInfo,
  VersionIdentificator,
  VersioningConfig,
} from 'minio';

class StorageService {
  constructor(
    public readonly minio: Client,
    public readonly bucket: string,
  ) {}

  listObjects(prefix?: string, recursive?: boolean): BucketStream<BucketItem> {
    return this.minio.listObjects(this.bucket, prefix, recursive);
  }

  listObjectsV2(
    bucketName: string,
    prefix?: string,
    recursive?: boolean,
    startAfter?: string,
  ): BucketStream<BucketItem> {
    return this.minio.listObjectsV2(this.bucket, prefix, recursive, startAfter);
  }

  listIncompleteUploads(
    prefix?: string,
    recursive?: boolean,
  ): BucketStream<IncompleteUploadedBucketItem> {
    return this.minio.listIncompleteUploads(this.bucket, prefix, recursive);
  }

  getBucketVersioning(): Promise<VersioningConfig> {
    return this.minio.getBucketVersioning(this.bucket);
  }

  setBucketVersioning(versioningConfig: any): Promise<void> {
    return this.minio.setBucketVersioning(this.bucket, versioningConfig);
  }

  getBucketTagging(): Promise<Tag[]> {
    return this.minio.getBucketTagging(this.bucket);
  }

  setBucketTagging(tags: TagList): Promise<void> {
    return this.minio.setBucketTagging(this.bucket, tags);
  }

  removeBucketTagging(): Promise<void> {
    return this.minio.removeBucketTagging(this.bucket);
  }

  setBucketLifecycle(lifecycleConfig: Lifecycle): Promise<void> {
    return this.minio.setBucketLifecycle(this.bucket, lifecycleConfig);
  }

  getBucketLifecycle(): Promise<Lifecycle> {
    return this.minio.getBucketLifecycle(this.bucket);
  }

  removeBucketLifecycle(): Promise<void> {
    return this.minio.removeBucketLifecycle(this.bucket);
  }

  setObjectLockConfig(lockConfig?: Lock): Promise<void> {
    return this.minio.setObjectLockConfig(this.bucket, lockConfig);
  }

  getObjectLockConfig(): Promise<Lock> {
    return this.minio.getObjectLockConfig(this.bucket);
  }

  getBucketEncryption(): Promise<Encryption> {
    return this.minio.getBucketEncryption(this.bucket);
  }

  setBucketEncryption(encryptionConfig: Encryption): Promise<void> {
    return this.minio.setBucketEncryption(this.bucket, encryptionConfig);
  }

  removeBucketEncryption(): Promise<void> {
    return this.minio.removeBucketEncryption(this.bucket);
  }

  setBucketReplication(
    replicationConfig: ReplicationConfigOpts,
  ): Promise<void> {
    return this.minio.setBucketReplication(this.bucket, replicationConfig);
  }

  getBucketReplication(): Promise<ReplicationConfig> {
    return this.minio.getBucketReplication(this.bucket);
  }

  removeBucketReplication(): Promise<void> {
    return this.minio.removeBucketReplication(this.bucket);
  }

  getObject(objectName: string): Promise<ReadableStream> {
    return this.minio.getObject(this.bucket, objectName);
  }

  getPartialObject(
    objectName: string,
    offset: number,
    length?: number,
  ): Promise<ReadableStream> {
    return this.minio.getPartialObject(this.bucket, objectName, offset, length);
  }

  fGetObject(objectName: string, filePath: string): Promise<void> {
    return this.minio.fGetObject(this.bucket, objectName, filePath);
  }

  putObject(
    objectName: string,
    stream: ReadableStream | Buffer | string,
    metaData?: ItemBucketMetadata,
  ): Promise<UploadedObjectInfo> {
    return this.minio.putObject(this.bucket, objectName, stream, metaData);
  }

  fPutObject(
    objectName: string,
    filePath: string,
    metaData?: ItemBucketMetadata,
  ): Promise<UploadedObjectInfo> {
    return this.minio.fPutObject(this.bucket, objectName, filePath, metaData);
  }

  copyObject(
    objectName: string,
    sourceObject: string,
    conditions: CopyConditions,
  ): Promise<BucketItemCopy> {
    return this.minio.copyObject(
      this.bucket,
      objectName,
      sourceObject,
      conditions,
    );
  }

  statObject(objectName: string): Promise<BucketItemStat> {
    return this.minio.statObject(this.bucket, objectName);
  }

  removeObject(objectName: string, removeOpts?: RemoveOptions): Promise<void> {
    return this.minio.removeObject(this.bucket, objectName, removeOpts);
  }

  removeObjects(objectsList: string[]): Promise<void> {
    return this.minio.removeObjects(this.bucket, objectsList);
  }

  removeIncompleteUpload(objectName: string): Promise<void> {
    return this.minio.removeIncompleteUpload(this.bucket, objectName);
  }

  putObjectRetention(
    objectName: string,
    retentionOptions?: Retention,
  ): Promise<void> {
    return this.minio.putObjectRetention(
      this.bucket,
      objectName,
      retentionOptions,
    );
  }

  getObjectRetention(
    objectName: string,
    options: VersionIdentificator,
  ): Promise<Retention> {
    return this.minio.getObjectRetention(this.bucket, objectName, options);
  }

  setObjectTagging(
    objectName: string,
    tags: TagList,
    putOptions?: VersionIdentificator,
  ): Promise<void> {
    return this.minio.setObjectTagging(
      this.bucket,
      objectName,
      tags,
      putOptions,
    );
  }

  removeObjectTagging(
    objectName: string,
    removeOptions?: VersionIdentificator,
  ): Promise<void> {
    return this.minio.removeObjectTagging(
      this.bucket,
      objectName,
      removeOptions,
    );
  }

  getObjectTagging(
    objectName: string,
    getOptions?: VersionIdentificator,
  ): Promise<Tag[]> {
    return this.minio.getObjectTagging(this.bucket, objectName, getOptions);
  }

  getObjectLegalHold(
    objectName: string,
    getOptions?: VersionIdentificator,
  ): Promise<LegalHoldOptions> {
    return this.minio.getObjectLegalHold(this.bucket, objectName, getOptions);
  }

  setObjectLegalHold(
    objectName: string,
    setOptions?: LegalHoldOptions,
  ): Promise<void> {
    return this.minio.setObjectLegalHold(this.bucket, objectName, setOptions);
  }

  selectObjectContent(
    objectName: string,
    selectOpts: SelectOptions,
  ): Promise<void> {
    return this.minio.selectObjectContent(this.bucket, objectName, selectOpts);
  }

  // Presigned operations
  presignedUrl(
    httpMethod: string,
    objectName: string,
    expiry?: number,
    reqParams?: { [key: string]: any },
    requestDate?: Date,
  ): Promise<string> {
    return this.minio.presignedUrl(
      httpMethod,
      this.bucket,
      objectName,
      expiry,
      reqParams,
      requestDate,
    );
  }

  presignedGetObject(
    objectName: string,
    expiry?: number,
    respHeaders?: { [key: string]: any },
    requestDate?: Date,
  ): Promise<string> {
    return this.minio.presignedGetObject(
      this.bucket,
      objectName,
      expiry,
      respHeaders,
      requestDate,
    );
  }

  presignedPutObject(objectName: string, expiry?: number): Promise<string> {
    return this.minio.presignedPutObject(this.bucket, objectName, expiry);
  }

  // Bucket Policy & Notification operations
  getBucketNotification(): Promise<NotificationConfig> {
    return this.minio.getBucketNotification(this.bucket);
  }

  setBucketNotification(
    bucketNotificationConfig: NotificationConfig,
  ): Promise<void> {
    return this.minio.setBucketNotification(
      this.bucket,
      bucketNotificationConfig,
    );
  }

  removeAllBucketNotification(): Promise<void> {
    return this.minio.removeAllBucketNotification(this.bucket);
  }

  getBucketPolicy(): Promise<string> {
    return this.minio.getBucketPolicy(this.bucket);
  }

  setBucketPolicy(bucketPolicy: string): Promise<void> {
    return this.minio.setBucketPolicy(this.bucket, bucketPolicy);
  }

  listenBucketNotification(
    prefix: string,
    suffix: string,
    events: NotificationEvent[],
  ): NotificationPoller {
    return this.minio.listenBucketNotification(
      this.bucket,
      prefix,
      suffix,
      events,
    );
  }
}

export { StorageService };
