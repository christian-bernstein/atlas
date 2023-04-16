export type StateDispatcher<T> = ((value: (((prevState: T) => T) | T)) => void)
