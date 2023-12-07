import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class S3LifecycleRulesCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      lifecycleRules: [
        {
          id: "delete-old-objects", 
          enabled: true,
          prefix: 'persist-aws/BD/',
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(30),
          noncurrentVersionsToRetain: 10,
          noncurrentVersionExpiration: cdk.Duration.days(60),
          expiration: cdk.Duration.days(60),
        },
        {
          id: "change-objects-to-new-class", 
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(60),
            },
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(90),
            },
            {
              storageClass: s3.StorageClass.DEEP_ARCHIVE,
              transitionAfter: cdk.Duration.days(180),
            },
          ],
        }
      ]
    });

  }
}
