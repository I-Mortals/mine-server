

export function isConstructor(item: string, prototype) {
    return item === 'constructor' && typeof prototype[item] === 'function';
}

export function isFunction(item: string, prototype) {
    return typeof prototype[item] === 'function';
}