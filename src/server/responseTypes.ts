export interface ResponseType<T> {
    data?: T,
    msg?: string
    state?: number
    success?: Boolean
}