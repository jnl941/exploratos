import { INode } from './types';

export class Utils {
    private static id = 0;

    static compareObjects(a: any, b: any) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    static createNode(name: string, parentId = 0, isLeaf = false, data: unknown = {}, expanded = false) {
        const id = ++this.id;
        return {
            id,
            name,
            parentId,
            data,
            isLeaf,
            expanded,
            children: [],
        } as INode;
    }
}
