
// 路径生成
export const Path = (name:string)=>{
    const isSymbol = hasSpecialChar(name)

    if(isSymbol) throw new Error(`路径名称存在特殊符号！${name}`);
    return `/${name}`
}
//正则表达式匹配任何非字母、数字和空格的字符
export function hasSpecialChar(input: string): boolean {
    const regex = /[^a-zA-Z0-9 ]/;
    return regex.test(input);
}
