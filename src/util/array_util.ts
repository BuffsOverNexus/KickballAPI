
export default function isEmpty(obj: any) {
    if (Array.isArray(obj)) {
        const array = obj as Array<unknown>;
        return array.length == 0;
    } else {
        return true;
    }
}