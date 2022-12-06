import { ComponentResource, CustomResourceOptions } from "@pulumi/pulumi";
import { ecr } from "@pulumi/aws";

type FmDockerImageRepoArgs = {
    Name: string;
    Product: string;
}

export class FmDockerImageRepo extends ComponentResource {
    constructor(args: FmDockerImageRepoArgs, opts?: CustomResourceOptions) {
        const resourceName = `${args.Product}-${args.Name}`;

        super("pkg:index:FmDockerImageRepo", resourceName, {}, opts);

        new ecr.Repository(args.Name, {
            name: resourceName,
            imageScanningConfiguration: {
                scanOnPush: false,
            },
            imageTagMutability: "MUTABLE",
        }, {
            parent: this
        });
    }
}
