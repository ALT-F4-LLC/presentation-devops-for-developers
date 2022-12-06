import { ComponentResource, CustomResourceOptions, getStack } from "@pulumi/pulumi";
import { s3 } from "@pulumi/aws";

type FmBucketArgs = {
    Name: string;
    Product: string;
    Public?: boolean;
}

export class FmBucket extends ComponentResource {
    constructor(args: FmBucketArgs, opts?: CustomResourceOptions) {
        const resourceName = `${args.Product}-${args.Name}`;

        super("pkg:index:FmBucket", resourceName, {}, opts);

        const stack = getStack();

        const bucketName = `${resourceName}-${stack}`;

        let bucketArgs: s3.BucketArgs = {
            acl: "private",
            bucket: bucketName,
            tags: {
                Environment: stack,
            },
        }

        if (args.Public) {
            bucketArgs.acl = "public-read";
            bucketArgs.website = {
                indexDocument: "index.html",
                errorDocument: "error.html",
                routingRules: `[{
                    "Condition": {
                        "KeyPrefixEquals": "docs/"
                    },
                    "Redirect": {
                        "ReplaceKeyPrefixWith": "documents/"
                    }
                }]
                `,
            }
        }

        const bucket = new s3.Bucket(args.Name, bucketArgs, {
            parent: this
        });

        if (!args.Public) {
            new s3.BucketPublicAccessBlock(args.Name, {
                bucket: bucket.id,
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true,
            }, {
                parent: this
            });
        }
    }
}
