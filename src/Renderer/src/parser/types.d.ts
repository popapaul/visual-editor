
export type IDoc = {
    type: string
    content?: string,
    component?: any,
    voidElemen?: boolean
    name?: string
    attrs?: Record<string, string>
    children?: IDoc[],
    removed?: boolean
}

export type IOptions = {
    components?: string[]
}
