import { ComponentResource, CustomResourceOptions } from "@pulumi/pulumi";
import { FmDockerImageRepo } from "../resources/ecr-repository";

type FmBackendArgs = {
    Name: string;
    Product: string;
}

export class FmBackend extends ComponentResource {
    constructor(args: FmBackendArgs, opts?: CustomResourceOptions) {
        const resourceName = `${args.Product}-${args.Name}`;

        super("pkg:index:FmBackend", resourceName, {}, opts);

        new FmDockerImageRepo({
            Name: args.Name,
            Product: args.Product,
        }, {
            parent: this
        })
    }
}
