type GenericsType<T> = T | null;

interface UserType {
    firstName: string,
    age: string,
    gender: string,
    userId?: string;
}
type elGeneric<T, S> =  T | S | null;   