# s3-lifecycle-rules-cdk

Simple project on s3 buckets lifecycle rules for quick reference.

## CDK

```typescript
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

```

## Cloud Formation 

Voici quelques exemples de règles de cicle de vie:

```yaml
  MyFirstBucketB8884501:
    Type: AWS::S3::Bucket
    Properties:
      LifecycleConfiguration:
        Rules:
        
          # Supprimer versions actuels and anciennes copies:
          - Id: delete-old-objects
            AbortIncompleteMultipartUpload:
              DaysAfterInitiation: 30
            ExpirationInDays: 60
            NoncurrentVersionExpiration:
              NewerNoncurrentVersions: 10
              NoncurrentDays: 60
            Prefix: persist-aws/BD/ # (optionel) s'applique seulement a un prefix
            Status: Enabled

          # Changer la classe des objects après un moment pour payer moins par heure:
          - Id: change-objects-to-new-class
            Status: Enabled
            Transitions:
              - StorageClass: STANDARD_IA
                TransitionInDays: 30
              - StorageClass: INTELLIGENT_TIERING
                TransitionInDays: 60
              - StorageClass: GLACIER
                TransitionInDays: 90
              - StorageClass: DEEP_ARCHIVE
                TransitionInDays: 180

```

## Reference

- Documentation: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
- CDK: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.LifecycleRule.html
- CloudFormation: https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfiguration.html