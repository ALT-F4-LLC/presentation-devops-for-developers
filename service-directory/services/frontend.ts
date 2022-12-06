import { ComponentResource, CustomResourceOptions } from "@pulumi/pulumi";
import { FmBucket } from "../resources/bucket";

type FmFrontendArgs = {
    Name: string;
    Product: string;
}

export class FmFrontend extends ComponentResource {
    constructor(args: FmFrontendArgs, opts?: CustomResourceOptions) {
        const resourceName = `${args.Product}-${args.Name}`;

        super("pkg:index:FmFrontend", resourceName, {}, opts);

        new FmBucket({
            Name: args.Name,
            Product: args.Product,
            Public: true,
        }, {
            parent: this
        });
    }
}
